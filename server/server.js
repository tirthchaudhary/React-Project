import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRouter.js';
import aiRouter from './routes/aiRoutes.js';

// database connection

 await connectDB();

const app=express();
const PORT=process.env.PORT || 3000;

app.use(express.json())
app.use(cors({
 origin:['http://localhost:5173','https://react-project-tirth4.vercel.app/app?state=register'],
 credentials:true
}));

app.get("/",(req,res)=>res.send("server is live"));
app.use('/api/users',userRouter);
app.use('/api/resumes',resumeRouter);
app.use('/api/ai',aiRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});