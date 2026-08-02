import { Request, Response } from 'express';
import { TeamMember } from '../models/TeamMember';
import { Event } from '../models/Event';
import { News } from '../models/News';
import { Testimonial } from '../models/Testimonial';
import { 
  isOfflineMode, 
  offlineTeam, 
  offlineEvents, 
  offlineNews, 
  offlineTestimonials 
} from '../config/offlineStore';

export const getTeam = async (req: Request, res: Response) => {
  try {
    if (isOfflineMode) {
      const sorted = [...offlineTeam].sort((a, b) => a.order - b.order);
      return res.json(sorted);
    }
    const team = await TeamMember.find({}).sort({ order: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members' });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    if (isOfflineMode) {
      const sorted = [...offlineEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return res.json(sorted);
    }
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const getNews = async (req: Request, res: Response) => {
  try {
    if (isOfflineMode) {
      const sorted = [...offlineNews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json(sorted);
    }
    const news = await News.find({}).sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news' });
  }
};

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    if (isOfflineMode) {
      const sorted = [...offlineTestimonials].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return res.json(sorted);
    }
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials' });
  }
};

export const registerForEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isOfflineMode) {
      const event = offlineEvents.find(e => e._id === id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      event.registrationCount = (event.registrationCount || 0) + 1;
      return res.json({ message: 'Registered for event successfully (In-Memory)', event });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.registrationCount = (event.registrationCount || 0) + 1;
    await event.save();

    res.json({ message: 'Registered for event successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for event' });
  }
};
