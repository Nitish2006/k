import mongoose from "mongoose";
 const eventSchema = new mongoose.Schema({
    name: { type: String, rquired:true},
    date:{type:Date, rquired:true},
    coordinatorName:{ type: String, required: true},
    coordinatorContact:{type: String, required:true},
    poster: { type: String, required:true},
    phonepeScreenchot:{ type: String, requred:true},
    whatsappLink: { type:String,required: true},
    createdAt: { type: Date, default: Date.now},
 });
 export default mongoose.model('Event',eventSchema);