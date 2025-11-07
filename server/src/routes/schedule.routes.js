import { Router } from 'express';
import Session from '../models/Session.js';
import { auth } from '../middleware/auth.js';

const r = Router();

r.post('/', auth(['CHAIR']), async (req,res)=>{
  const s = await Session.create(req.body);
  res.json(s);
});

r.get('/:confId', async (req,res)=>{
  const list = await Session.find({ conference: req.params.confId })
    .sort({ start:1 })
    .populate('papers','title author');
  res.json(list);
});

export default r;
