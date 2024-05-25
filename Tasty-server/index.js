require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors({
    origin: ['http://localhost:5173']
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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        //Collections
        const userCollection = client.db('tasty').collection('users');
        const recipeCollection = client.db('tasty').collection('recipes');

        // user related api
        app.get('/allUsers', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
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

        // recipe related api
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
            console.log("Query parameters received:", { page, category, country, title });
            console.log("Constructed MongoDB query:", query);
            try {
                const totalRecipes = await recipeCollection.countDocuments(query);
                const totalPages = Math.ceil(totalRecipes / limit);

                if (page > totalPages) {
                    return res.status(404).json({ message: "Page not found" });
                }
                const startIndex = (page - 1) * limit;
                const cursor = recipeCollection.find(query).skip(startIndex).limit(limit);
                const result = await cursor.toArray();

                console.log("Recipes found:", result.length);

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
        })

        app.post('/recipes', async (req, res) => {
            const recipe = req.body;
            const result = await recipeCollection.insertOne(recipe);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(`
    <h1 style="text-align:center;font-family:Monospace;">Tasty Server Is Running...</h1>
    <h2 style="text-align:center;font-family:Monospace;"><a href='http://localhost:5000/allUsers'>allUsers</a></h2>
    <h2 style="text-align:center;font-family:Monospace;"><a href='http://localhost:5000/users'>users</a></h2>
    <h2 style="text-align:center;font-family:Monospace;"><a href='http://localhost:5000/recipes'>recipes</a></h2>`)
})

app.listen(port, () => {
    console.log(`Tasty Server Is Running On Port: ${port}`)
})