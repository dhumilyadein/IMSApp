const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = function (app) {

    /**
       * @description Post method for SendEmail service
       */
    function sendEmail(req, res) { 

        var to = "dhumilyadein@gmail.com";
        var subject = "Jai Ho";
        var text = 'Jai Ho';
        var html = '<h1>Welcome</h1><p>That was easy!</p>';

        nodemailer.createTestAccount((err, account) => { 
            
            var transporter = nodemailer.createTransport(smtpTransport({
                 host: 'smtp.gmail.com', 
                 port: 465, 
                 secure: true,
                 auth: { 
                     user: 'imsmailtesting@gmail.com', 
                     pass: 'ims@12345' 
                    } })); 

            // var transporter = nodemailer.createTransport( {
            //     service: 'gmail',
            //     secure: true,
            //     auth: { 
            //         user: 'imsmailtesting@gmail.com', 
            //         pass: 'ims@12345' 
            //        } }); 

            // var transporter = nodemailer.createTransport({
            //     "Gmail2":{ 
            //         transport: "SMTP", 
            //         host: "smtp.gmail.com", 
            //         secureConnection: false, 
            //         port: 587, 
            //         requiresAuth: true, 
            //         domains: ["gmail.com", "googlemail.com"] }
            // });

            let mailOptions = { 
                from: 'imsmailtesting@gmail.com', 
                to: to, 
                subject: subject, 
                // html: html,
                text: text
             }; 
                
            transporter.sendMail(mailOptions, (error, info) => { 
                if (error) { 
                    console.log('Error', error); 
                } else { 
                    console.log('Success', info); 
                } 
            }); 
        }); 
    }

    app.get("/api/SendEmail", sendEmail, (req, res) => {
        console.log("SendEmail get service running");
    });

    app.get("/", (req, res) => res.json("SendEmail.js"));
};
