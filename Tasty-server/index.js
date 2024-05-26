require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;

//middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://tasty-99.web.app']
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qemc4ul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const userCollection = client.db('tasty').collection('users');
        const recipeCollection = client.db('tasty').collection('recipes');
        const coinCollection = client.db("tasty").collection("coins");
        const paymentCollection = client.db("tasty").collection("payments");

        // jwt related api
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ token });
        })

        // my middlewares 
        const verifyToken = (req, res, next) => {
            if (!req.headers.authorization) {
                console.log("No token");
                return res.status(401).send({ message: 'unauthorized access' });
            }
            const token = req.headers.authorization.split(' ')[1];
            console.log('got the token', token);
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ message: 'unauthorized access' });
                }
                req.decoded = decoded;
                next();
            });
        };


        // user api
        app.get('/allUsers', verifyToken, async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        app.get('/allUsers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exist', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        // recipe api
        app.get('/recipes', async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const category = req.query.category || "";
            const country = req.query.country || "";
            const title = req.query.title || "";
            const limit = 3;
            let query = {};

            if (category) {
                query.category = category;
            }
            if (country) {
                query.country = { $regex: new RegExp(country, "i") };
            }
            if (title) {
                query.recipeName = { $regex: new RegExp(title, "i") };
            }
            try {
                const projection = {
                    recipeName: 1,
                    recipeImage: 1,
                    purchased_by: 1,
                    creatorEmail: 1,
                    Country: 1
                };

                const totalRecipes = await recipeCollection.countDocuments(query);
                const totalPages = Math.ceil(totalRecipes / limit);

                if (page > totalPages) {
                    return res.status(404).json({ message: "Page not found" });
                }
                const startIndex = (page - 1) * limit;
                const cursor = recipeCollection.find(query, projection).skip(startIndex).limit(limit);
                const result = await cursor.toArray();
                res.json({
                    recipes: result,
                    totalPages: totalPages
                });
            } catch (error) {
                console.error('Error fetching recipes:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });


        app.get('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await recipeCollection.findOne(query);
            res.send(result);
        });

        app.post('/recipes', async (req, res) => {
            const recipe = req.body;
            const result = await recipeCollection.insertOne(recipe);
            res.send(result);
        });

        app.put('/purchase/:id', async (req, res) => {
            const recipeId = req.params.id;
            const userEmail = req.body.email;

            try {
                const recipe = await recipeCollection.findOne({ _id: new ObjectId(recipeId) });
                if (!recipe) {
                    return res.status(404).json({ message: 'Recipe not found' });
                }

                const user = await userCollection.findOne({ email: userEmail });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                if (user.coins < 10) {
                    return res.status(400).json({ message: 'Not enough coins to purchase' });
                }
                const updatedUserCoins = user.coin - 10;
                await userCollection.updateOne({ email: userEmail }, { $set: { coin: updatedUserCoins } });

                const updatedWatchCount = recipe.watchCount ? recipe.watchCount + 1 : 1;
                await recipeCollection.updateOne({ _id: new ObjectId(recipeId) }, { $set: { watchCount: updatedWatchCount } });

                const updatedPurchasedBy = [...recipe.purchased_by, userEmail];
                await recipeCollection.updateOne({ _id: new ObjectId(recipeId) }, { $set: { purchased_by: updatedPurchasedBy } });


                const creator = await userCollection.findOne({ email: recipe.creatorEmail });
                if (creator) {
                    const updatedCreatorCoins = creator.coin ? creator.coin + 1 : 1;
                    await userCollection.updateOne({ email: recipe.creatorEmail }, { $set: { coin: updatedCreatorCoins } });
                }

                res.status(200).json({ message: 'Recipe purchased successfully' });
            } catch (error) {
                console.error('Error purchasing recipe:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });


        // Reaction 
        app.put('/like/:id', async (req, res) => {
            const id = req.params.id;
            const Recipe = req.body;
            console.log(id, Recipe);
            const filter = { _id: new ObjectId(id) }
            const RecipeData = await recipeCollection.findOne(filter);
            const updateRecipe = {};
            const option = { upsert: true };
            if (RecipeData.disLike && RecipeData.disLike.some(vote => vote.email === Recipe.email)) {
                updateRecipe.$pull = { disLike: { email: Recipe.email } };
            }
            updateRecipe.$addToSet = { like: { email: Recipe.email } };
            const result = await recipeCollection.updateOne(filter, updateRecipe, option);
            res.send(result)
        });
        app.put('/disLike/:id', async (req, res) => {
            const id = req.params.id;
            const Recipe = req.body;
            console.log(id, Recipe);
            const filter = { _id: new ObjectId(id) }
            const RecipeData = await recipeCollection.findOne(filter);
            const updateRecipe = {};
            const option = { upsert: true };
            if (RecipeData.like && RecipeData.like.some(vote => vote.email === Recipe.email)) {
                updateRecipe.$pull = { like: { email: Recipe.email } };
            }
            updateRecipe.$addToSet = { disLike: { email: Recipe.email } };
            const result = await recipeCollection.updateOne(filter, updateRecipe, option);
            res.send(result)
        });


        // coin api
        app.get('/coin', async (req, res) => {
            const result = await coinCollection.find().toArray();
            res.send(result);
        });

        app.get('/coin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await coinCollection.findOne(query);
            res.send(result);
        });

        app.post('/coin', async (req, res) => {
            const purchases = req.body;

            try {
                const result = await coinCollection.insertMany(purchases);
                res.status(200).json({ success: true, message: 'Coins purchased successfully', result });
            } catch (error) {
                console.error('Error processing coin purchase:', error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });


        // payment api
        app.post('/create-payment-intent', async (req, res) => {
            const { fee } = req.body;
            const amount = parseInt(fee * 100);
            console.log(amount, 'amount inside the intent')

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            });

            res.send({
                clientSecret: paymentIntent.client_secret
            })
        });

        app.get('/payments/:email', verifyToken, async (req, res) => {
            const query = { email: req.params.email }
            if (req.params.email !== req.decoded.email) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const result = await paymentCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/payments', async (req, res) => {
            const result = await paymentCollection.find().toArray();
            res.send(result);
        });

        app.post('/payments', async (req, res) => {
            const payment = req.body;
            try {
                const result = await paymentCollection.insertOne(payment);
                const user = await userCollection.findOne({ email: payment.email });
                const updatedUserCoins = (user.coin || 0) + payment.coin;
                await userCollection.updateOne({ email: payment.email }, { $set: { coin: updatedUserCoins } });

                res.status(200).json({ success: true, paymentResult: result });
            } catch (error) {
                console.error('Error processing payment:', error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });

    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(`
    <h1 style="text-align:center;font-family:Monospace;">Tasty Server Is Running...</h1>`)
})

app.listen(port, () => {
    console.log(`Tasty Server Is Running On Port: ${port}`)
})