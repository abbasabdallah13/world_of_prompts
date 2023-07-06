import mongoose from "mongoose";

let isConnected = false; //track the connection

export const connectToDB = async() => {
    mongoose.set('strictQuery', true)

    if(isConnected) {
        console.log('is connected');
        return;
    }

    try {

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'world_of_prompts',
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        isConnected = true;

        console.log('MongoDB connected')
        
    } catch (error) {
        console.log(error.message)
    }
}