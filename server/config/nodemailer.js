import nodemailer from "nodemailer"
import { template } from "../utils/template.js"

let transporter = null

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.HOST,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    })
  }
  return transporter
}

export const sendMail = async (name, email, subject, message) => {
  const transport = getTransporter()
  const info = await transport.sendMail({
    from: email,
    to: process.env.USER,
    subject: subject,
    html: template(name, email, subject, message),
  })
  if (!info) {
    throw new Error("Unable to send message")
  }
  return info
}
