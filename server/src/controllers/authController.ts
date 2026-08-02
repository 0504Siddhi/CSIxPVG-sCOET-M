import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { isOfflineMode, offlineUsers } from '../config/offlineStore';

const JWT_SECRET = process.env.JWT_SECRET || 'csi_secret_key_2026';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, department, year, registrationNumber } = req.body;

    if (!name || !email || !password || !department || !year) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailKey = email.toLowerCase();
    const role = emailKey === 'csi@pvgcoet.ac.in' ? 'admin' : 'student';
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Offline Fallback ---
    if (isOfflineMode) {
      const existing = offlineUsers.find(u => u.email === emailKey);
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: emailKey,
        password: hashedPassword,
        role,
        department,
        year,
        registrationNumber,
        createdAt: new Date()
      };
      offlineUsers.push(newUser);
      return res.status(201).json({ message: 'User registered successfully (In-Memory)', role });
    }

    // --- Mongoose Mode ---
    const existingUser = await User.findOne({ email: emailKey });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email: emailKey,
      password: hashedPassword,
      role,
      department,
      year,
      registrationNumber
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', role });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailKey = email.toLowerCase();

    // --- Offline Fallback ---
    if (isOfflineMode) {
      const user = offlineUsers.find(u => u.email === emailKey);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          year: user.year
        }
      });
    }

    // --- Mongoose Mode ---
    const user = await User.findOne({ email: emailKey });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const actualRole = user.email === 'csi@pvgcoet.ac.in' ? 'admin' : user.role;
    if (user.email === 'csi@pvgcoet.ac.in' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: actualRole },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: actualRole,
        department: user.department,
        year: user.year
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    // --- Offline Fallback ---
    if (isOfflineMode) {
      const user = offlineUsers.find(u => u._id === req.user!.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password, ...details } = user;
      return res.json(details);
    }

    // --- Mongoose Mode ---
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const emailKey = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // --- Offline Fallback ---
    if (isOfflineMode) {
      const user = offlineUsers.find(u => u.email === emailKey);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.password = hashedPassword;
      return res.json({ message: 'Password reset successful (In-Memory)' });
    }

    // --- Mongoose Mode ---
    const user = await User.findOne({ email: emailKey });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
