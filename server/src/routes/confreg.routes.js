import { Router } from "express"
import ConfReg from "../models/ConferenceRegistration.js"
import Conference from "../models/Conference.js"
import { auth } from "../middleware/auth.js"

const r = Router()

// attendee registers for a conference
r.post("/:id", auth(["ATTENDEE"]), async (req,res)=>{

  // 1) check if conference closed
  const conf = await Conference.findById(req.params.id)
  if(!conf) return res.status(404).json({message:"Conference not found"})
  if(conf.status === "CLOSED") return res.status(403).json({message:"Conference Closed"})

  // 2) check if already registered
  const existing = await ConfReg.findOne({ conference:req.params.id, user:req.user.id })
  if(existing) return res.status(400).json({message:"Already Registered"})

  // 3) normal registration
  const reg = await ConfReg.create({ conference:req.params.id, user:req.user.id })
  res.json(reg)
})


// get my registrations
r.get("/mine", auth(["ATTENDEE"]), async (req,res)=>{
  const list = await ConfReg.find({ user:req.user.id }).populate("conference")
  res.json(list)
})

export default r
