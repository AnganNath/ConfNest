import { Router } from 'express';
import Registration from '../models/Registration.js';
import { auth } from '../middleware/auth.js';

const r = Router();

r.post('/', auth(['ATTENDEE','AUTHOR','REVIEWER','CHAIR']), async (req,res)=>{
  const reg = await Registration.create({ ...req.body, user: req.user.id });
  res.json(reg);
});

export default r;
