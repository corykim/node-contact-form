# Contact Form with reCAPTCHA

A node service to accept contact forms, using reCAPTCHA to validate the form submission.

## Requirements
- npm
- An SMTP mail server
- An account with [Google reCAPTCHA](https://developers.google.com/recaptcha)

## Configuration
Create a .env file with the following variables:
```
PORT=<port to listen on, default=5000>

RECAPTCHA_SECRET_KEY=<your site's shared secret with Google reCAPTCHA>

SENDTO=<the email address to receive the contact form>

SMTP_HOST=<the SMTP host>
SMTP_PORT=<the SMTP port, default=587>
SMTP_EMAIL=<the email address to login to SMTP>
SMTP_PASS=<the password to login to SMTP>

```

## Endpoint
The server creates an endpoint `/send`, which accepts HTTP POST requests. The request should contain the following data:

| Field | Description |
| ----- | ----------- |
| name | The contact's name |
| firstName | The contact's first name (only if `name` is not provided) |
| lastName | The contact's last name (only if `name` is not provided) |
| email | The contact's email |
| subject | The subject of the email |
| message | The message body of the email |
| token | The reCAPTCHA token sent by the contact form |


The server will attempt to validate the token. If the token is valid, the server will send the contact form via email. The server returns a JSend formatted response to indicate success or failure.

## Running
Use `npm run start`.
