const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dynamoDB = require('../db');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register User
const register = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Define DynamoDB parameters
    const params = {
        TableName: 'Users',
        Item: {
            email,
            password: hashedPassword,
        },
    };

    try {
        await dynamoDB.put(params).promise();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// Login User
const login = async (req, res) => {
    const { email, password } = req.body;

    const params = {
        TableName: 'Users',
        Key: {
            email
        }
    };

    try {
        const result = await dynamoDB.get(params).promise();
        if (result.Item && await bcrypt.compare(password, result.Item.password)) {
            const token = generateToken(result.Item.email);
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to log in' });
    }
};

module.exports = { register, login };
