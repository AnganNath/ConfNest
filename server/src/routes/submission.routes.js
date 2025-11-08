import { Router } from 'express';
import Submission from '../models/Submission.js';
import { auth } from '../middleware/auth.js';
import Conference from "../models/Conference.js"; 
import ConfReg from "../models/ConferenceRegistration.js" // <-- add on top

const r = Router();

// CREATE submission (AUTHOR)
r.post('/', auth(['AUTHOR']), async (req,res)=>{
  const conf = await Conference.findById(req.body.conference)
  if(!conf) return res.status(404).json({message:"Conference not found"})

  if(conf.status === "CLOSED")
    return res.status(400).json({message:"Conference is closed. Submissions disabled."})

  const sub = await Submission.create({ ...req.body, author: req.user.id });
  res.json(sub);
});

// ASSIGN reviewers (CHAIR)
r.post('/:id/assign', auth(['CHAIR']), async (req,res)=>{
  const { reviewers } = req.body;
  const sub = await Submission.findByIdAndUpdate(req.params.id, { reviewers }, { new:true });
  res.json(sub);
});

// GET submissions depending on role
r.get('/', auth(['AUTHOR','CHAIR','REVIEWER','ATTENDEE']), async (req,res)=>{
  let q = {}

  if (req.user.role === 'AUTHOR') {
    q = { author: req.user.id }
  }

  if (req.user.role === 'REVIEWER') {
    q = { reviewers: req.user.id }
  }

  // CHAIR sees all → q stays empty

  const list = await Submission.find(q).populate('reviewers','name email role');
  res.json(list);
});

// *** NEW: submissions for a specific conference ***
r.get('/byConf/:id', auth(['AUTHOR','CHAIR','REVIEWER','ATTENDEE']), async (req,res)=>{

  // CHAIR SEE ALL
  if(req.user.role === "CHAIR"){
    const list = await Submission.find({conference:req.params.id})
    return res.json(list)
  }

  // AUTHOR → only own
  if(req.user.role === "AUTHOR"){
    const list = await Submission.find({conference:req.params.id, author:req.user.id})
    return res.json(list)
  }

  // REVIEWER → only those assigned to reviewer
  if(req.user.role === "REVIEWER"){
    const list = await Submission.find({conference:req.params.id, reviewers:req.user.id})
    return res.json(list)
  }

  // ATTENDEE:
  const reg = await ConfReg.findOne({ conference:req.params.id, user:req.user.id })
  if(!reg){
    return res.status(403).json({message:"Not registered for this conference"})
  }

  // ATTENDEE sees only ACCEPTED papers
  const list = await Submission.find({conference:req.params.id, status:"ACCEPTED"})
  return res.json(list)
})




// chair decides accept/reject
r.post('/:id/decision', auth(['CHAIR']), async (req,res)=>{
  const { decision } = req.body
  if(!['ACCEPTED','REJECTED'].includes(decision))
    return res.status(400).json({message:"Invalid decision"})
  
  const sub = await Submission.findByIdAndUpdate(
    req.params.id,
    { status:decision },
    { new:true }
  )
  res.json(sub)
})


export default r;
