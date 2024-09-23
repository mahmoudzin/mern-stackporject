const nodemailer = require("nodemailer");
const sendEmail = (options) => {
  //create transporter
  const trasporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    //activate "less secure app"
  });
  //defaine email options
  //send email
};
