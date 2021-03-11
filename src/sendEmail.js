const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ruidevacc@gmail.com",
        pass: "testacc123", // naturally, replace both with your real credentials or an application-specific password
      },
    });

    // let transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: testAccount.user, // generated ethereal user
    //     pass: testAccount.pass, // generated ethereal password
    //   },
    // });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = Handlebars.compile(source);
    console.log(compiledTemplate(payload));
    const options = () => {
      return {
        from: "ruidevacc@gmail.com",
        to: email,
        subject: subject,
        // text: "That was easy!",
        html: compiledTemplate(payload),
      };
    };
    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log(error);
        return error;
      } else {
        console.log(info.response);
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail;
