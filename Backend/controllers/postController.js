const Post = require('../models/Post');

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
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.status = 'approved';
    await post.save();

    res.json({ msg: 'Post approved' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
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
