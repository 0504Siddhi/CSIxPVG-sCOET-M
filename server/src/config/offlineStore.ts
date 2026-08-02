import bcrypt from 'bcryptjs';

export let isOfflineMode = false;

export const setOfflineMode = (val: boolean) => {
  isOfflineMode = val;
};

// Seed arrays matching Mongoose Schemas
export const offlineUsers: any[] = [];
export const offlineTeam: any[] = [];
export const offlineEvents: any[] = [];
export const offlineNews: any[] = [];
export const offlineTestimonials: any[] = [];

export const initOfflineStore = async () => {
  console.log('⚡ Initializing in-memory fallback databases...');
  
  // Seed admin
  const hashedAdminPass = await bcrypt.hash('admin123', 10);
  offlineUsers.push({
    _id: 'usr_admin_001',
    name: 'CSI PVG Admin',
    email: 'csi@pvgcoet.ac.in',
    password: hashedAdminPass,
    role: 'admin',
    department: 'Computer Department',
    year: 'Staff',
    registrationNumber: 'ADMIN001',
    createdAt: new Date()
  });

  // Seed team
  const teamList = [
    {
      _id: 'team_001',
      name: 'Dr. S. H. Patil',
      designation: 'Faculty Coordinator',
      category: 'coordinator',
      department: 'Computer Department',
      year: 'Staff',
      photoUrl: '/team/page_4_img_1.jpeg',
      linkedinUrl: 'https://linkedin.com',
      githubUrl: 'https://github.com',
      order: 1
    },
    {
      _id: 'team_002',
      name: 'Prof. U. M. Kalshetti',
      designation: 'HOD (Computer Department)',
      category: 'coordinator',
      department: 'Computer Department',
      year: 'Staff',
      photoUrl: '/placeholder.png',
      linkedinUrl: 'https://linkedin.com',
      githubUrl: 'https://github.com',
      order: 2
    },
    {
      _id: 'team_003',
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
    {
      _id: 'team_004',
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
    {
      _id: 'team_005',
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
      _id: 'team_006',
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
    {
      _id: 'team_007',
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
      _id: 'team_008',
      name: 'Sakshi Thange',
      designation: 'Design Head',
      category: 'design',
      department: 'Computer Department',
      year: 'S.Y Btech',
      photoUrl: '/team/page_2_img_2.jpeg',
      linkedinUrl: 'https://linkedin.com',
      githubUrl: 'https://github.com',
      order: 8
    },
    {
      _id: 'team_009',
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
      _id: 'team_010',
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
    {
      _id: 'team_011',
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
      _id: 'team_012',
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
  offlineTeam.push(...teamList);
  console.log('✅ Seeded in-memory store.');
};
