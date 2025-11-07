import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  conference: { type: mongoose.Schema.Types.ObjectId, ref:'Conference' },
  title: String,
  room: String,
  start: Date,
  end: Date,
  papers: [{ type: mongoose.Schema.Types.ObjectId, ref:'Submission' }]
}, { timestamps:true });

export default mongoose.model('Session', sessionSchema);
