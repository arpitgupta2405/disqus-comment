/**
 * CommentLike.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    commentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  },
  options: {
    freezeTableName: true,
    tableName: 'comment_like',
    timestamps: false,
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default',
    classMethods: {
      getByUserIdAndPostId: async function(qOpts) {
        return this.findAll({
          where: {
            userId: qOpts.userId
          }
        });
      }
    },
  },
  associations: function() {}

};
