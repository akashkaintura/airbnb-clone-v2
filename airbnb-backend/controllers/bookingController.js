// controllers/bookingController.js
const { v4: uuidv4 } = require('uuid');
const dynamoDB = require('../db');

// Create a Booking
const createBooking = async (req, res) => {
    const { propertyId, startDate, endDate } = req.body;
    const userId = req.user.id; // Assuming user info is attached to req.user after authentication
    const bookingId = uuidv4();

    const params = {
        TableName: 'Bookings',
        Item: {
            bookingId,
            propertyId,
            userId,
            startDate,
            endDate,
            status: 'confirmed'
        },
    };

    try {
        await dynamoDB.put(params).promise();
        res.status(201).json({ message: 'Booking confirmed', bookingId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

// Get Bookings for a User
const getUserBookings = async (req, res) => {
    const userId = req.user.id;

    const params = {
        TableName: 'Bookings',
        IndexName: 'UserIndex', // Assuming there's a GSI on userId
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };

    try {
        const bookings = await dynamoDB.query(params).promise();
        res.status(200).json(bookings.Items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve bookings' });
    }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

    const params = {
        TableName: 'Bookings',
        Key: { bookingId },
        UpdateExpression: 'set status = :status',
        ExpressionAttributeValues: {
            ':status': 'canceled'
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const result = await dynamoDB.update(params).promise();
        res.status(200).json({ message: 'Booking canceled', result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};

module.exports = { createBooking, getUserBookings, cancelBooking };
