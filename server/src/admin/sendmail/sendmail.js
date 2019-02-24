const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = function (app) {

    /**
       * @description Post method for sendmail service
       */
    function sendmail(req, res) { 

        var request = req.body;

console.log("\n\nsendmail - to - " + request.to + " subject - " + request.subject + " text - " + request.text + " html - " + request.html);


        // var to = "dhumilyadein@gmail.com";
        // var to = ['kapil_141290@yahoo.co.in', 'dhumilyadein@gmail.com'];
        // var subject = "Hello dude";
        // var text = 'Whats up';
        // var html = '<h1>Welcome</h1><p>That was easy!</p>';

        var to = request.to;
        var subject = request.subject;
        var text = request.text;
        var html = request.html;

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
                    console.log('Errors', error); 
                    return res.send({ errors: error });

                } else { 
                    console.log('Success', info); 
                    console.log('\nsendmail - Mail response - ' + info.response, info); 
                    response = { response: info, message: "sendmail - Email Sent to " + info.accepted};
                    return res.send(response);
                } 
            }); 
        }); 
    }

    app.post("/api/sendmail", sendmail, (req, res) => {
        console.log("sendmail get service running");
    });

    app.get("/", (req, res) => res.json("sendmail.js"));
};
