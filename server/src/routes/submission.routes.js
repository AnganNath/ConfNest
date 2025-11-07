import { Router } from 'express';
import Submission from '../models/Submission.js';
import { auth } from '../middleware/auth.js';

const r = Router();

r.post('/', auth(['AUTHOR']), async (req,res)=>{
  const sub = await Submission.create({ ...req.body, author: req.user.id });
  res.json(sub);
});

r.post('/:id/assign', auth(['CHAIR']), async (req,res)=>{
  const { reviewers } = req.body;
  const sub = await Submission.findByIdAndUpdate(req.params.id, { reviewers }, { new:true });
  res.json(sub);
});

r.get('/', auth(['AUTHOR','CHAIR','REVIEWER']), async (req,res)=>{
  const q = req.user.role === 'AUTHOR' ? { author:req.user.id } : {};
  const list = await Submission.find(q).populate('reviewers','name email role');
  res.json(list);
});

export default r;
