import mongoose from "mongoose"

const regSchema = new mongoose.Schema({
  conference: { type: mongoose.Schema.Types.ObjectId, ref:"Conference" },
  user: { type: mongoose.Schema.Types.ObjectId, ref:"User" }
},{timestamps:true})

export default mongoose.model("ConfReg", regSchema)
