import { createBrowserRouter } from "react-router-dom";
import Root from "../Components/Root";
import ErrorElement from "../Components/ErrorElement";
import Home from "../Components/Home";
import AllRecipes from "../Components/AllRecipes";
import AddRecipe from "../Components/AddRecipe";
import RecipeDetails from "../Components/RecipeDetails";
import PrivateRoute from "./PrivateRoute";
import PurchaseCoin from "../Components/PurchaseCoin";
import Payment from "../Components/Payment";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorElement />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/allRecipes',
                element: <AllRecipes />
            },
            {
                path: '/recipeDetails/:id',
                element: <PrivateRoute><RecipeDetails /></PrivateRoute>,
                loader: ({ params }) => fetch(`https://tasty-server.vercel.app/recipes/${params.id}`)
            },
            {
                path: '/addRecipe',
                element: <PrivateRoute><AddRecipe /></PrivateRoute>
            },
            {
                path: '/purchaseCoin',
                element: <PrivateRoute><PurchaseCoin /></PrivateRoute>
            },
            {
                path: '/payment',
                element: <PrivateRoute><Payment /></PrivateRoute>
            },
        ]
    },
]);