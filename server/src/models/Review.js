import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  submission: { type: mongoose.Schema.Types.ObjectId, ref:'Submission' },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  score: Number,
  comments: String
}, { timestamps:true });

export default mongoose.model('Review', reviewSchema);
