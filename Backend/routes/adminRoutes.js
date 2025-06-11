const router = require('express').Router();
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');

router.get('/posts/pending', authenticateUser, authorizeAdmin, postController.getPendingPosts);
router.get('/posts/all', authenticateUser, authorizeAdmin, postController.getAllPosts);
router.patch('/posts/:id/approve', authenticateUser, authorizeAdmin, postController.approvePost);
router.delete('/posts/:id', authenticateUser, authorizeAdmin, postController.rejectPost);
router.post('/bulk-approve', authenticateUser, authorizeAdmin, postController.bulkApprovePosts);
router.post('/bulk-reject', authenticateUser, authorizeAdmin, postController.bulkRejectPosts);

module.exports = router;
