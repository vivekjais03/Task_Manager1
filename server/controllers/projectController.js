const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  try {
    const { name, description, color, dueDate, priority } = req.body;
    const project = await Project.create({ name, description, color, dueDate, priority, owner: req.user._id, members: [{ user: req.user._id, role: 'admin' }] });
    await project.populate('owner', 'name email avatar');
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ $or: [{ owner: req.user._id }, { 'members.user': req.user._id }] })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort('-createdAt');
    const projectsWithStats = await Promise.all(projects.map(async (p) => {
      const tasks = await Task.find({ project: p._id });
      return { ...p.toObject(), taskCount: tasks.length, completedCount: tasks.filter(t => t.status === 'completed').length };
    }));
    res.json(projectsWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const isMember = project.owner._id.equals(req.user._id) || project.members.some(m => m.user._id.equals(req.user._id));
    if (!isMember) return res.status(403).json({ message: 'Access denied' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('owner', 'name email avatar').populate('members.user', 'name email avatar');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    await Task.deleteMany({ project: req.params.id });
    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });
    if (project.members.some(m => m.user.equals(userToAdd._id))) return res.status(400).json({ message: 'User already a member' });
    project.members.push({ user: userToAdd._id, role: role || 'member' });
    await project.save();
    await project.populate('members.user', 'name email avatar');
    await User.findByIdAndUpdate(userToAdd._id, { $push: { notifications: { message: `You were added to project: ${project.name}` } } });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    project.members = project.members.filter(m => !m.user.equals(req.params.userId));
    await project.save();
    res.json({ message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
