import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Add connection verification
transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP Connection failed:", error);
  } else {
    console.log("SMTP Server is ready");
  }
});

export default transporter;