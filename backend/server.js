import 'dotenv/config'; 
import express  from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
import authRoutes from './routes/authentication.js'; 
import cookieParser from 'cookie-parser';


const app=express();
const port=8080;

app.use(cors({
     origin: "https://personalized-ai-assistant-five.vercel.app", // frontend URL
  credentials: true // allow cookies/auth headers
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api',chatRoutes);
app.use("/api/user", authRoutes);

app.listen(port,()=>{
    console.log(`server running on port:${port}`);
    connectDB();
})
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected with database");
    }catch(e){
        console.log("failed to connect",e);
    }
    
}



