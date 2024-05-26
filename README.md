# Tasty - Recipe Sharing System

Welcome to Tasty, a full-stack web application designed to make discovering and sharing recipes easy and enjoyable. Our platform allows users to browse, share, and interact with a wide variety of recipes from around the world. Built with ReactJS for the front-end, ExpressJS and MongoDB for the back-end, and Firebase for authentication, Tasty ensures a smooth and secure user experience.

## Features

- **Recipe Browsing**: Users can explore various recipes listed on the site.
- **Google Authentication**: Users can register and log in using their Google accounts via Firebase authentication. New users receive 50 coins upon registration.
- **Recipe Viewing**: Users can view detailed recipes by spending 10 coins.
- **Coin Purchase**: Users can purchase coins (100 for $1, 500 for $5, 1000 for $10) to view more recipes.
- **Recipe Contribution**: Users can add new recipes to the system and earn coins when others view their recipes.
- **Interactive UI**: The website features a traditional one-column layout with a responsive navbar, dynamic banner, success stories, and a footer with developer information and social links.

## Layout and Navigation

- **Navbar**: Displays the website name/logo and navigation links. Conditional rendering based on user login status.
  - Before Login: Home, Recipes, Google Login
  - After Login: Home, Recipes, Add Recipes, Coins, User Image, Logout
- **Footer**: Contains personal information and links to social profiles.

## Home Page

- **Banner**: An attractive section with a slogan and two buttons: "See Recipes" (redirects to all recipes) and "Add Recipes" (redirects to login if not logged in).
- **Success Stories**: Showcases the number of recipes and users with counters.
- **Developer Info**: Includes personal information, educational background, experience, and technologies used.

## Login and Registration

- **Google Authentication**: Implemented via Firebase. Users log in and register through Google, no additional forms required. Upon successful login, user information is stored in the database with an initial 50 coins.

## Recipe Management

- **Add Recipes**: A private route where logged-in users can add new recipes. The form includes:
  - Recipe Name
  - Recipe Image (uploaded via imgbb)
  - Recipe Details
  - Embedded YouTube Video Code
  - Country
  - Category (dropdown)
  - Upon submission, the recipe data is stored in the database.

- **All Recipes**: A public route displaying recipes in a card view with specific information (Recipe Name, Image, Creator Email, Country). Clicking "View The Recipe" triggers different actions based on user status and coin balance.

## Recipe Detail

- A private route displaying all details of a recipe, including an embedded YouTube video.

## Coin Purchase

- Users can purchase coins via a payment system. Options include 100 coins for $1, 500 coins for $5, and 1000 coins for $10. Successful transactions update the user's coin balance.

## Additional Features

- **User Reaction System**: Allows logged-in users to react to recipes.
- **Filtering System**: Filters recipes by category and country on the All Recipes page.
- **Search System**: Searches recipes by title on the All Recipes page.
- **Infinite Scrolling**: Loads more recipes as the user scrolls down on the All Recipes page.
- **Suggestion System**: Recommends recipes with the same category or country on the Recipe Detail page.

## Security

- **JWT Authorization**: Implements a local storage-based authorization system for securing API endpoints for logged-in users.

## Live Demo

Check out the live demo of Tasty: [Tasty](https://tasty-99.web.app/)
