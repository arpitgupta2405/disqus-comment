/**
 * BaseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  assignBasic: async function(req, res, model) {

    model.baseUrl = sails.config.custom.baseUrl;
    model.environment = sails.config.environment;
    model.cloudFrontPath = sails.config.custom.cloudFrontPath;
    model.userEmail = (req.session && typeof req.session.userEmail !== 'undefined') ? req.session.userEmail : undefined;
    model.userId = (req.session && typeof req.session.userId !== 'undefined') ? req.session.userId : undefined;
  },

  assignCommons: async function(req, res, model) {

    await this.assignBasic(req, res, model);
  },

};
