import mongoose from 'mongoose';
import dotenv from 'dotenv'; 

dotenv.config();  

const connectDB = async () => {
  try {
    // Make sure MONGO_URI is loaded correctly
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;  
