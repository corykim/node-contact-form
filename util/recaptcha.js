/*
    Validate a token via the google recaptcha API
*/

require("dotenv").config();
const axios = require('axios');

const validate = async function(token) {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    return axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            `secret=${secret}&response=NOT${token}`, { 'Content-Type': 'application/x-www-form-urlencoded' },
        )
        .then(function({ data }) {
            return data.success;
        }).catch(function(error) {
            console.error(error);
            return false;
        });
}

module.exports = {
    validate
}