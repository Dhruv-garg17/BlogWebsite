const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/posts/pending', authenticateUser, authorizeAdmin, postController.getPendingPosts);
router.post('/posts/:id/approve', authenticateUser, authorizeAdmin, postController.approvePost);
router.delete('/posts/:id/reject', authenticateUser, authorizeAdmin, postController.rejectPost);

module.exports = router;
