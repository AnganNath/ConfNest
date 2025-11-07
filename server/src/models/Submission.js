import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  conference: { type: mongoose.Schema.Types.ObjectId, ref:'Conference' },
  author: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  title: String,
  abstract: String,
  fileUrl: String,
  status: { type:String, enum:['UNDER_REVIEW','ACCEPTED','REJECTED'], default:'UNDER_REVIEW' },
  reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }]
}, { timestamps:true });

export default mongoose.model('Submission', submissionSchema);
