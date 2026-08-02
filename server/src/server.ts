import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/db';
import { seedDatabase } from './config/seeder';
import { isOfflineMode } from './config/offlineStore';

// Import controllers
import * as authController from './controllers/authController';
import * as publicController from './controllers/publicController';
import * as adminController from './controllers/adminController';

// Import middlewares
import { authenticateToken, verifyAdmin } from './middleware/auth';
import { upload } from './middleware/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup CORS with Credentials support
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists and is served statically
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Connect database and seed
connectDB().then(() => {
  if (!isOfflineMode) {
    seedDatabase();
  }
});

// --- API ROUTES ---

// 1. Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);
app.post('/api/auth/forgot-password', authController.forgotPassword);
app.get('/api/auth/profile', authenticateToken as any, authController.getProfile as any);

// 2. Public Content Routes
app.get('/api/public/team', publicController.getTeam);
app.get('/api/public/events', publicController.getEvents);
app.get('/api/public/news', publicController.getNews);
app.get('/api/public/testimonials', publicController.getTestimonials);
app.post('/api/public/events/:id/register', publicController.registerForEvent);

// 3. Admin Control Routes
app.get('/api/admin/analytics', [authenticateToken as any, verifyAdmin as any], adminController.getAnalytics as any);
app.get('/api/admin/students', [authenticateToken as any, verifyAdmin as any], adminController.getStudents as any);
app.delete('/api/admin/students/:id', [authenticateToken as any, verifyAdmin as any], adminController.deleteStudent as any);

// Team Members CRUD
app.post('/api/admin/team', [authenticateToken as any, verifyAdmin as any, upload.single('photo')], adminController.createTeamMember as any);
app.put('/api/admin/team/:id', [authenticateToken as any, verifyAdmin as any, upload.single('photo')], adminController.updateTeamMember as any);
app.delete('/api/admin/team/:id', [authenticateToken as any, verifyAdmin as any], adminController.deleteTeamMember as any);

// Events CRUD
app.post('/api/admin/events', [authenticateToken as any, verifyAdmin as any, upload.single('image')], adminController.createEvent as any);
app.put('/api/admin/events/:id', [authenticateToken as any, verifyAdmin as any, upload.single('image')], adminController.updateEvent as any);
app.delete('/api/admin/events/:id', [authenticateToken as any, verifyAdmin as any], adminController.deleteEvent as any);

// News CRUD
app.post('/api/admin/news', [authenticateToken as any, verifyAdmin as any, upload.single('image')], adminController.createNews as any);
app.put('/api/admin/news/:id', [authenticateToken as any, verifyAdmin as any, upload.single('image')], adminController.updateNews as any);
app.delete('/api/admin/news/:id', [authenticateToken as any, verifyAdmin as any], adminController.deleteNews as any);

// Testimonials CRUD
app.post('/api/admin/testimonials', [authenticateToken as any, verifyAdmin as any, upload.single('avatar')], adminController.createTestimonial as any);
app.put('/api/admin/testimonials/:id', [authenticateToken as any, verifyAdmin as any, upload.single('avatar')], adminController.updateTestimonial as any);
app.delete('/api/admin/testimonials/:id', [authenticateToken as any, verifyAdmin as any], adminController.deleteTestimonial as any);

// Fallback status check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.listen(PORT, () => {
  console.log(`CSI PVG Server running on port ${PORT}`);
});
