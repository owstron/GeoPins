const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

require('dotenv').config()

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
    // verify User
    const googleUser = await verifyUser(token);
    // check existing User
    const user = await checkIfUserExists(googleUser.email);
    // create New User
    return user ? user : createNewUser(googleUser);
}


const verifyUser = async token => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID
        })
        return ticket.getPayload();
    } catch (err) {
        console.error(`Error verifying auth token:; `, err)
    }
}

const checkIfUserExists = async email => await User.findOne({ email }).exec();

const createNewUser = googleUser => {
    const { name, email, picture } = googleUser;
    const user = { name, email, picture };
    return new User(user).save();
}