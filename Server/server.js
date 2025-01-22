import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import emailRoutes from "./routes/emailRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use("/api/v1", emailRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
