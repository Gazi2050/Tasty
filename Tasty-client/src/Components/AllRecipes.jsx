import axios from "axios";
import { useState, useEffect } from "react";

const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState("All");
    const [country, setCountry] = useState("");
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/recipes`, {
                    params: {
                        page: page,
                        category: category === "All" ? "" : category,
                        country: country
                    }
                });
                const { recipes: newRecipes, totalPages: newTotalPages } = response.data;

                if (newRecipes.length === 0) {
                    setNoResults(true);
                } else {
                    setNoResults(false);
                }
                setRecipes(prevRecipes => page === 1 ? newRecipes : [...prevRecipes, ...newRecipes]);
                setTotalPages(newTotalPages);
            } catch (error) {
                console.error('Error fetching recipes:', error);
                setNoResults(true);
            }
        };
        if (page <= totalPages) {
            fetchData();
        }
    }, [page, totalPages, category, country]);

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setPage(1);
        setRecipes([]);
        setNoResults(false);
    };

    const handleCountryChange = (event) => {
        setCountry(event.target.value);
        setPage(1);
        setRecipes([]);
        setNoResults(false);
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <h1 className="text-center font-bold text-2xl py-4 text-orange-500">All Recipes</h1>
            <div className="px-5">
                <div className="flex p-2 overflow-hidden border border-orange-600 rounded-lg">
                    <input
                        className="px-6 py-2 text-white placeholder-gray-500 outline-none focus:placeholder-transparent w-full bg-transparent"
                        type="text"
                        placeholder="Search here"
                        required
                    />
                    <div className="flex justify-center items-center">
                        <button type="submit" className="btn btn-sm border-2 text-lg hover:bg-orange-100">Search</button>
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center my-5 px-5">
                <select className="select select-bordered w-full max-w-xs text-black" onChange={handleCategoryChange}>
                    <option value="All">All</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Juice">Juice</option>
                </select>
            </div>
            <div className="flex justify-end items-center my-5 px-5">
                <input
                    type="text"
                    className="input input-bordered w-full max-w-xs text-black"
                    placeholder="Enter country"
                    value={country}
                    onChange={handleCountryChange}
                />
            </div>
            <div className="mt-5 px-5">
                {noResults ? (
                    <h1 className="text-center text-2xl text-red-500">
                        No recipes found
                    </h1>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map(recipe => (
                            <div key={recipe._id} className="bg-orange-100 text-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform lg:hover:scale-105">
                                <div className="bg-cover bg-center h-48" style={{ backgroundImage: `url('${recipe.img}')` }}></div>
                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-1">{recipe.recipeName}</h2>
                                    <p className="mb-1 text-sm text-gray-400">{recipe.category}</p>
                                    <p className="text-sm font-medium text-gray-600 mb-4 line-clamp-3">{recipe.recipeDetails}</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-orange-600 font-medium">{recipe.country}</p>
                                        <button className="btn btn-sm text-lg bg-orange-300">View The Recipe</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllRecipes;
