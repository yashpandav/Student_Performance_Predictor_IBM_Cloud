const express = require('express');
const axios = require('axios');
const app = express();
const port = 2000;
require('dotenv').config();

app.use(express.json());

const API_KEY = 'dTG1ZNPbCpdp1YPs_8EMwdrCvXpwPY5y7OzlIjjpTcja';
const cors = require("cors");
const allowedOrigins = JSON.parse(process.env.ALLOWD_ORIGIN || '[]');
console.log("CORS allowed origins:", allowedOrigins);
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        maxAge: 14400,
    })
);

app.post('/api/predict', async (req, res) => {
    try {
        const tokenResponse = await axios.post(
            'https://iam.cloud.ibm.com/identity/token',
            `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            }
        );
        console.log("Token Response : "  , tokenResponse);
        const token = tokenResponse.data.access_token;  
        console.log('Token:', token);
        console.log(req.body);

        const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/8b8ed81c-7ffd-4180-a44b-02ba9f7e0cce/predictions?version=2021-05-01";
        const scoringResponse = await axios.post(
            scoring_url,
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        );
        res.json(scoringResponse.data);
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error making prediction', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});