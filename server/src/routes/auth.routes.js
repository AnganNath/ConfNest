import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config.js';

const r = Router();

r.post('/register', async (req,res)=>{
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  res.json({ ok:true, id:user._id });
});

r.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user || !(await user.comparePassword(password)))
    return res.status(400).json({message:'Invalid credentials'});
  const token = jwt.sign({ id:user._id, role:user.role, name:user.name }, config.JWT_SECRET, { expiresIn:'7d' });
  res.json({ token, role:user.role, name:user.name });
});

export default r;
