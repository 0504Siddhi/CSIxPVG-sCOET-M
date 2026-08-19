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
      _id: 'team_002',
      name: 'Prof. U. M. Kalshetti',
      designation: 'HOD (Computer Department)',
      category: 'coordinator',
      department: 'Computer Department',
      year: 'Staff',
      photoUrl: '/team/page_4_img_2.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/urmila-kalshetti-3507669a/',
      order: 1
    },
    {
      _id: 'team_001',
      name: 'Dr. S. H. Patil',
      designation: 'Faculty Coordinator',
      category: 'coordinator',
      department: 'Computer Department',
      year: 'Staff',
      photoUrl: '/team/page_4_img_1.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/dr-seema-patil-22b704325/',
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
      linkedinUrl: 'https://www.linkedin.com/in/gauri-kharad-136365298/',
    },
    {
      _id: 'team_004',
      name: 'Pratika Bankar',
      designation: 'Vice President',
      category: 'vice-president',
      department: 'Computer Department',
      year: 'T.E',
      photoUrl: '/team/page_5_img_1.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/pratikabankar/',
    },
    {
      _id: 'team_005',
      name: 'Nehal Rawool',
      designation: 'Technical Head',
      category: 'technical',
      department: 'Computer Department',
      year: 'S.Y Btech',
      photoUrl: '/team/page_6_img_1.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/nehal-rawool-461602417/',
    },
    {
      _id: 'team_006',
      name: 'Vedant Patil',
      designation: 'Technical Head',
      category: 'technical',
      department: 'Computer Department',
      year: 'S.Y Btech',
      photoUrl: '/team/page_6_img_2.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/vedant-patil-286944382/',
    },
    {
      _id: 'team_007',
      name: 'Shreyasi Jadhav',
      designation: 'Design Head',
      category: 'design',
      department: 'Computer Department',
      year: 'S.Y Btech',
      photoUrl: '/team/page_2_img_1.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/shreyasi-jadhao-167427384/',
    },
    {
      _id: 'team_008',
      name: 'Sharvee Kulkarni',
      designation: 'Design Head',
      category: 'design',
      department: 'Computer Department',
      year: 'S.Y Btech',
      photoUrl: '/team/page_2_img_2.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/sharvee-kulkarni-635a5a391/',
    },
    {
      _id: 'team_009',
      name: 'Salil Bokil',
      designation: 'Event & Publicity Head',
      category: 'publicity',
      department: 'Computer Department',
      year: 'S.Y Btech',
      photoUrl: '/team/page_1_img_1.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/bsalil/',
    },
    {
      _id: 'team_010',
      name: 'Bhumika Gote',
      designation: 'Event & Publicity Head',
      category: 'publicity',
      department: 'Computer Department',
      year: 'S.Y Btech',
      photoUrl: '/team/page_1_img_2.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/bhumika-gote-455030386/',
    },
    {
      _id: 'team_011',
      name: 'Meet Shrishrimal',
      designation: 'Finance Head',
      category: 'finance',
      department: 'Computer Department',
      year: 'S.Y Btech',
      photoUrl: '/team/page_7_img_1.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/meet-shrishrimal-237a8441a/',
    },
    {
      _id: 'team_012',
      name: 'Om Kashid',
      designation: 'Finance Head',
      category: 'finance',
      department: 'Computer Department',
      year: 'S.Y Btech',
      photoUrl: '/team/page_7_img_2.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/om-kashid-880935397/',
    }
  ];
  offlineTeam.push(...teamList);
  console.log('✅ Seeded in-memory store.');
};
