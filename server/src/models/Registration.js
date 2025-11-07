import mongoose from 'mongoose';

const regSchema = new mongoose.Schema({
  conference: { type: mongoose.Schema.Types.ObjectId, ref:'Conference' },
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  ticketType: { type:String, default:'FREE' },
  paid: { type:Boolean, default:false }
}, { timestamps:true });

export default mongoose.model('Registration', regSchema);
