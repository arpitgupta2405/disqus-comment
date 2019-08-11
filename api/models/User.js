/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt-nodejs');
const Op = Sequelize.Op;

module.exports = {

  attributes: {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userEmail: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    mobile: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    salt: {
      type: Sequelize.STRING,
    },
    authToken: {
      type: Sequelize.STRING,
    },
    profilePic: {
      type: Sequelize.STRING,
    },
    createdTime: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedTime: {
      allowNull: false,
      type: 'TIMESTAMP'
    }
  },
  options: {
    freezeTableName: true,
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdTime',
    updatedAt: 'updatedTime',
    instanceMethods: {
      customToJson: function() {
        return _.omit(this.toJSON(), ['password', 'salt']);
      },
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
      setPassword: function(password) {
        this.salt = bcrypt.genSaltSync();
        this.password = bcrypt.hashSync(password, this.salt);
      },
      generateJwt: function() {
        const payload = {
          id: this.id
        };
        return TokenService.issue(payload);
      }
    },
    hooks: {
      beforeCreate: function(user) {
        user.salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, this.salt);
      },
      afterCreate: function(user) {
        const authToken = user.generateJwt();
        User.update({
          authToken
        }, {
          where: {
            id: user.id
          }
        });
      }
    },
    scopes: {},
    connection: 'default',
    classMethods: {
      createUser: async function(opts) {
        opts = _.pick(opts, ['userName', 'userEmail', 'password', 'profilePic']);

        const qOpts = {
          where: {
            userEmail: opts.userEmail
          },
          defaults: opts
        };

        return User.findOrCreate(qOpts)
          .spread((user, created) => {
            user.authToken = user.generateJwt();
            user = _.pick(user, ['id', 'userName', 'userEmail', 'authToken', 'profilePic']);
            if (created) { // new user
              return {
                success: true,
                message: 'User created successfully!',
                user: user
              };
            } else if (user && user.id) { // already existing user
              return {
                success: false,
                message: 'Email already exists. Please sign in to continue'
              };
            } else { // invalid query options
              return {
                success: false,
                message: 'Something went wrong!'
              };
            }
          });
      },

      validateCredentials: function(userData) {
        userData = _.pick(userData, ['userEmail', 'password']);
        const opts = {
          where: {
            userEmail: userData.userEmail
          }
        };
        return this.find(opts)
          .then(user => {
            if (user) {
              if (user.password === null) {
                return {
                  success: false,
                  userExist: 1
                };
              } else
              if (user && user.id && user.validPassword(userData.password)) {
                return {
                  success: true,
                  userId: user.id,
                  authToken: user.authToken,
                  userEmail: user.userEmail,
                  userName: user.userName
                };
              } else {
                return {
                  success: false,
                  userExist: 1
                };
              }
            } else {
              return {
                success: false,
                userExist: 0
              };
            }
          });
      },

      getUserById: async function(userId) {
        return this.find({
          where: {
            id: userId
          }
        });
      },
    },
  },
  associations: function() {}

};
