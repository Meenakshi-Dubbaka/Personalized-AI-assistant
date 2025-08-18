import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import { verifyUser } from '../middleware/auth.js';

const router=express.Router();
const JWT_SECRET=process.env.JWT_SECRET;

//Register
router.post("/register",async(req,res)=>{
    try{
        const{username,email,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,10);
        const user=new User({
            username,email,password:hashedPassword
        });
        await user.save();
        res.status(201).json({message:"User registered successfully !", user: { id: user._id, username: user.username }});



    }catch(e){
        console.log(e);
        res.status(500).json({error:e.message})
    }
});

//Login
router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid email or password"});
        const isMatch=await bcrypt.compare(password,user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token",token,
            {
                httpOnly:true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "lax",
                secure: false 

            }).json({message:"Login successful !", user: { id: user._id, username: user.username }});

    }catch(e){
        console.log(e);
        res.status(500).json({error:e.message});
    }
});

//Logout
router.post("/logout",verifyUser,async(req,res)=>{
    res.clearCookie("token").json({message:"Logged out !"})
})
 
export default router;