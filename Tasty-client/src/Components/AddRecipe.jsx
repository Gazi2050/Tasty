import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import useAxiosPublic from "../Hooks/useAxiosPublic"
import useAxiosSecure from "../Hooks/useAxiosSecure"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
const AddRecipe = () => {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const onSubmit = async (data) => {
        console.log(data);
        const imageFile = { image: data.img[0] }
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
        if (res.data.success) {
            const recipeItem = {
                creatorEmail: user.email,
                watchCount: 0,
                purchased_by: [],
                recipeName: data.recipeName,
                recipeDetails: data.recipeDetails,
                category: data.category,
                country: data.country,
                videoLink: data.videoLink,
                img: res.data.data.display_url
            }
            const recipeRes = await axiosSecure.post('/recipes', recipeItem);
            if (recipeRes.data.insertedId) {
                reset();
                toast.success('Recipe added successfully');
                navigate('/allRecipes');
            } else {
                toast.error('Failed to add recipe. Please try again.');
            }
        }
        console.log(res.data);
    }
    return (
        <div className="bg-black text-white min-h-screen">
            <div>
                <h1 className="text-center font-bold text-2xl py-2 text-orange-500">Add Recipe</h1>
                <section className="max-w-4xl p-6 mx-auto bg-orange-100 rounded-md shadow-md dark:bg-gray-800">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-3 mt-4 ">
                            <div>
                                <label className="text-gray-700 dark:text-gray-200">Recipe Name</label>
                                <input
                                    required
                                    {...register('recipeName')}
                                    type="text"
                                    placeholder="Enter the recipe name"
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 dark:text-gray-200">Recipe Details</label>
                                <textarea
                                    required
                                    {...register('recipeDetails')}
                                    placeholder="Enter the recipe details"
                                    className="block w-full px-4 py-2 pb-10 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                                />
                            </div>

                            <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-gray-700 dark:text-gray-200">Category</label>
                                    <select
                                        required
                                        {...register('category')}
                                        className="select select-bordered w-full text-black"
                                    >
                                        <option disabled selected>Select Category</option>
                                        <option>Breakfast</option>
                                        <option>Lunch</option>
                                        <option>Dinner</option>
                                        <option>Snack</option>
                                        <option>Dessert</option>
                                        <option>Juice</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-gray-700 dark:text-gray-200">Country</label>
                                    <input
                                        required
                                        {...register('country')}
                                        type="text"
                                        placeholder="Enter the country of origin"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1">
                                <label className="text-gray-700 dark:text-gray-200">Upload Image</label>
                                <input
                                    required
                                    {...register('img')}
                                    type="file"
                                    className="file-input file-input-bordered w-full max-w-xs text-black"
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 dark:text-gray-200" htmlFor="videoEmbed">YouTube Video Embed Code</label>
                                <textarea
                                    required
                                    {...register('videoLink')}
                                    placeholder="Paste the YouTube embed code here"
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                                Add
                            </button>
                        </div>
                        <Toaster />
                    </form>
                </section>
            </div>
        </div>
    );
};

export default AddRecipe;
