import mongoose from "mongoose"
import { sendMail } from "../config/nodemailer.js"

const messageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

messageSchema.pre("save", async function (next) {
  try {
    const info = await sendMail(
      this.name,
      this.email,
      this.subject,
      this.message,
    )
    console.log(info)
  } catch (error) {
    console.log("unable to send message")
  }
  next()
})

export default mongoose.model("Message", messageSchema)
