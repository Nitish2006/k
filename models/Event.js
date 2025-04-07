import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    coordinatorName: { type: String, required: true },
    coordinatorContact: { type: String, required: true },
    poster: { type: String, required: true },
    phonepeScreenshot: { type: String }, // URL to the uploaded file
    whatsappLink: { type: String, required: true }
});

export default mongoose.model('Event', eventSchema);
