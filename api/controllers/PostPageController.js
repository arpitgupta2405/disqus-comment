/**
 * PostPageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const generator = require('generate-password');
const moment = require('moment');
const LTT = require('list-to-tree');

module.exports = {
  showCreatePage: async function(req, res) {
    let model = {};
    await BaseController.assignCommons(req, res, model);
    model.firstfold = 'home';
    return res.view('pages/new-post', model);
  },

  savePost: async function(req, res) {
    let name;
    let postData;
    let userId;
    let slug;
    let opts;

    name = req.body.title;
    postData = req.body.content;
    userId = req.session.userId;
    slug = name.toLowerCase().split(' ').join('-');
    opts = {};

    opts = {
      name,
      postData,
      userId,
      slug
    };

    return Post.addPost(opts)
      .then((result) => {
        return res.status(200).json({
          success: true
        });
      })
      .catch(err => {
        sails.log.error(err);
        return res.status(400).json({
          success: false,
          message: 'Bad Request'
        });
      });
  },

  show: async function(req, res) {
    let postId;
    let postSlug;
    let opts;
    let requestedPageNo;

    model = {};
    opts = {};
    postId = req.params.id;
    postSlug = req.params.slug;
    userId = req.session.userId;
    requestedPageNo = req.query.pagenum || 1;
    opts.limit = 5;
    opts.offset = Number((requestedPageNo - 1) * opts.limit);

    opts.postId = postId;
    opts.postSlug = postSlug;
    opts.userId = userId;
    await BaseController.assignCommons(req, res, model);

    return Post.getBySlugAndId(opts)
      .then((result) => {
        if (!result) {

        }
        model.post = result;
        return User.getUserById(model.post.userId);
      })
      .then((user) => {
        model.user = user;
        return Comment.getCommentWithUserDetailsByPostId(opts);
      })
      .then((comment) => {
        comment = JSON.parse(JSON.stringify(comment));
        var ltt = new LTT(comment, {
          key_id: 'id',
          key_parent: 'parentCommentId'
        });
        var tree = ltt.GetTree();

        model.comment = tree;
        model.comment = _.sortBy(model.comment, ['createdTime']);
        model.comment = model.comment.reverse();
        model.moment = moment;
        model.firstfold = 'home';
        res.view('pages/post', model);
      })
      .catch(err => {
        sails.log.error(err);
        return res.status(400).json({
          success: false,
          message: 'Bad Request'
        });
      });
  },

  pagination: async function(req, res) {
    let postId;
    let postSlug;
    let opts;
    let requestedPageNo;

    postId = req.query.postId;
    opts = {};
    opts.postId = postId;
    requestedPageNo = req.query.pagenum || 1;
    opts.limit = 5;
    opts.offset = Number((requestedPageNo - 1) * opts.limit);

    return Comment.getCommentWithUserDetailsByPostId(opts)
      .then((comment) => {
        comment = JSON.parse(JSON.stringify(comment));
        var ltt = new LTT(comment, {
          key_id: 'id',
          key_parent: 'parentCommentId'
        });
        var tree = ltt.GetTree();

        model.comment = tree;
        model.comment = _.sortBy(model.comment, ['createdTime']);
        model.comment = model.comment.reverse();
        model.moment = moment;
        model.layout = false;
        res.view('partials/comments', model);
      })
      .catch(err => {
        sails.log.error(err);
        return res.status(400).json({
          success: false,
          message: 'Bad Request'
        });
      });
  },

  comment
: async function(req, res) {
    let userId;
    let postId;
    let opts;
    let model;

    opts = {};
    model = {};
    opts.userId = req.session.userId;
    opts.comment = req.body.comment;
    opts.postId = req.body.postId;
    opts.parentCommentId = req.body.parentCommentId || 0;

    await BaseController.assignCommons(req, res, model);

    return Comment.addComment(opts)
      .then((result) => {
        model.result = result;
        return User.getUserById(opts.userId);
      })
      .then((user) => {
        model.user = user;
        model.moment = moment;
        model.layout = false;
        if (opts.parentCommentId === 0) {
          return res.view('partials/comment-partial', model);
        }
        return res.view('partials/comment-inner', model);
      })
      .catch(err => {
        sails.log.error(err);
        return res.status(400).json({
          success: false,
          message: 'Bad Request'
        });
      });
  },

};
