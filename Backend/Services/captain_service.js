const captainModel = require('../Models/captain_model');

module.exports.createCaptain = async ({
    firstname,
    lastname,
    email,
    password,
    color,
    plate,
    capacity,
    vehicleType
}) => {
    if (
        !firstname ||
        !email ||
        !password ||
        !color ||
        !plate ||
        !capacity ||
        !vehicleType
    ) {
        throw new Error('All fields are required');
    }

    const newCaptain = await captainModel.create({
        fullname: {
            firstname,
            lastname,
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType,
        },
        location: {
            ltd: 31.5764,
            lng: 74.4060,
        },
    });

    return newCaptain;
};
