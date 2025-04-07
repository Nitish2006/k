import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String,required:true,unique: true},
    password:{ type: String, required:true},
    regid:{ type: String, required:true, unique:true},
    branch:{type:String, required:true},
    year:{type:String,  required:true},
    createdAt:{ type: Date, default:Date.now},
});
export default mongoose.model("User", userSchema);