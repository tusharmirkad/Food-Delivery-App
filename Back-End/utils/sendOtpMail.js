import nodemailer from "nodemailer";

const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "TOMATO APP <no-reply@tomatoapp.com>",
    to: email,
    subject: "Your OTP for Registration",
    html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 5 minutes</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOtpMail;
