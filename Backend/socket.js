const socketIo = require('socket.io');
const userModel = require('./Models/user_model');
const captainModel = require('./Models/captain_model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async ({ userId, userType }) => {
            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                }
            } catch (err) {
                console.error('Error in join event:', err.message);
            }
        });

        socket.on('update-location-captain', async ({ userId, location }) => {
            if (!location?.ltd || !location?.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: location.ltd,
                        lng: location.lng
                    }
                });
            } catch (err) {
                console.error('Location update failed:', err.message);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, { event, data }) => {
    if (io) {
        io.to(socketId).emit(event, data);
    } else {
        console.log('Socket.io not initialized.');
    }
};

module.exports = { initializeSocket, sendMessageToSocketId };
