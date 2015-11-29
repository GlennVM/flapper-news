var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

// Se ejecuta cada vez que se incluye un parámetro :post en una ruta
router.param('post', function (req, res, next, id) {
	var query = Post.findById(id);

	query.exec( function (err, post) {
		if (err) { return next(err); }
		if (!post) {
			return next('Could not find post');
		}

		req.post = post;
		return next();
	});
});

router.param('comment', function (req, res, next, id) {
	var query = Comment.findById(id);

	query.exec( function(err, comment) {
		if (err) { return next(err); }
		if (!comment) {
			return ('Could not find comment');
		}

		req.comment = comment;
		return next();
	});
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Flapper News' });
});

/* GET posts */
router.get('/posts', function(req, res, next) {
	Post.find(function (err, posts) {
		if (err) { return next(err); }
		res.json(posts);
	});
});

/* POST new post */
router.post('/posts', auth, function(req, res, next) {
	var post = new Post(req.body);
	post.author = req.payload.username;

	post.save(function (err, post) {
		if (err) { return next(err); }

		res.json(post);
	});
});

/* GET post
   Obtenemos un post (Se ejecuta automáticamente la query definida en router.param)
 */
router.get('/posts/:post', function (req, res) {
	req.post.populate('comments', function(err, post) {
		res.json(post);
	});
});

/* PUT Upvote a post */
router.put('/posts/:post/upvote', auth, function (req, res, next) {
	req.post.upvote( function (err, post) {
		if (err) { return next(err); }
		res.json(post);
	});
});

/* POST new comment */
router.post('/posts/:post/comments', auth, function (req, res, next) {
	var comment = new Comment(req.body);
	// Relación comentario -> post
	comment.post = req.post;
	comment.author = req.payload.username;

	comment.save( function (err, comment) {
		if (err) { return next(err); }

		// Añadimos el comentario al post
		req.post.comments.push(comment);
		// almacenamos el post actualizado
		req.post.save( function (err, post) {
			if (err) { return next(err); }
			res.json(comment);
		});
	});
});

/* Upvote a comment */
router.put('/posts/:post/comments/:comment/upvote', auth, function (req, res, next) {
	req.comment.upvote( function (err, comment) {
		if (err) { return next(err); }
		res.json(comment);
	});
});

router.post('/register', auth, function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
