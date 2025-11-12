import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import { config } from './config.js';
import authRoutes from './routes/auth.routes.js';
import confRoutes from './routes/conference.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import reviewRoutes from './routes/review.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import regRoutes from './routes/registration.routes.js';
import attendeeRoutes from "./routes/attendee.routes.js"
import confregRoutes from "./routes/confreg.routes.js"

const allowedOrigins = config.CLIENT_URL.split(",");
const app = express();
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))  // <-- ADD THIS LINE

app.get('/', (_req,res)=>res.send('ConfNest API running'));
app.use('/api/auth', authRoutes);
app.use('/api/conferences', confRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/registrations', regRoutes);
app.use("/api/attendee", attendeeRoutes)
app.use("/api/confreg", confregRoutes)


connectDB().then(() => {
  app.listen(config.PORT, () => console.log(`🚀 API on http://localhost:${config.PORT}`));
});
