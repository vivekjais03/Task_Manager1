const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTask, updateTask, deleteTask, addComment, updateTaskOrder, getDashboardStats } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/dashboard', getDashboardStats);
router.put('/reorder', updateTaskOrder);
router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);
router.post('/:id/comments', addComment);

module.exports = router;
