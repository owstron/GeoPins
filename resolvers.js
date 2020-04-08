const { AuthenticationError } = require('apollo-server');

const user = {
    _id: "1",
    name: "Nik",
    email: "nikesh@minerva.kgi.edu", 
    picture: "https://res.cloudinary.com/nikeshshrestha/image/upload/v1585722580/sample.jpg"
}

const authenticated = next => (root, args, ctx, info) => {
    if (!ctx.currentUser) {
        throw new AuthenticationError('You maybe already logged in')
    }
    return next(root, args, ctx, info)
}

module.exports = {
    Query: {
        me: authenticated((root, args, ctx) => ctx.currentUser)
    }
}