/*
    Validate a token via the google recaptcha API
*/

require("dotenv").config();
const axios = require('axios');

const validate = async function(token, data = {}) {
    const { remoteIP } = data;
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    formData = `secret=${secret}&response=${token}&remoteip=${remoteIP}`;
    // formData = `secret=${secret}&response=${token}`;
    // console.log('formData', formData);

    return axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            formData, { 'Content-Type': 'application/x-www-form-urlencoded' },
        )
        .then(function({ data }) {
            // console.log('data', data);
            return data.success;
        }).catch(function(error) {
            console.error(error);
            return false;
        });
}

module.exports = {
    validate
}