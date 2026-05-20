require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});

  const hash = await bcrypt.hash('demo1234', 12);

  const admin = await User.create({ name: 'Alex Admin', email: 'admin@demo.com', password: hash, role: 'admin', bio: 'Project lead and admin' });
  const member1 = await User.create({ name: 'Sam Developer', email: 'member@demo.com', password: hash, role: 'member', bio: 'Frontend developer' });
  const member2 = await User.create({ name: 'Jordan Designer', email: 'jordan@demo.com', password: hash, role: 'member', bio: 'UI/UX Designer' });

  // Create projects
  const project1 = await Project.create({
    name: 'Website Redesign', description: 'Complete overhaul of the company website with modern design', color: '#6366f1',
    owner: admin._id, status: 'active', priority: 'high', dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    members: [{ user: admin._id, role: 'admin' }, { user: member1._id, role: 'member' }, { user: member2._id, role: 'member' }]
  });

  const project2 = await Project.create({
    name: 'Mobile App v2', description: 'New version of the mobile application with improved UX', color: '#8b5cf6',
    owner: admin._id, status: 'active', priority: 'medium', dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    members: [{ user: admin._id, role: 'admin' }, { user: member1._id, role: 'member' }]
  });

  const project3 = await Project.create({
    name: 'API Integration', description: 'Integrate third-party APIs for payment and analytics', color: '#10b981',
    owner: admin._id, status: 'on-hold', priority: 'low',
    members: [{ user: admin._id, role: 'admin' }, { user: member2._id, role: 'member' }]
  });

  // Create tasks for project1
  const tasks1 = [
    { title: 'Design new homepage mockup', description: 'Create Figma mockups for the new homepage', project: project1._id, assignee: member2._id, createdBy: admin._id, status: 'completed', priority: 'high', tags: ['design', 'figma'] },
    { title: 'Implement responsive navigation', description: 'Build mobile-first navigation component', project: project1._id, assignee: member1._id, createdBy: admin._id, status: 'in-progress', priority: 'high', tags: ['frontend', 'react'], dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
    { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated deployment', project: project1._id, assignee: member1._id, createdBy: admin._id, status: 'todo', priority: 'medium', tags: ['devops'] },
    { title: 'Write unit tests for components', description: 'Achieve 80% test coverage', project: project1._id, assignee: member1._id, createdBy: admin._id, status: 'todo', priority: 'low', tags: ['testing'] },
    { title: 'SEO optimization', description: 'Improve meta tags and page speed', project: project1._id, assignee: member2._id, createdBy: admin._id, status: 'todo', priority: 'medium', dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
    { title: 'Update brand guidelines', description: 'Refresh color palette and typography', project: project1._id, assignee: member2._id, createdBy: admin._id, status: 'completed', priority: 'low', tags: ['design'] },
  ];

  const tasks2 = [
    { title: 'User authentication flow', description: 'Implement biometric and social login', project: project2._id, assignee: member1._id, createdBy: admin._id, status: 'in-progress', priority: 'high', tags: ['auth', 'security'] },
    { title: 'Push notification system', description: 'Set up Firebase Cloud Messaging', project: project2._id, assignee: member1._id, createdBy: admin._id, status: 'todo', priority: 'medium', tags: ['firebase'] },
    { title: 'App store submission', description: 'Prepare assets and submit to App Store and Play Store', project: project2._id, assignee: admin._id, createdBy: admin._id, status: 'todo', priority: 'high', dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) },
    { title: 'Performance profiling', description: 'Identify and fix performance bottlenecks', project: project2._id, assignee: member1._id, createdBy: admin._id, status: 'completed', priority: 'medium' },
  ];

  const tasks3 = [
    { title: 'Stripe payment integration', description: 'Integrate Stripe for subscription billing', project: project3._id, assignee: member2._id, createdBy: admin._id, status: 'todo', priority: 'high', tags: ['payments', 'stripe'] },
    { title: 'Analytics dashboard setup', description: 'Connect Mixpanel and Google Analytics', project: project3._id, assignee: admin._id, createdBy: admin._id, status: 'todo', priority: 'medium', tags: ['analytics'] },
  ];

  await Task.insertMany([...tasks1, ...tasks2, ...tasks3]);

  console.log('✅ Seed data created successfully!');
  console.log('Demo accounts:');
  console.log('  Admin: admin@demo.com / demo1234');
  console.log('  Member: member@demo.com / demo1234');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
