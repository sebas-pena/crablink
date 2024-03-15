import mongoose from "mongoose";

// Import the models to ensure they are registered with mongoose
import { Link } from "./models/Link";
import { User } from "./models/User";

export const connectDB = () => {
  return mongoose.connect(import.meta.env.MONGODB_URI);
}