const express = require('express');
const Post = require('../models/post');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

router.get('/', (req, res, next) => {
  Post.find().then((document)=>{
    res.status(200).json({
      message: 'Post fetched successfully',
      posts: document
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  });
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '_' + Date.now() + '.' + ext);
  }
});

router.post('', multer({storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: 'Post addeded successfully!',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    })
  });
});

router.put('/:id', multer({storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath; // imagePath is string
  if (req.file) {
    console.log('req.file is true');
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({_id: req.params.id}, post).then(updatedPost => {
    res.status(200).json({ message: 'Updated Successfully!' });
  })
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: 'post deleted successfully!' });
  })
  .catch((reason) => {
    res.status(500).json({ message: 'Something went wrong!' });
    console.log(reason);
  });
});

module.exports = router;
