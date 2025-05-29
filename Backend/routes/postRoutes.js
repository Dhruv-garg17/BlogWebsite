const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', postController.getApprovedPosts);
router.post('/', authenticateUser, postController.addPost);

module.exports = router;
