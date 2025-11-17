import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS, 
  },
  tls: {
    rejectUnauthorized: false,
  },
});


transporter.verify(( error) => {

    if(error) {
        console.log("Gmail is Not Ready", error)
    } else {
        console.log("Gmail is ready")
    }
})

export async function SendEmail( to: string, subject: string, body: string) {
    await transporter.sendMail({
        from: `"Your Kart" <${process.env.USER_EMAIL}>`,
        to,
        subject,
        html: body
    })
}

export const sendVerifyEmail = async (to: string, token: string) => {
    const verifyUrl = `${process.env.FE_URL}/verify/${token}`
    const html = `
    <h1> Welcome to Kart </h1>
    <p> Thanks For Registering With Us </p>
    <a href = "${verifyUrl}"> Very Your Email </a>
    <p> If you are already verified, Ignore this mail </p>
    `

    await SendEmail(to, "Verify your Kart Account", html)
}

export const sendResetEmail = async (to: string, token: string) => {
    const ResetUrl = `${process.env.FE_URL}/reset-password/${token}`
    const html = `
    <h1> Reset Your kart Password </h1>
    <p> You have requested to reset your password. Click On the link Below </p>
    <a href = "${ResetUrl}"> Reset Your Password </a>
    <p> If you didn't request this, Ignore this mail. </p>
    `

    await SendEmail(to, "Reset Your Password", html)
}