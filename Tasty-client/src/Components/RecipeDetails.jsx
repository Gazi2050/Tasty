import { useState, useEffect, useContext } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { AuthContext } from '../Provider/AuthProvider';
import { FaUserFriends } from 'react-icons/fa';
import useAxiosPublic from "../Hooks/useAxiosPublic";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import toast from 'react-hot-toast';
const RecipeDetails = () => {
    const recipe = useLoaderData();
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic()
    const axiosSecure = useAxiosSecure()
    const { data: recipes = [], refetch, } = useQuery({
        queryKey: ['recipes'],
        queryFn: async () => {
            const res = await axiosPublic.get('/recipes');
            return res.data;
        }
    })
    const { _id, creatorEmail, watchCount, purchased_by, recipeName, recipeDetails, category, country, videoLink, img } = recipe;

    let embedUrl = '';
    const extractVideoId = (url) => {
        let videoId = '';
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname === 'youtu.be') {
                videoId = parsedUrl.pathname.slice(1);
            } else if (parsedUrl.hostname === 'www.youtube.com' || parsedUrl.hostname === 'youtube.com') {
                videoId = parsedUrl.searchParams.get('v');
            }
        } catch (error) {
            console.error('Invalid video URL:', url);
        }
        return videoId;
    };

    const videoId = extractVideoId(videoLink);
    if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    const [sameCategoryRecipes, setSameCategoryRecipes] = useState([]);
    const [sameCountryRecipes, setSameCountryRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchSameCategoryRecipes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/recipes?category=${category}`);
            const data = await response.json();
            const filteredRecipes = data.recipes.filter(recipe => recipe._id !== _id);
            setSameCategoryRecipes(filteredRecipes);
        } catch (error) {
            console.error('Error fetching same category recipes:', error);
            setError(true);
        }
    };

    const fetchSameCountryRecipes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/recipes?country=${country}`);
            const data = await response.json();
            const filteredRecipes = data.recipes.filter(recipe => recipe._id !== _id);
            setSameCountryRecipes(filteredRecipes);
        } catch (error) {
            console.error('Error fetching same country recipes:', error);
            setError(true);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchSameCategoryRecipes();
        fetchSameCountryRecipes();
        setLoading(false);
    }, [category, country]);



    const handleLike = async (_id) => {
        try {
            const email = user.email;
            const UpdateRecipe = {
                email
            };
            const response = await axiosSecure.put(`/like/${_id}`, UpdateRecipe);
            const data = await response.data;

            console.log(data);
            if (data.modifiedCount) {
                refetch()
            } else {
                toast.error('Failed to like');
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
            toast.error('Error updating recipe:', error)
        }
    };
    const handleDisLike = async (_id) => {
        try {
            const email = user.email;
            const UpdateRecipe = {
                email
            };
            const response = await axiosSecure.put(`/disLike/${_id}`, UpdateRecipe);
            const data = await response.data;

            console.log(data);
            if (data.modifiedCount) {
                refetch()
            } else {
                toast.error('Failed to disLike');
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
            toast.error('Error updating recipe:', error)
        }
    };


    return (
        <div className="container mx-auto p-4 bg-black text-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="w-full h-full md:w-[60%] lg:w-full lg:col-span-1">
                    <img src={img} alt={recipeName} className="w-full h-auto object-cover rounded-lg shadow-sm shadow-orange-600 lg:w-96" />
                </div>
                <div className="lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <h2 className="text-4xl font-bold mb-4">{recipeName}</h2>
                        <p className="">{recipeDetails}</p>
                        <div className="text-lg mb-2">
                            <span className="font-semibold text-orange-500">Category : </span>{category}
                        </div>
                        <div className="text-lg mb-2">
                            <span className="font-semibold text-orange-500">Country : </span>{country}
                        </div>
                        <div className="text-lg mb-2">
                            <span className="font-semibold text-orange-500">Created by : </span>{creatorEmail}
                        </div>
                        <div className="text-lg mb-2">
                            <span className="font-semibold text-orange-500">Watch Count : </span>{watchCount}
                        </div>
                        <div className="text-lg mb-4">
                            <div className="flex justify-start items-center space-x-2">
                                <p className='font-semibold text-orange-500'>Purchased By :</p> <span className="font-medium">{purchased_by.length}</span> <FaUserFriends className="text-xl text-orange-400" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center mb-4 space-x-2">
                        <button onClick={() => handleLike(_id)} className="text-green-500 btn btn-outline text-3xl"><BiLike /> <span className='text-xl font-bold'>10</span></button>
                        <button onClick={() => handleDisLike(_id)} className="text-red-500 btn btn-outline text-3xl"><BiDislike /> <span className='text-xl font-bold'>10</span></button>
                    </div>
                    {embedUrl ? (
                        <div className="w-full h-56 lg:h-80">
                            <iframe
                                width="100%"
                                height="100%"
                                src={embedUrl}
                                title={recipeName}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-lg shadow-lg"
                            ></iframe>
                        </div>
                    ) : (
                        <p className="text-red-500">Invalid video link</p>
                    )}
                </div>
            </div>
            <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4 text-orange-600 ">Suggestions</h3>
                {loading ? (
                    <p>Loading suggestions...</p>
                ) : (
                    <>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Similar Recipes in the Same Category</h4>
                            {error || sameCategoryRecipes.length === 0 ? (
                                <h1>No matching category suggestions found.</h1>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sameCategoryRecipes.map((recipe) => (
                                        <div key={recipe._id} className="bg-orange-100 text-gray-800 rounded-lg shadow-lg overflow-hidden">
                                            <div className="bg-cover bg-center h-48" style={{ backgroundImage: `url('${recipe.img}')` }}></div>
                                            <div className="p-4">
                                                <h2 className="text-xl font-bold mb-1">{recipe.recipeName}</h2>
                                                <p className="mb-1 text-sm text-gray-400">{recipe.category}</p>
                                                <p className="text-sm font-medium text-gray-600 mb-4 line-clamp-3">{recipe.recipeDetails}</p>
                                                <div className="flex justify-between items-center">
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
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold mb-2">Similar Recipes from the Same Country</h4>
                            {error || sameCountryRecipes.length === 0 ? (
                                <h1>No matching country suggestions found.</h1>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sameCountryRecipes.map((recipe) => (
                                        <div key={recipe._id} className="bg-orange-100 text-gray-800 rounded-lg shadow-lg overflow-hidden">
                                            <div className="bg-cover bg-center h-48" style={{ backgroundImage: `url('${recipe.img}')` }}></div>
                                            <div className="p-4">
                                                <h2 className="text-xl font-bold mb-1">{recipe.recipeName}</h2>
                                                <p className="mb-1 text-sm text-gray-400">{recipe.category}</p>
                                                <p className="text-sm font-medium text-gray-600 mb-4 line-clamp-3">{recipe.recipeDetails}</p>
                                                <div className="flex justify-between items-center">
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
                    </>
                )}
            </div>
        </div>
    );
};

export default RecipeDetails;