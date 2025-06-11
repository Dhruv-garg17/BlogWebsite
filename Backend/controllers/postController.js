const Post = require('../models/Post');
const mongoose = require('mongoose');

exports.getApprovedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const topic = req.query.topic;

    const filter = { status: 'approved' };
    if (topic) filter.topic = topic;

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      posts
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addPost = async (req, res) => {
  try {
    const { title, content, topic } = req.body;
    if (!title || !content || !topic) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const author = req.user._id;

    const newPost = new Post({
      title,
      content,
      topic,
      author,
      status: 'pending'
    });

    await newPost.save();
    res.json({ msg: 'Post submitted for approval' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPendingPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const filter = { status: 'pending' };

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, pages: Math.ceil(total / limit), posts });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.approvePost = async (req, res) => {
  try {
    const postId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.status === 'approved') {
      return res.status(400).json({ error: 'Post is already approved' });
    }

    post.status = 'approved';
    await post.save();

    res.json({ msg: 'Post approved', post });
  } catch (err) {
    console.error('Approval error:', err);
    res.status(500).json({ error: 'Failed to approve post', details: err.message });
  }
};

exports.rejectPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await Post.findByIdAndDelete(postId);
    res.json({ msg: 'Post rejected and deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const { status, topic } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (topic) filter.topic = topic;

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      posts
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.bulkApprovePosts = async (req, res) => {
  try {
    const { postIds } = req.body;
    
    if (!postIds || !Array.isArray(postIds)) {
      return res.status(400).json({ error: 'Array of post IDs required' });
    }

    const result = await Post.updateMany(
      { _id: { $in: postIds } },
      { $set: { status: 'approved' } }
    );

    res.json({
      message: `Successfully approved ${result.modifiedCount} posts`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.bulkRejectPosts = async (req, res) => {
  try {
    const { postIds } = req.body;
    
    if (!postIds || !Array.isArray(postIds)) {
      return res.status(400).json({ error: 'Array of post IDs required' });
    }

    const result = await Post.deleteMany({ _id: { $in: postIds } });

    res.json({
      message: `Successfully deleted ${result.deletedCount} posts`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};