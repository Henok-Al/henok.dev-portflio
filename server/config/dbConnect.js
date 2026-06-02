import mongoose from "mongoose"

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB)
    console.log("db connected")
  } catch (error) {
    console.error("could not connect db", error)
    process.exit(1)
  }
}
