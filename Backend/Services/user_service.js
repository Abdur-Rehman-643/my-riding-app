const userModel = require('../Models/user_model');

module.exports.createUser = async ({ firstname, lastname, email, password }) => {
    if (!firstname || !email || !password) {
        throw new Error('All fields are required');
    }

    const newUser = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });

    return newUser;
};
