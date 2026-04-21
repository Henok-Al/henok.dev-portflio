import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    githubUsername: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model("Admin", adminSchema)
