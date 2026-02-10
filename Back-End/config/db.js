import mongoose from "mongoose";

export const connectDB = async() => {
    // const Mongo_Uri = 'mongodb+srv://tusharmirkad:<db_password>@cluster0.o59d3.mongodb.net/?appName=Cluster0' ;
    await mongoose.connect('mongodb+srv://tusharmirkad:9322872204@cluster0.o59d3.mongodb.net/food-del?appName=Cluster0').then(() => console.log("DB Connected")).catch((err) => console.log(err)) ;
}