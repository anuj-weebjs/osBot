const express = require('express');
const mongoose = require('mongoose');
const afkModel = require('./model/afkSchema');

async function main(CONNECTIONSTRING) {
    var connection = await connectDb(CONNECTIONSTRING).then(() => console.log("Connected to DataBase")).catch((err) => { console.log("Failed to connect Database") });

    async function connectDb(connectionString) {
        const connection = await mongoose.connect(connectionString);
        return connection;
    }
}

module.exports = {
    main: {
            connect: async(CONNECTIONSTRING)=>{
                await main(CONNECTIONSTRING)
            },
            writeAfkData: async (userid, reason, createdAt) =>{
                console.log("writting")
                const afk = new afkModel({
                    userId: userid,
                    reason: reason,
                    createdAt: createdAt
                })

                await afk.save();
            },
            readAfkData: async(userid) =>{
                const data = afkModel.find({userId: userid})
                return await data;
            },
            deleteAfkData: async(userid) =>{
                const data = afkModel.deleteMany({userId: userid})
                return await data;
            }
        }
}