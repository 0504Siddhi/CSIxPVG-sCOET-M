import { Request, Response } from 'express';
import { TeamMember } from '../models/TeamMember';
import { Event } from '../models/Event';
import { News } from '../models/News';
import { Testimonial } from '../models/Testimonial';
import { User } from '../models/User';
import { 
  isOfflineMode, 
  offlineUsers, 
  offlineTeam, 
  offlineEvents, 
  offlineNews, 
  offlineTestimonials 
} from '../config/offlineStore';

// --- Analytics ---
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    if (isOfflineMode) {
      const studentCount = offlineUsers.filter(u => u.role === 'student').length;
      const totalRegistrations = offlineEvents.reduce((sum, e) => sum + (e.registrationCount || 0), 0);
      return res.json({
        students: studentCount,
        events: offlineEvents.length,
        news: offlineNews.length,
        testimonials: offlineTestimonials.length,
        team: offlineTeam.length,
        registrations: totalRegistrations
      });
    }

    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalEvents = await Event.countDocuments();
    const totalNews = await News.countDocuments();
    const totalTestimonials = await Testimonial.countDocuments();
    const totalTeam = await TeamMember.countDocuments();

    const events = await Event.find({});
    const totalRegistrations = events.reduce((sum, evt) => sum + (evt.registrationCount || 0), 0);

    res.json({
      students: totalStudents,
      events: totalEvents,
      news: totalNews,
      testimonials: totalTestimonials,
      team: totalTeam,
      registrations: totalRegistrations
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

// --- Team Management ---
export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const { name, designation, category, department, year, linkedinUrl, githubUrl, order } = req.body;
    let photoUrl = '/placeholder.png';

    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.photoUrl) {
      photoUrl = req.body.photoUrl;
    }

    if (isOfflineMode) {
      const newMember = {
        _id: 'team_' + Date.now(),
        name,
        designation,
        category,
        department,
        year,
        photoUrl,
        linkedinUrl: linkedinUrl || '',
        githubUrl: githubUrl || '',
        order: order ? Number(order) : 0
      };
      offlineTeam.push(newMember);
      return res.status(201).json(newMember);
    }

    const member = new TeamMember({
      name,
      designation,
      category,
      department,
      year,
      photoUrl,
      linkedinUrl,
      githubUrl,
      order: order ? Number(order) : 0
    });

    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team member' });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.photoUrl = `/uploads/${req.file.filename}`;
    }

    if (isOfflineMode) {
      const idx = offlineTeam.findIndex(m => m._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Team member not found' });
      offlineTeam[idx] = { ...offlineTeam[idx], ...updateData };
      return res.json(offlineTeam[idx]);
    }

    const member = await TeamMember.findByIdAndUpdate(id, updateData, { new: true });
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error updating team member' });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isOfflineMode) {
      const idx = offlineTeam.findIndex(m => m._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Team member not found' });
      offlineTeam.splice(idx, 1);
      return res.json({ message: 'Team member deleted' });
    }

    const member = await TeamMember.findByIdAndDelete(id);
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team member' });
  }
};

// --- Event Management ---
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, date, location, registrationLink } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (isOfflineMode) {
      const newEvent = {
        _id: 'evt_' + Date.now(),
        title,
        description,
        date: new Date(date),
        location,
        imageUrl,
        registrationLink: registrationLink || '',
        registrationCount: 0
      };
      offlineEvents.push(newEvent);
      return res.status(201).json(newEvent);
    }

    const event = new Event({
      title,
      description,
      date: new Date(date),
      location,
      imageUrl,
      registrationLink
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.date) updateData.date = new Date(updateData.date);

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (isOfflineMode) {
      const idx = offlineEvents.findIndex(e => e._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Event not found' });
      offlineEvents[idx] = { ...offlineEvents[idx], ...updateData };
      return res.json(offlineEvents[idx]);
    }

    const event = await Event.findByIdAndUpdate(id, updateData, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isOfflineMode) {
      const idx = offlineEvents.findIndex(e => e._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Event not found' });
      offlineEvents.splice(idx, 1);
      return res.json({ message: 'Event deleted successfully' });
    }

    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event' });
  }
};

// --- News Management ---
export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (isOfflineMode) {
      const newItem = {
        _id: 'news_' + Date.now(),
        title,
        content,
        imageUrl,
        createdAt: new Date()
      };
      offlineNews.push(newItem);
      return res.status(201).json(newItem);
    }

    const item = new News({ title, content, imageUrl });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error creating news item' });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (isOfflineMode) {
      const idx = offlineNews.findIndex(n => n._id === id);
      if (idx === -1) return res.status(404).json({ message: 'News not found' });
      offlineNews[idx] = { ...offlineNews[idx], ...updateData };
      return res.json(offlineNews[idx]);
    }

    const item = await News.findByIdAndUpdate(id, updateData, { new: true });
    if (!item) return res.status(404).json({ message: 'News not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error updating news' });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isOfflineMode) {
      const idx = offlineNews.findIndex(n => n._id === id);
      if (idx === -1) return res.status(404).json({ message: 'News not found' });
      offlineNews.splice(idx, 1);
      return res.json({ message: 'News item deleted' });
    }

    const item = await News.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'News not found' });
    res.json({ message: 'News item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news' });
  }
};

// --- Testimonial Management ---
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, role, message } = req.body;
    let avatarUrl = '';

    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }

    if (isOfflineMode) {
      const newTest = {
        _id: 'test_' + Date.now(),
        name,
        role,
        message,
        avatarUrl,
        createdAt: new Date()
      };
      offlineTestimonials.push(newTest);
      return res.status(201).json(newTest);
    }

    const testimonial = new Testimonial({ name, role, message, avatarUrl });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Error creating testimonial' });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.avatarUrl = `/uploads/${req.file.filename}`;
    }

    if (isOfflineMode) {
      const idx = offlineTestimonials.findIndex(t => t._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Testimonial not found' });
      offlineTestimonials[idx] = { ...offlineTestimonials[idx], ...updateData };
      return res.json(offlineTestimonials[idx]);
    }

    const testimonial = await Testimonial.findByIdAndUpdate(id, updateData, { new: true });
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Error updating testimonial' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isOfflineMode) {
      const idx = offlineTestimonials.findIndex(t => t._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Testimonial not found' });
      offlineTestimonials.splice(idx, 1);
      return res.json({ message: 'Testimonial deleted' });
    }

    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial' });
  }
};

// --- Student Management ---
export const getStudents = async (req: Request, res: Response) => {
  try {
    if (isOfflineMode) {
      const studs = offlineUsers.filter(u => u.role === 'student');
      return res.json(studs);
    }
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isOfflineMode) {
      const idx = offlineUsers.findIndex(u => u._id === id && u.role === 'student');
      if (idx === -1) return res.status(404).json({ message: 'Student not found' });
      offlineUsers.splice(idx, 1);
      return res.json({ message: 'Student deleted successfully' });
    }

    const student = await User.findOneAndDelete({ _id: id, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student' });
  }
};
