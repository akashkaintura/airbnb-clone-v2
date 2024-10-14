// db.js
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

// Configure AWS with access credentials and region
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Instantiate DynamoDB Document Client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDB;
