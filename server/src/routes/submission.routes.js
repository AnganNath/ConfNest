import { Router } from 'express';
import Submission from '../models/Submission.js';
import { auth } from '../middleware/auth.js';

const r = Router();

// CREATE submission (AUTHOR)
r.post('/', auth(['AUTHOR']), async (req,res)=>{
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
r.get('/', auth(['AUTHOR','CHAIR','REVIEWER']), async (req,res)=>{
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
r.get('/byConf/:id', auth(['AUTHOR','CHAIR','REVIEWER']), async (req,res)=>{
  let q = { conference: req.params.id }

  // if author: show only their own papers
  if(req.user.role === 'AUTHOR'){
    q.author = req.user.id
  }

  const list = await Submission.find(q)
  res.json(list)
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
