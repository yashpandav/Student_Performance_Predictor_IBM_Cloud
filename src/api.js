import axios from 'axios';

const API_KEY = process.env.REACT_APP_IBM_API_KEY; // Use environment variable

async function getToken() {
    try {
        console.log('Retrieving access token');
        const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
        const response = await axios.post(CORS_PROXY + 'https://iam.cloud.ibm.com/identity/token',
            `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            }
        );
        console.log('Access token retrieved');
        return response.data.access_token;
    } catch (error) {
        console.error("Error retrieving token:", error.message);
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", error.response.data);
        }
        throw error;
    }
}

async function apiPost(scoring_url, token, payload) {
    try {
        console.log('Sending scoring request');
        const response = await axios.post(scoring_url, payload, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        console.log('Scoring response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error making scoring request:", error);
        throw error;
    }
}

export async function main(payload) {
    try {
        const token = await getToken();
        const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/8b8ed81c-7ffd-4180-a44b-02ba9f7e0cce/predictions?version=2021-05-01";
        const scoringResponse = await apiPost(scoring_url, token, payload);
        return scoringResponse.predictions[0].values[0];
    } catch (error) {
        console.error("An error occurred:", error.message);
        throw error;
    }
}