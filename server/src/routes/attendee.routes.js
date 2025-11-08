import { Router } from "express"
import User from "../models/User.js"
import bcrypt from "bcryptjs"

const r = Router()

r.post("/register", async (req,res)=>{
  const {name,email,password} = req.body
  const emailClean = email.trim().toLowerCase()
  const passwordClean = password.trim()
  const hashed = await bcrypt.hash(passwordClean, 10)

  const u = await User.create({ name, email:emailClean, password:hashed, role:"ATTENDEE" })
  res.json(u)
})

export default r
