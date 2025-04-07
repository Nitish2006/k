import mongoose from 'mongoose';

async function connectDB() {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI); // Debug URI

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected successfully');

    // Optional: Add event listeners for connection status
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit on failure
  }
}

export default connectDB;
