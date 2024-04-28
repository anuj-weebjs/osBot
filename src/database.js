const mongoose = require('mongoose');
const userModel = require('./model/userSchema.js');

async function main(CONNECTIONSTRING) {
    var connection = await connectDb(CONNECTIONSTRING).then(() => {
        console.log("Connected to DataBase")
    }).catch((err) => {
        console.log("Failed to connect Database " + err)
    });

    async function connectDb(connectionString) {
        const connection = await mongoose.connect(connectionString);

        return connection;
    }
}

module.exports = {
    main: {

        connect: async (CONNECTIONSTRING) => {
            await main(CONNECTIONSTRING)
        },
    },
    common: {
        start: async (userid, startedat) => {
            const user = new userModel({
                userInfo: {
                    id: userid,
                    startedAt: startedat
                },
            })
            await user.save();
            return user;
        },
    }

}