# Connectify: A Social Media Website

Welcome to the Connectify project! This repository contains the source code for a fully-functional social media platform. Connectify is designed to help users create profiles, post updates, follow other users, and interact with posts through likes and comments. Our goal is to provide a seamless and engaging social networking experience.

## Demo

A live demo of Connectify can be found [here](#).

## Features

- **User Authentication**:

  - **Sign Up**: Users can create a new account.
  - **Login**: Users can log in to their account using JWT for secure authentication.
  - **Logout**: Users can log out from their account.

- **User Profile**:

  - **Get Profile**: View a user profile by username.
  - **Update Profile**: Update user profile information.

- **Posts**:

  - **Create Post**: Users can create new posts.
  - **View All Posts**: Retrieve all posts on the platform.
  - **View Liked Posts**: Get posts liked by the authenticated user.
  - **View Following Posts**: Get posts from users that the authenticated user follows.
  - **View User Posts**: Retrieve posts by a specific user.
  - **Like/Unlike Post**: Users can like or unlike a post.
  - **Comment on Post**: Users can comment on a post.
  - **Delete Post**: Users can delete their own posts.

- **Notifications**:

  - **Get Notifications**: Retrieve notifications for the authenticated user.
  - **Delete Notifications**: Delete notifications for the authenticated user.

- **User Interaction**:
  - **Follow/Unfollow User**: Users can follow or unfollow other users.
  - **Suggested Users**: Get a list of suggested users to follow.

## Technologies

- **Backend**:

  - **Node.js**: JavaScript runtime used to build the server-side application.
  - **Express.js**: Web application framework for Node.js to build RESTful APIs.
  - **MongoDB**: NoSQL database for storing user and post data.
  - **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
  - **dotenv**: Loads environment variables from a `.env` file.
  - **bcryptjs**: Library for hashing passwords securely.
  - **jsonwebtoken**: Used for secure user authentication using JWT tokens.
  - **cookie-parser**: Middleware to parse cookies attached to the client request object.
  - **cors**: Middleware to enable Cross-Origin Resource Sharing (CORS).
  - **cloudinary**: Cloud service for storing and serving user-uploaded images.

- **Security**:

  - **JWT (JSON Web Tokens)**: For secure authentication and maintaining user sessions.
  - **bcryptjs**: For hashing and salting passwords to enhance security.

- **Development**:
  - **Node.js**: JavaScript runtime used to build the server-side application.
  - **Express.js**: Web application framework for Node.js to build RESTful APIs.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/connectify.git
   ```
2. Navigate to the project directory:
   ```bash
   cd connectify-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Update .env with your configuration
   ```

## Usage

1. Start the development server:
   ```bash
   nodemon index
   ```
2. Open your browser and navigate to `http://localhost:5000`.

Feel free to further customize the README as needed for your specific project details!
