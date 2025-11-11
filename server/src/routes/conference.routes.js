import { Router } from 'express';
import Conference from '../models/Conference.js';
import { auth } from '../middleware/auth.js';
import Submission from "../models/Submission.js";
import Review from "../models/Review.js";
import ConferenceRegistration from "../models/ConferenceRegistration.js";


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
// DELETE a conference (CHAIR only)
r.delete('/:id', auth(['CHAIR']), async (req, res) => {
  try {
    const confId = req.params.id;

    // Delete submissions linked to this conference
    const subs = await Submission.find({ conference: confId });
    const subIds = subs.map(s => s._id);

    // Delete reviews for those submissions
    await Review.deleteMany({ submission: { $in: subIds } });

    // Delete all submissions
    await Submission.deleteMany({ conference: confId });

    // Delete registrations
    await ConferenceRegistration.deleteMany({ conference: confId });

    // Finally, delete the conference itself
    await Conference.findByIdAndDelete(confId);

    res.json({ message: "Conference and all related data deleted successfully" });
  } catch (err) {
    console.error("Error deleting conference:", err);
    res.status(500).json({ message: "Error deleting conference" });
  }
});


export default r;
