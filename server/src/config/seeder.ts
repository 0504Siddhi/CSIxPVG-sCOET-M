import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { TeamMember } from '../models/TeamMember';
import { Event } from '../models/Event';
import { News } from '../models/News';
import { Testimonial } from '../models/Testimonial';

export const seedDatabase = async () => {
  try {
    // 1. Seed Admin User
    const adminEmail = 'csi@pvgcoet.ac.in';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'CSI PVG Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        department: 'Computer Department',
        year: 'Staff',
        registrationNumber: 'ADMIN001'
      });
      await admin.save();
      console.log('Seeded Admin account (csi@pvgcoet.ac.in / admin123)');
    }

    // 2. Seed Team Members if empty
    const memberCount = await TeamMember.countDocuments();
    if (memberCount === 0) {
      const teamList = [
        // Faculty Coordinators
        {
          name: 'Prof. U. M. Kalshetti',
          designation: 'HOD (Computer Department)',
          category: 'coordinator',
          department: 'Computer Department',
          year: 'Staff',
          photoUrl: '/team/page_4_img_2.jpeg',
          linkedinUrl: 'https://linkedin.com',
          order: 1
        },
        {
          name: 'Dr. S. H. Patil',
          designation: 'Faculty Coordinator',
          category: 'coordinator',
          department: 'Computer Department',
          year: 'Staff',
          photoUrl: '/team/page_4_img_1.jpeg',
          linkedinUrl: 'https://linkedin.com',
          order: 2
        },
        // President
        {
          name: 'Gauri Kharad',
          designation: 'President',
          category: 'president',
          department: 'Computer Department',
          year: 'B.E',
          photoUrl: '/team/page_3_img_1.jpeg',
          linkedinUrl: 'https://linkedin.com',
          githubUrl: 'https://github.com',
          order: 3
        },
        // Vice President
        {
          name: 'Pratika Bankar',
          designation: 'Vice President',
          category: 'vice-president',
          department: 'Computer Department',
          year: 'T.E',
          photoUrl: '/team/page_5_img_1.jpeg',
          linkedinUrl: 'https://linkedin.com',
          githubUrl: 'https://github.com',
          order: 4
        },
        // Technical Heads (Vedant Patil & Nehal Rawool side-by-side)
        {
          name: 'Nehal Rawool',
          designation: 'Technical Head',
          category: 'technical',
          department: 'Computer Department',
          year: 'S.Y Btech',
          photoUrl: '/team/page_6_img_1.jpeg',
          linkedinUrl: 'https://linkedin.com',
          githubUrl: 'https://github.com',
          order: 5
        },
        {
          name: 'Vedant Patil',
          designation: 'Technical Head',
          category: 'technical',
          department: 'Computer Department',
          year: 'S.Y Btech',
          photoUrl: '/team/page_6_img_2.jpeg',
          linkedinUrl: 'https://linkedin.com',
          githubUrl: 'https://github.com',
          order: 6
        },
        // Design Heads
        {
          name: 'Shreyasi Jadhav',
          designation: 'Design Head',
          category: 'design',
          department: 'Computer Department',
          year: 'S.Y Btech',
          photoUrl: '/team/page_2_img_1.jpeg',
          linkedinUrl: 'https://linkedin.com',
          githubUrl: 'https://github.com',
          order: 7
        },
        {
          name: 'Sharvee Kulkarni',
          designation: 'Design Head',
          category: 'design',
          department: 'Computer Department',
          year: 'S.Y Btech',
          photoUrl: '/team/page_2_img_2.jpeg',
          linkedinUrl: 'https://www.linkedin.com/in/sharvee-kulkarni-635a5a391/',
          githubUrl: 'https://github.com',
          order: 8
        },
        // Event & Publicity Heads
        {
          name: 'Salil Bokil',
          designation: 'Event & Publicity Head',
          category: 'publicity',
          department: 'Computer Department',
          year: 'S.Y Btech',
          photoUrl: '/team/page_1_img_1.jpeg',
          linkedinUrl: 'https://linkedin.com',
          githubUrl: 'https://github.com',
          order: 9
        },
        {
          name: 'Bhumika Gote',
          designation: 'Event & Publicity Head',
          category: 'publicity',
          department: 'Computer Department',
          year: 'S.Y Btech',
          photoUrl: '/team/page_1_img_2.jpeg',
          linkedinUrl: 'https://linkedin.com',
          githubUrl: 'https://github.com',
          order: 10
        },
        // Finance Heads
        {
          name: 'Meet Shrishrimal',
          designation: 'Finance Head',
          category: 'finance',
          department: 'Computer Department',
          year: 'S.Y Btech',
          photoUrl: '/team/page_7_img_1.jpeg',
          linkedinUrl: 'https://linkedin.com',
          githubUrl: 'https://github.com',
          order: 11
        },
        {
          name: 'Om Kashid',
          designation: 'Finance Head',
          category: 'finance',
          department: 'Computer Department',
          year: 'S.Y Btech',
          photoUrl: '/team/page_7_img_2.jpeg',
          linkedinUrl: 'https://linkedin.com',
          githubUrl: 'https://github.com',
          order: 12
        }
      ];
      await TeamMember.insertMany(teamList);
      console.log('Seeded Team Members successfully!');
    }
  } catch (error) {
    console.error('Seeding database failed:', error);
  }
};
