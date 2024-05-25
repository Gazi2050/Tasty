import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ category: "All", country: "", title: "" });
    const [noResults, setNoResults] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            console.log("Fetching data with:", { page, ...filters });
            const { data } = await axios.get(`http://localhost:5000/recipes`, {
                params: {
                    page,
                    category: filters.category === "All" ? "" : filters.category,
                    country: filters.country,
                    title: filters.title
                }
            });
            const { recipes: newRecipes, totalPages: newTotalPages } = data;

            setNoResults(newRecipes.length === 0);
            setRecipes(prevRecipes => page === 1 ? newRecipes : [...prevRecipes, ...newRecipes]);
            setTotalPages(newTotalPages);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setNoResults(true);
        }
    }, [page, filters]);

    useEffect(() => {
        fetchData();
    }, [page, filters, fetchData]);

    const handleScroll = useCallback(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5 && page < totalPages) {
            setPage(prevPage => prevPage + 1);
        }
    }, [page, totalPages]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleFilterChange = (type) => (event) => {
        setFilters(prevFilters => ({ ...prevFilters, [type]: event.target.value }));
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
                        placeholder="Search here recipes"
                        value={filters.title}
                        onChange={handleFilterChange('title')}
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end items-center my-5 px-5">
                <select className="select select-bordered w-full max-w-xs text-black" onChange={handleFilterChange('category')} value={filters.category}>
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
                    value={filters.country}
                    onChange={handleFilterChange('country')}
                />
            </div>
            <div className="mt-5 p-2">
                {noResults ? (
                    <h1 className="text-center text-2xl text-red-500">
                        No recipes found
                    </h1>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                        {recipes.map(recipe => (
                            <div key={recipe._id} className="bg-orange-100 text-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform lg:hover:scale-105">
                                <div className="bg-cover bg-center h-48" style={{ backgroundImage: `url('${recipe.img}')` }}></div>
                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-1">{recipe.recipeName}</h2>
                                    <p className="mb-1 text-sm text-gray-400">{recipe.category}</p>
                                    <p className="text-sm font-medium text-gray-600 mb-4 line-clamp-3">{recipe.recipeDetails}</p>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm text-orange-600 font-medium">{recipe.country}</p>
                                        <Link to={`/recipeDetails/${recipe._id}`} className="btn btn-sm text-lg bg-orange-300 hover:text-orange-600 hover:bg-black">View The Recipe</Link>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        <p>author : <span className="font-medium">{recipe.creatorEmail}</span></p>
                                        <div className="flex justify-start items-center space-x-1">
                                            <p>Purchased By :</p> <span className="font-medium">{recipe.purchased_by.length}</span> <FaUserFriends className="text-lg" />
                                        </div>
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
