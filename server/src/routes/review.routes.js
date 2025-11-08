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

r.get('/bySubmission/:id', auth(['REVIEWER']), async (req,res)=>{
  const rev = await Review.findOne({
    submission: req.params.id,
    reviewer: req.user.id
  })
  res.json(rev)
})
// get ALL reviews for submission (chair only)
r.get('/forSubmission/:id', auth(['CHAIR']), async (req,res)=>{
  const list = await Review.find({ submission:req.params.id })
    .populate('reviewer','name email')
  res.json(list)
})



export default r;
