const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        }

        await transporter.sendMail(mailOptions);
        console.log("email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = { sendEmail };