import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://taskmanager.com/"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)

    const emailHtml = mailGenerator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    }

    try{
        await transporter.sendMail(mail)
    }catch(error){
        console.error("Email service failed silently. Make sure that you have provided your MAILTRAP credentials in the .env file")
        console.error("Error: ",error);
    }
    
}

const emailVerificationMailgenContent = (username, verificationUrl) =>{
    return {
        body: {
            name: username,
            intro: "Welcome to our app! we are excited",
            action:{
                instruction: "To verify your email please click on the button below.",
                button: {
                    color: "#22BC66",
                    text: "Verfiy your email",
                    link: verificationUrl
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

const forgotPasswordMailgenContent = (username, PasswordResetUrl) =>{
    return {
        body: {
            name: username,
            intro: "We got a request to reset your password of your account",
            action:{
                instruction: "To reset your password please click on the button below or link.",
                button: {
                    color: "#22BC66",
                    text: "Reset your password",
                    link: PasswordResetUrl
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

export {emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail};