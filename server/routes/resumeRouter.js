import express from 'express';
import {protect} from '../middleware/authMiddleware.js'
import { createResume, deleteResume, getPublicResumeById, getResume, updateResume } from '../controllers/resumeController.js';
import upload from '../config/multer.js';

const resumeRouter=express.Router();

resumeRouter.post('/create',protect,createResume);
resumeRouter.put('/update',upload.single('image'),protect,updateResume);
resumeRouter.delete('/delete/:resumeId',protect,deleteResume);
resumeRouter.get('/get/:resumeId',protect,getResume);
resumeRouter.get('/public/:resumeId',getPublicResumeById);

export default resumeRouter;