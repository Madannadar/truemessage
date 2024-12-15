// lib name ka folder aanewala h for shardcn

import mongoose from "mongoose";
import { log } from "node:console";

type ConntectionObject = {
    isConnected?: number
}

const connection: ConntectionObject = {}

async function dbConnect(): Promise<void>{  // void means i dont care what kind of data is coming 
    if (connection.isConnected) {
        console.log("Already connected to database");
        return 
    }

    try {
        const db = await mongoose.connect(process.env.MONGOODB_URI || '', {}) // if not then give empty string
        // console.log(db);
        connection.isConnected = db.connections[0].readyState
        console.log("db connected succesfully",db);
        
    }catch (error){
        console.log("database connection failed",error);
        
        process.exit(1)
    }
}

export default dbConnect