const HttpStatus = require('http-status-codes');
const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");
const uuidV4 = require('uuid/v4');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: 'ic2.dashboard@gmail.com',
      refreshToken: '1/YpCLb6jDzAYF7ouC_tqmX1jNnjIGx-Gg5RoU1OUDXkE',
      clientId: '719528510666-4no6i07egne6r8ii6214p4321cg9o6j7.apps.googleusercontent.com',
      clientSecret: '4sggDA-uaVm0hmEpxNZvomNa',
      accessToken: 'ya29.GlsOBMB0iK0_wnf5gRFXj7t6cPbN4quXTUGRZ_cgg9PDM7pgcAQvDm4IE_DYEo2A2lL3VF6dpeABPVhoc6-2hEh-7a48cooyeB5kXT1UE-aOWQXkXrXd5hCT3syd',
      expires: 3600
  }
  
});

function createVerificationLink(req, uuid) {

    console.log('uuid', uuid);

    // Generating random string.
    let encodedMail = new Buffer(req.body.email).toString('base64');
    let link=`http://${req.get('host')}/verify?mail=${encodedMail}&id=${uuid}`;

      return link;

}

module.exports = {
    sendVerificationEmail: (req, res, next) => {
        console.log('sending verification email...');

        let link = createVerificationLink(req, res.locals.uuid);

        // setup email data with unicode symbols
        let mailOptions = {
            from: 'ic2.dashboard@gmail.com', // sender address
            to: 'angelo.angeles@nz.fujitsu.com', // list of receivers
            subject: '[Stock-Take Account] E-mail address verification', // Subject line
            html: `Hello,<br> Please Click on the link to verify your email.<br><a href="${link}">Click here to verify</a>` // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
        
        res.status(HttpStatus.OK).send({
            status: HttpStatus.OK
        });
        
    }
}