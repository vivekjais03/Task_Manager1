const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

const checkProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const isMember = project.owner.equals(userId) || project.members.some(m => m.user.equals(userId));
  return isMember ? project : null;
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignee, status, priority, dueDate, tags } = req.body;
    const proj = await checkProjectAccess(project, req.user._id);
    if (!proj) return res.status(403).json({ message: 'Access denied' });
    const task = await Task.create({ title, description, project, assignee, status, priority, dueDate, tags, createdBy: req.user._id });
    await task.populate([{ path: 'assignee', select: 'name email avatar' }, { path: 'createdBy', select: 'name email avatar' }]);
    if (assignee && assignee !== req.user._id.toString()) {
      await User.findByIdAndUpdate(assignee, { $push: { notifications: { message: `You were assigned task: ${title}` } } });
    }
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { project, status, priority, assignee, search } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color')
      .sort('order');
    // Auto-mark overdue
    const now = new Date();
    const updated = tasks.map(t => {
      if (t.dueDate && t.dueDate < now && t.status !== 'completed') t.status = 'overdue';
      return t;
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color')
      .populate('comments.user', 'name email avatar');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const proj = await checkProjectAccess(task.project, req.user._id);
    if (!proj) return res.status(403).json({ message: 'Access denied' });
    if (req.user.role === 'member' && !task.assignee?.equals(req.user._id)) {
      const allowed = ['status'];
      const keys = Object.keys(req.body);
      if (!keys.every(k => allowed.includes(k))) return res.status(403).json({ message: 'Members can only update task status' });
    }
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const proj = await Project.findById(task.project);
    if (!proj.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.comments.push({ user: req.user._id, text: req.body.text });
    await task.save();
    await task.populate('comments.user', 'name email avatar');
    res.json(task.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTaskOrder = async (req, res) => {
  try {
    const { tasks } = req.body;
    await Promise.all(tasks.map(({ id, status, order }) => Task.findByIdAndUpdate(id, { status, order })));
    res.json({ message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.find({ $or: [{ owner: req.user._id }, { 'members.user': req.user._id }] });
    const projectIds = projects.map(p => p._id);
    const allTasks = await Task.find({ project: { $in: projectIds } }).populate('assignee', 'name avatar').populate('project', 'name color');
    const now = new Date();
    const stats = {
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.status === 'completed').length,
      pendingTasks: allTasks.filter(t => t.status === 'todo').length,
      inProgressTasks: allTasks.filter(t => t.status === 'in-progress').length,
      overdueTasks: allTasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'completed').length,
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      myTasks: allTasks.filter(t => t.assignee?._id?.equals(req.user._id)),
      upcomingDeadlines: allTasks.filter(t => t.dueDate && t.dueDate > now && t.status !== 'completed').sort((a, b) => a.dueDate - b.dueDate).slice(0, 5),
      recentTasks: allTasks.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10),
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
