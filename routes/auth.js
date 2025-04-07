import express from "express";
import bcrypt from "bcryptjs";
import jwt from  "jsonwebtoken";
import User from '../models/User.js';
import Admin from '../models/Admin.js';
const router = express.Router();

router.post('/register', async (req,res)=>{
    const { username,password,regid,branch,year}=req.body;
    try{
        let user = await User.findOne({username});
        if(user) res.status(400).json({message:'user already exists'});

        user = new User({
            username,
            password: await bcrypt.hash(password,10),
            regid,
            branch,
            year,
        });
        await user.save();
        const token= jwt.sign({id: user._id, role:'user'},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token});
    } catch(error){
        res.status(500).json({message:error.message});
    }
});


router.post('/login',async(req,res)=>{
    const { username,passwrd}= req.body;
    try{
        let user =await User.finfOne({usrname});
        let role ='user';
        if(!user){
            user= await Admin.findone({username});
            role='admin';
            if(!user)return res.status(400).json({message:'Invalid crendtials'});
        }
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});
        const token= jwt.sign({id:user._id,role},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token});
    } catch (error){
        res.status(500).json({message:error.message});
    }
});
 router.post('/reset-pasword',async (req,res)=>{
    const { username, newPassword}=req.body;
    try{
        let user = await User.findOne({username});
        if(!user){
            user= await Admin.findOne({username});
            if(!user) return res.status(400).json({message:'user not found'});
        }
        user.password= await bcrypt.hash(newPassword,10);
        await user.save();
        res.json({message:'password reset sucessfully'});
    }catch(error){
        res.status(500).json({message:error.message});
    }
 });
 export default router;