import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config.js';
import { auth } from '../middleware/auth.js'
import bcrypt from "bcryptjs"



const r = Router();

r.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log("REGISTER BODY RAW:", req.body)

    const hashed = await bcrypt.hash(password, 10)
    console.log("HASHED PASSWORD:", hashed)

    const user = await User.create({ name, email, password: hashed, role: "AUTHOR" })
    console.log("USER SAVED:", user)

    res.json(user)
  } catch (e) {
    console.log("REGISTER ERROR:", e)
    res.status(500).json({ message: "register failed" })
  }
})



r.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: "No such user" })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(400).json({ message: "Wrong password" })

  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
  console.log("LOGIN FOUND USER:", user)
  console.log("LOGIN BODY RAW:", req.body)
  console.log("Comparing password:", password, " against hash:", user.password)
  res.json({
    token,
    role: user.role,
    name: user.name
  })
})


r.get('/reviewers', auth(['CHAIR']), async (req, res) => {
  const reviewers = await User.find({ role: 'REVIEWER' }).select('name email role')
  res.json(reviewers)
})
r.post("/createReviewer", auth(["CHAIR"]), async (req, res) => {
  let { name, email, password } = req.body

  const emailClean = email.trim().toLowerCase()
  const passwordClean = password.trim()
  const hashed = await bcrypt.hash(passwordClean, 10)

  const user = await User.create({ name, email: emailClean, password: hashed, role: "REVIEWER" })
  res.json(user)
})
export default r;
