// Inspired from https://lo-victoria.com/how-to-build-a-contact-form-with-javascript-and-nodemailer

const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();
const { app, express } = require('../express');
const { validate } = require('../util/recaptcha');

/*
    Configuration: .env should have the following variables:
    - HOST: The transport host
    - PORT: The port to listen on (default=5000)
    - EMAIL: The email address that will send the contact form
    - PASS: The password for logging into SMTP
    - SENDTO (optional, falls back to EMAIL)

    The contact form should POST to the /send endpoint, with the following FORM data
    - firstName
    - lastName
    - name (optional, instead of firstName, lastName)
    - email (of the person contacting me)
    - subject
    - message
*/

app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, //replace with your email provider
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    },
});

// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

app.post("/send", (req, res) => {
    //1.
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function(err, fields) {
        if (!fields) {
            // try just parsing the body
            fields = req.body;
        }

        if (fields) {
            Object.keys(fields).forEach(function(property) {
                data[property] = fields[property].toString();
            });

            // validate the token
            const token = data['token'];
            validate(token).then(valid => {
                if (valid) {
                    const name = data.name || `${data.firstName || '[NO FIRST NAME]'} ${data.lastName || '[NO LAST NAME]'}`;

                    //2. You can configure the object however you want
                    const mail = {
                        from: name,
                        to: process.env.SENDTO || process.env.SMTP_EMAIL,
                        subject: data.subject,
                        text: `${name} <${data.email}> \n${data.message}`,
                    };

                    //3.
                    transporter.sendMail(mail, (err, data) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({ status: 'fail', message: "Something went wrong." });
                        } else {
                            res.status(200).send({ status: 'success' });
                        }
                    });
                } else {
                    res.status(400).send({ status: 'fail', message: "Recaptcha token was not valid." })
                }
            })
        } else {
            console.error("Could not parse form fields from request", req.body);
            res.status(500).send('Could not parse form fields');
        }
    });
});