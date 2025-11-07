import mongoose from 'mongoose';

const conferenceSchema = new mongoose.Schema({
  title: String,
  description: String,
  tracks: [String],
  importantDates: {
    submissionDeadline: Date,
    reviewDeadline: Date
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref:'User' }
}, { timestamps:true });

export default mongoose.model('Conference', conferenceSchema);
