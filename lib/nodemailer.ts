import { createTransport } from "nodemailer"

// create reusable transporter object using the default SMTP transport
let transporter = createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export default transporter

// // create reusable transporter object using the default SMTP transport
//  let transporter = nodemailer.createTransport({
//   service: "gmail",
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // setup email data with unicode symbols
// let mailOptions = {
//   from: process.env.SMTP_FROM, // sender address
//   to: "medamin.dev@gmail.com", // list of receivers
//   subject: "Test Email from Node.js", // Subject line
//   text: "Hello, this is a test email from Node.js!", // plain text body
//   html: "<b>Secure</b>", // html body
// };

// export default transporter
