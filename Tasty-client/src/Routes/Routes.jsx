import { createBrowserRouter } from "react-router-dom";
import Root from "../Components/Root";
import ErrorElement from "../Components/ErrorElement";
import Home from "../Components/Home";
import AllRecipes from "../Components/AllRecipes";
import AddRecipe from "../Components/AddRecipe";

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
                path: '/addRecipe',
                element: <AddRecipe />
            },
        ]
    },
]);