/**
 * HomePageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  show: async function(req, res) {
    let model = {};
    await BaseController.assignCommons(req, res, model);
    return Post.getAll()
      .then((result) => {
        model.posts = result;
        model.firstfold = 'home';
        return res.view('pages/homepage', model);
      });
  },

  login: async function(req, res) {
    let model;

    model = {};
    await BaseController.assignCommons(req, res, model);
    model.firstfold = 'home';
    if (req.session && req.session.userId) {
      return res.redirect('/');
    }
    return res.view('pages/login-or-signup', model)
  }

};
