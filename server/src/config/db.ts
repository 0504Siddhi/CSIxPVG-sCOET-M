import mongoose from 'mongoose';
import { setOfflineMode, initOfflineStore } from './offlineStore';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/csi_pvg';
    await mongoose.connect(connUri, { serverSelectionTimeoutMS: 3000 });
    console.log(`MongoDB Connected: ${connUri}`);
  } catch (error) {
    console.error('⚠️ Error connecting to MongoDB, falling back to In-Memory store:', error);
    setOfflineMode(true);
    await initOfflineStore();
  }
};
