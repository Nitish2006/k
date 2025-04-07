import express from "express";
import Event from '../models/Event.js';
import authMiddleware from "../middleware/authMiddleware.js";
const router= express.Router();
router.get('/', async(req,res)=>{
    try{
        const events= await Event.find();
        res.json(events); 
    } catch(error){
        res.status(500).json({message:error.message});
    }
});
//add event
router.post('/',authMiddleware,async(req,res)=>{
    if(req.user.role!=='admin')return res.status(403).json({message:'Acess denied'});
    const{name,date,coordinatorName,coordinatorContact,poster,phonepeScreenshot,WhatsappLink}=req.body;
    try{
        const event= new Event({name,date,coordinatorName,coordinatorContact,poster,phonepeScreenshot,WhatsappLink});
        await event.save();
        res.status(201).json(event);
    }catch(error){
        res.status(500).json({message:error.message});
    }
});
//delete event
router.delete('/:id',authMiddleware,async(req,res)=>{
    if(req.user.role!=='admin') return res.status(403).json({message:'Access denied'});
    try{
        await Event.findByIdAndDelete(req.params.id);
        res.json({message:'Event Deleted'});
    }catch(error){
        res.status(500).json({message:error.message});
    }
});
export default router;