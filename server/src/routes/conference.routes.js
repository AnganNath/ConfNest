import { Router } from 'express';
import Conference from '../models/Conference.js';
import { auth } from '../middleware/auth.js';

const r = Router();

r.post('/', auth(['CHAIR']), async (req,res)=>{
  const conf = await Conference.create({ ...req.body, createdBy: req.user.id });
  res.json(conf);
});

r.get('/', async (_req,res)=>{
  const list = await Conference.find().sort({createdAt:-1});
  res.json(list);
});

export default r;
