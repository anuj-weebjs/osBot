import { User } from "discord.js";

var client = require('../index').client;

export const getUserById = async (id: string): Promise<User> =>{

    let user = await client.users.fetch(id);

    if (!user.globalName) {
        user.globalName = user.username;
    }

    return user;

}