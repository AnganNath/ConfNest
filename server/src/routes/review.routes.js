import { Router } from 'express';
import Review from '../models/Review.js';
import Submission from '../models/Submission.js';
import { auth } from '../middleware/auth.js';

const r = Router();

r.post('/', auth(['REVIEWER']), async (req,res)=>{
  const { submission, score, comments } = req.body;
  const sub = await Submission.findById(submission);
  if(!sub.reviewers.map(String).includes(req.user.id))
    return res.status(403).json({message:'Not assigned'});
  const rev = await Review.create({ submission, reviewer:req.user.id, score, comments });
  res.json(rev);
});

export default r;
