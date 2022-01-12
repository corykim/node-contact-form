const express = require("express");

// instantiate an express app
const app = express();

//port will be 5000 for testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

module.exports = {
    app,
    express
};