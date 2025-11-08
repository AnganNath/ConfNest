import { Router } from 'express';
import Conference from '../models/Conference.js';
import { auth } from '../middleware/auth.js';

const r = Router();

// CREATE conference (CHAIR only)
r.post('/', auth(['CHAIR']), async (req,res)=>{
  const conf = await Conference.create({ ...req.body, createdBy: req.user.id });
  res.json(conf);
});

// GET ALL conferences
r.get('/', async (_req,res)=>{
  const list = await Conference.find().sort({createdAt:-1});
  res.json(list);
});

// *** NEW: GET SINGLE conference by ID ***
r.get('/:id', async (req,res)=>{
  const conf = await Conference.findById(req.params.id);
  if(!conf) return res.status(404).json({message:"Conference not found"});
  res.json(conf);
});

r.post("/:id/close", auth(["CHAIR"]), async (req,res)=>{
  const updated = await Conference.findByIdAndUpdate(req.params.id, {status:"CLOSED"}, {new:true})
  res.json(updated)
})

export default r;
