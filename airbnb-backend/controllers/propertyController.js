// controllers/propertyController.js
const { v4: uuidv4 } = require('uuid');
const dynamoDB = require('../db');

// Create Property
const createProperty = async (req, res) => {
    const { title, description, price, location } = req.body;
    const hostId = req.user.id; // Assuming `req.user` has user info after authentication
    const propertyId = uuidv4();

    const params = {
        TableName: 'Properties',
        Item: {
            propertyId,
            title,
            description,
            price,
            location,
            hostId,
        },
    };

    try {
        await dynamoDB.put(params).promise();
        res.status(201).json({ message: 'Property created successfully', propertyId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create property' });
    }
};

// Get All Properties
const getProperties = async (req, res) => {
    const params = {
        TableName: 'Properties'
    };

    try {
        const properties = await dynamoDB.scan(params).promise();
        res.status(200).json(properties.Items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
};

// Get Property by ID
const getPropertyById = async (req, res) => {
    const { propertyId } = req.params;

    const params = {
        TableName: 'Properties',
        Key: { propertyId }
    };

    try {
        const property = await dynamoDB.get(params).promise();
        if (property.Item) {
            res.status(200).json(property.Item);
        } else {
            res.status(404).json({ error: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch property' });
    }
};

// Update Property
const updateProperty = async (req, res) => {
    const { propertyId } = req.params;
    const { title, description, price, location } = req.body;

    const params = {
        TableName: 'Properties',
        Key: { propertyId },
        UpdateExpression: 'set title = :title, description = :description, price = :price, location = :location',
        ExpressionAttributeValues: {
            ':title': title,
            ':description': description,
            ':price': price,
            ':location': location,
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const updatedProperty = await dynamoDB.update(params).promise();
        res.status(200).json({ message: 'Property updated successfully', updatedProperty });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update property' });
    }
};

// Delete Property
const deleteProperty = async (req, res) => {
    const { propertyId } = req.params;

    const params = {
        TableName: 'Properties',
        Key: { propertyId }
    };

    try {
        await dynamoDB.delete(params).promise();
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete property' });
    }
};

module.exports = { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty };
