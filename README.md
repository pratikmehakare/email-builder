# Email Builder Project

This project is an **Email Builder** application built using **React**, **Vite**, **Node.js**, **Express**, **MongoDB**, and **Cloudinary**. It provides an intuitive interface for creating, previewing, and saving email templates. The app also includes an HTML preview of the generated email and allows image uploads to enhance the templates.

The project is built with a **full-stack architecture**, where **React** and **Vite** handle the frontend, while **Node.js** and **Express** manage the backend. MongoDB is used for storing email templates, and **Cloudinary** is used for image storage.

## Features

### Frontend (React + Vite)
- **Create Email Templates**: Add a title, content, and footer to generate personalized email templates.
- **Live Preview**: Instantly view a live preview of the email template as you edit it.
- **Image Upload**: Upload images to use in the email template (supports PNG, JPEG, and GIF formats) using **Cloudinary**.
- **Save Template**: Save your email templates for later use in **MongoDB**.
- **Render & Download**: Render the final HTML of your email template and download it as a file.

### Backend (Node.js + Express + MongoDB + Cloudinary)
- **API for Template Management**: Backend provides endpoints to save, retrieve, and manage email templates.
- **Image Upload to Cloudinary**: Upload images to **Cloudinary** and retrieve the URL to store in the email template.
- **MongoDB**: Store email templates in a MongoDB database for persistence.

## Project Setup

This project uses **Vite** as the build tool for the frontend and **Node.js** with **Express** for the backend. It also uses **MongoDB** for data storage and **Cloudinary** for image management.

### Requirements

- **Node.js**: >= v16.0.0
- **npm** or **yarn** for package management
- **MongoDB**: A running MongoDB instance (local or cloud)
- **Cloudinary**: A Cloudinary account for image storage

### Environment Variables

#### Frontend (.env)

The frontend requires the following environment variable:

- **VITE_API_BASE_URL**: The base URL for your backend API. Add /api/v1 after backend URL.

#### Backend (.env)

The backend requires the following environment variables for connecting to MongoDB, Cloudinary, and setting API keys:

- **MONGO_URI**: The URI for connecting to your MongoDB database (local or cloud)

- **PORT**: The port on which the backend server will run. 

- **API_SECRET**: A secret key for your API (used for authentication or any security-related purpose). 

- **API_KEY**: The API key for Cloudinary integration. 

- **CLOUD_NAME**: Your Cloudinary cloud name for image uploads. 
