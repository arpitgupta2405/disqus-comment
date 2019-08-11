/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  login: function(req, res) {
    let userData;

    userData = {};

    userData.userEmail = req.body.userEmail;
    userData.password = req.body.password;

    return User.validateCredentials(userData)
      .then((response) => {
        if (response.success) {
          req.session.userId = response.userId;
          req.session.userEmail = response.userEmail;
          req.session.userName = response.userName;
          return res.status(200).json({
            success: true,
            message: 'Login Successful',
            redirectPath: '/'
          });
        } else {
          if (response.userExist === 1) {
            return res.status(401).json({
              success: false,
              message: 'Please try again or use forgot password'
            });
          } else if (response.userExist === 0) {
            return res.status(401).json({
              success: false,
              message: 'The account could not be found. Please sign up to continue'
            });
          }
        }
      })
      .catch(err => {
        sails.log.error(err);
        return res.status(400).json({
          success: false,
          message: 'Bad Request'
        });
      });
  },

  signUp: function(req, res) {
    let userData;

    userData = {};

    userData.userName = req.body.userName;
    userData.userEmail = req.body.userEmail;
    userData.password = req.body.password;
    userData.profilePic = req.body.profilePic;

    if (typeof userData.userEmail !== 'undefined' && (userData.userEmail).trim() !== '' && typeof userData.userName !== 'undefined' && typeof userData.password !== 'undefined') {

      return User.createUser(userData)
        .then((response) => {
          if (response.success) {
            req.session.userId = response.user.id;
            req.session.userName = response.user.userName;
            req.session.userEmail = response.user.userEmail;
            return res.status(200).json({
              success: true,
              message: 'Sign Up Successful',
              redirectPath: '/'
            });
          } else {
            return res.status(401).json({
              success: false,
              message: response.message
            });
          }
        })
        .catch(err => {
          sails.log.error(err);
          return res.status(400).json({
            success: false,
            message: 'Bad Request'
          });
        });
    }
  },

  logout: async function(req, res) {
    await req.session.destroy();

    let data = {
      success: true,
      message: 'User logged out successfully.',
      redirectPath: '/login'
    };

    return res.status(200).json(data);
  },

  profilePicUpload: async function(req, res) {
    let uploadOptions = sails.config.uploads;
    let refererr = req.get('referrer').split('/');
    uploadOptions.maxBytes = 10000000;
    uploadOptions.dirname = `/arpit245`;
    req.file('profile-pic').upload(uploadOptions, (err, uploadedFiles) => {
      if (err) {
        sails.log.error(err);
        return res.json({
          error: err,
          status: false
        });
      }
      sails.log.info('uploadedFiles', uploadedFiles);
      // Upload Banner Image for Category+fileformat URL in UrlPages table
      if (uploadedFiles.length > 0) {
        return res.json({
          files: uploadedFiles[0].fd,
          success: true,
          message: 'Image uploaded successfully!'
        });
      }
    });
  }

};
