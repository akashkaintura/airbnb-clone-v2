// routes/property.js
const express = require('express');
const { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty } = require('../controllers/propertyController');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// CRUD routes for properties
router.post('/', createProperty); // Create a new property
router.get('/', getProperties); // Get all properties
router.get('/:propertyId', getPropertyById); // Get a specific property by ID
router.put('/:propertyId', updateProperty); // Update a property by ID
router.delete('/:propertyId', deleteProperty); // Delete a property by ID
router.post('/', authMiddleware, createProperty); // Create a new property (protected)

module.exports = router;
