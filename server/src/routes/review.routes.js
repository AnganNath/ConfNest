import { Router } from 'express';
import Review from '../models/Review.js';
import Submission from '../models/Submission.js';
import { auth } from '../middleware/auth.js';

const r = Router();

/**
 * POST /reviews
 * Reviewer submits a review for a paper.
 */
r.post('/', auth(['REVIEWER']), async (req, res) => {
  const { submission, score, comments } = req.body;

  // ensure submission exists
  const sub = await Submission.findById(submission);
  if (!sub) return res.status(404).json({ message: 'Submission not found' });

  // ensure reviewer is assigned to this submission
  if (!sub.reviewers.map(String).includes(req.user.id))
    return res.status(403).json({ message: 'Not assigned' });

  // prevent duplicate review by same reviewer
  const existing = await Review.findOne({ submission, reviewer: req.user.id });
  if (existing) return res.status(400).json({ message: 'Already reviewed' });

  const rev = await Review.create({ submission, reviewer: req.user.id, score, comments });
  res.json(rev);
});

/**
 * GET /reviews/bySubmission/:id
 * Unified route — chairs see all reviews, reviewers see their own.
 * Also supports author view (for accepted papers later).
 */
r.get('/bySubmission/:id', auth(['CHAIR', 'REVIEWER', 'AUTHOR']), async (req, res) => {
  // If reviewer — return only their review
  if (req.user.role === 'REVIEWER') {
    const rev = await Review.findOne({
      submission: req.params.id,
      reviewer: req.user.id
    });
    return res.json(rev ? [rev] : []);
  }

  // If chair or author — return all reviews for this submission
  const list = await Review.find({ submission: req.params.id })
    .populate('reviewer', 'name email');
  res.json(list);
});

/**
 * LEGACY: GET /reviews/forSubmission/:id
 * (Kept temporarily for backward compatibility)
 * Chair can fetch all reviews for a given submission.
 */
r.get('/forSubmission/:id', auth(['CHAIR']), async (req, res) => {
  const list = await Review.find({ submission: req.params.id })
    .populate('reviewer', 'name email');
  res.json(list);
});

export default r;
