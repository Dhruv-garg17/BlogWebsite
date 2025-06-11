const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', postController.getApprovedPosts);

// Authenticated user routes
router.post('/', authenticateUser, postController.addPost);

// Admin routes
router.patch('/admin/posts/:id/approve', authenticateUser, authorizeAdmin, postController.approvePost);
router.get('/admin/posts/all', authenticateUser, authorizeAdmin, postController.getAllPosts);
router.get('/admin/posts/pending', authenticateUser, authorizeAdmin, postController.getPendingPosts);
router.delete('/admin/posts/:id', authenticateUser, authorizeAdmin, postController.rejectPost);
router.post('/admin/bulk-approve', authenticateUser, authorizeAdmin, postController.bulkApprovePosts);
router.post('/admin/bulk-reject', authenticateUser, authorizeAdmin, postController.bulkRejectPosts);

module.exports = router;