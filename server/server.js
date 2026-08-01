import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRouter.js';
import aiRouter from './routes/aiRoutes.js';

const app = express();

app.use(express.json())
const allowedOrigins = [
  'http://localhost:5173',
  'https://react-project-tirth4.vercel.app'
];

if (process.env.CLIENT_URL) {
  try {
    const parsed = new URL(process.env.CLIENT_URL);
    if (!allowedOrigins.includes(parsed.origin)) {
      allowedOrigins.push(parsed.origin);
    }
  } catch (e) {
    const sanitized = process.env.CLIENT_URL.trim().replace(/\/$/, "");
    if (sanitized && !allowedOrigins.includes(sanitized)) {
      allowedOrigins.push(sanitized);
    }
  }
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


// database connection
await connectDB();


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("server is live"));
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
