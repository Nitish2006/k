import mongoose from "mongoose"
const paymentSchema = new mongoose.Schema({
    eventName: { type: String, required:true},
    username: { type: String, required:true},
    regid: { type: String, required:true},
    paymentMethod:{type: String, required:true},
    screenshotUrl:{ type: String},
    timestamp: { type:Date, default: Date.now},
});
export default mongoose.model('Payment',paymentSchema);