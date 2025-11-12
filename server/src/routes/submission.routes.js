import { Router } from 'express';
import Submission from '../models/Submission.js';
import Review from '../models/Review.js';
import Conference from "../models/Conference.js";
import { auth } from '../middleware/auth.js';
import ConfReg from "../models/ConferenceRegistration.js";

const r = Router();

// CREATE submission (AUTHOR)
r.post('/', auth(['AUTHOR']), async (req, res) => {
  const conf = await Conference.findById(req.body.conference);
  if (!conf) return res.status(404).json({ message: "Conference not found" });

  if (conf.status === "CLOSED")
    return res.status(400).json({ message: "Conference is closed. Submissions disabled." });

  const sub = await Submission.create({ ...req.body, author: req.user.id });
  res.json(sub);
});

// ASSIGN reviewers (CHAIR)
r.post('/:id/assign', auth(['CHAIR']), async (req, res) => {
  const { reviewers } = req.body;
  const sub = await Submission.findByIdAndUpdate(req.params.id, { reviewers }, { new: true });
  res.json(sub);
});


// GET submissions depending on role
r.get('/', auth(['AUTHOR','CHAIR','REVIEWER','ATTENDEE']), async (req,res)=>{
  let q = {}

  if (req.user.role === 'AUTHOR') {
    q = { author: req.user.id }
  }
  if (req.user.role === 'REVIEWER') {
    q = { reviewers: req.user.id }
  }

  const list = await Submission.find(q)
    .populate('conference', 'title')  // <--- Add this
    .populate('reviewers', 'name email role');

  res.json(list);
});


// submissions for a specific conference
r.get('/byConf/:id', auth(['AUTHOR','CHAIR','REVIEWER','ATTENDEE']), async (req,res)=>{
  const confId = req.params.id;
  let q = { conference: confId };

  // Authors see only their own
  if (req.user.role === 'AUTHOR') {
    q.author = req.user.id;
  }

  // Reviewers see only assigned
  else if (req.user.role === 'REVIEWER') {
    q.reviewers = req.user.id;
  }

  // Attendees — must be registered
  else if (req.user.role === 'ATTENDEE') {
    const reg = await ConfReg.findOne({ user: req.user.id, conference: confId });
    if (!reg) {
      // Not registered — return only basic info (no file URLs)
      const subs = await Submission.find({ conference: confId })
        .select("title abstract status");
      return res.json(subs);
    }
  }

  const list = await Submission.find(q);
  res.json(list);
});

// NEW: Pending Reviews for Reviewers
r.get('/pending-reviews', auth(['REVIEWER']), async (req, res) => {
  // Find all submissions assigned to this reviewer
  const assigned = await Submission.find({ reviewers: req.user.id });

  // Find all reviews already submitted by this reviewer (distinct submission ids)
  const reviewedRaw = await Review.find({ reviewer: req.user.id }).distinct('submission');

  // normalize to string ids for reliable comparison
  const reviewedIds = reviewedRaw.map(id => id.toString());

  // Filter only unreviewed submissions (by this reviewer)
  const pending = assigned.filter(sub => !reviewedIds.includes(sub._id.toString()));

  res.json(pending);
});

// NEW: Pending Decisions for Chairs
r.get('/pending-decisions', auth(['CHAIR']), async (req, res) => {
  // Find all conferences created by this chair
  const confs = await Conference.find({ createdBy: req.user.id }).distinct('_id');

  // Find submissions belonging to those conferences that are still under review
  const subs = await Submission.find({
    conference: { $in: confs },
    status: 'UNDER_REVIEW'
  });

  if (!subs.length) return res.json([]);

  // Find submissions among those that have at least one review
  const subIds = subs.map(s => s._id);
  const reviewedRaw = await Review.distinct('submission', {
    submission: { $in: subIds }
  });

  const reviewedIds = reviewedRaw.map(id => id.toString());

  // Keep only those subs that have reviews (pending decision)
  const pending = subs.filter(s => reviewedIds.includes(s._id.toString()));

  res.json(pending);
});

// chair decides accept/reject
r.post('/:id/decision', auth(['CHAIR']), async (req, res) => {
  const { decision } = req.body;
  if (!['ACCEPTED', 'REJECTED'].includes(decision))
    return res.status(400).json({ message: "Invalid decision" });

  const sub = await Submission.findById(req.params.id);
  if (!sub) return res.status(404).json({ message: "Submission not found" });

  // Prevent re-decision if already finalized
  if (sub.status === 'ACCEPTED' || sub.status === 'REJECTED') {
    return res.status(400).json({ message: `Submission already ${sub.status}` });
  }

  const updated = await Submission.findByIdAndUpdate(
    req.params.id,
    { status: decision },
    { new: true }
  );
  res.json(updated);
});

export default r;
