const axios = require('axios').default;

require('dotenv').config();
const { NODEMAILER_USER, NODEMAILER_PASSWORD, SITE_DOMAIN, SITE_DOMAIN_LOCAL, npm_lifecycle_event } = process.env;
const domain = npm_lifecycle_event === 'dev' ? SITE_DOMAIN_LOCAL : SITE_DOMAIN;

const sendMailer = async (recipientEmail, token) => {
    const html = `<html>
     <head>
         <style>
             .one:hover{color:#887766}
         </style>
     </head>
     <div>
         <a class="one" href="${domain}/auth/verify/${token}">Welcome to Budget tracker app. You can verify you email by click this link</a>
     </div>
</html>`;
    return await axios({
        method: 'post',
        url: 'https://esputnik.com/api/v1/message/email',
        data: {
            "subject": "registry",
            "from": "apicontentpes@gmail.com",
            "htmlText": html,
            "emails": [recipientEmail]
        },
        auth: {
            "user": NODEMAILER_USER,
            "password": NODEMAILER_PASSWORD
        }
    }).then(res => console.log("response: ", res.status))
        .catch(er => console.log('er: ', er));
}
module.exports = sendMailer;



