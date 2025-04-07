//import mongoose from "mongoose";
//async function connectDB() {
   // console.log('MONGO_URI:', process.env.MONGO_URI);
   // try {
     //   await mongoose.connect(process.env.MONGO_URI, {
         //   useNewUrlParser: true,
       //     useUnifiedTopology: true,
        //});
        //console.log(" MONGO DB connected");
   // } catch (error) {
       // console.error("Mongodb connection error, error", error);
      //  process.exit(1);
   // }
//}
//export default connectDB;
import mongoose from "mongoose";

async function connectDB() {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI); // Debug
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MONGO DB connected");
  } catch (error) {
    console.error("Mongodb connection error:", error);
    process.exit(1);
  }
}

export default connectDB;

