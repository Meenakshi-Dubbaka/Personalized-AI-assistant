import express from 'express';
import Thread from '../model/Thread.js';
import getOpenAiResponse from '../utils/openAi.js';
import { verifyUser } from '../middleware/auth.js'; 

const router=express.Router();


// get all threads
router.get("/thread",verifyUser,async(req,res)=>{
    try{
        const Threads=await Thread.find({userId:req.user.id}).sort({updatedAt:-1});
        res.json(Threads);

    }catch(e){
        console.log(e)
        res.status(500).json({error:"failed to fetch"})
    }
})

//get thread by Id
router.get("/thread/:threadId",verifyUser,async(req,res)=>{
    const {threadId}=req.params;
    try{
        const thread = await Thread.findOne({ threadId,userId:req.user.id });
        if(!thread){
            res.status(404).json({error:"thread not found"});
        }
        res.json(thread.messages);

    }catch(e){
        console.log(e)
        res.status(500).json({error:"failed to fetch"})
    }
})

//delete thread(chat)
router.delete("/thread/:threadId",verifyUser,async(req,res)=>{
    const {threadId}=req.params;
    try{
        let deletethread=await Thread.findOneAndDelete({threadId,userId:req.user.id})
        console.log(deletethread);
        if(!deletethread){
            res.status(404).json({error:"thread not found"})
        }
        res.status(200).json({success:"thread deleted succesfully!"})
    }catch(e){
        console.log(e)
        res.status(500).json({error:"failed to fetch"})   ;
    }
})

router.post("/chat",verifyUser,async(req,res)=>{
    const {threadId,message}=req.body;
    if(!threadId||!message){
        res.status(400).json({error:"missing required fields"})
    }
    try{
        let thread= await Thread.findOne({threadId,userId:req.user.id})
        if(!thread){
            //create new therad in DB
            thread=new Thread({
                threadId,
                title:message,
                userId: req.user.id,
                messages:[{role:"user",content:message}]
            })
        }else{
            thread.messages.push({role:"user",content:message})
        }
        const assistantReply = await getOpenAiResponse(message);
        if (!assistantReply) {
             return res.status(500).json({ error: "Assistant reply is empty" });
             }
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt=new Date()
        await thread.save();
        res.json({reply:assistantReply})
    }catch(e){
        console.log(e)
        res.status(500).json({error:"something went wrong"});
    }
});

export default router;