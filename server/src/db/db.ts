import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const uri = mongoUri.startsWith("mongodb://") || mongoUri.startsWith("mongodb+srv://") 
            ? mongoUri 
            : `mongodb://${mongoUri}`;

        const connectionInstance = await mongoose.connect(uri);
        
        return connectionInstance;
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;