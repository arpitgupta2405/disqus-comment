/**
 * Comment.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

let commentWithUserParentQuery = `select c.id, c.comment, c.parentCommentId, c.createdTime, u.userName, u.profilePic  from comment c inner join users u on u.id = c.userId where c.postId = :postId and parentCommentId=0  order by c.createdTime DESC LIMIT :limit OFFSET :offset;`
let commentWithUserChildQuery = `select c.id, c.comment, c.parentCommentId, c.createdTime, u.userName, u.profilePic  from comment c inner join users u on u.id = c.userId where c.postId = :postId and parentCommentId in (:parentCommentId);`

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
    postId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    parentCommentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'comment',
    timestamps: true,
    createdAt: 'createdTime',
    updatedAt: 'updatedTime',
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default',
    classMethods: {
      addComment: async function(opts) {
        return this.create(opts);
      },

      getCommentWithUserDetailsByPostId: async function(qOpts) {
        let data;
        let replacements = {
          postId: qOpts.postId,
          limit: qOpts.limit,
          offset: qOpts.offset
        };
        return SequelizeConnections.default
          .query(commentWithUserParentQuery, {
            replacements: replacements
          })
          .then((result) => {
            data = result[0];
            let parentId = [];
            data.forEach((r) => {
              parentId.push(r.id);
            });
            replacements = {
              postId: qOpts.postId,
              parentCommentId: parentId
            }

            if (replacements.parentCommentId.length > 0) {
              return SequelizeConnections.default
                .query(commentWithUserChildQuery, {
                  replacements: replacements
                });
            }
          })
          .then((result1) => {
            if (typeof result1 !== 'undefined') {
              data = [...data, ...result1[0]];
              parentId = [];
              result1[0].forEach((r) => {
                parentId.push(r.id);
              });
              replacements = {
                postId: qOpts.postId,
                parentCommentId: parentId
              }
              if (replacements.parentCommentId.length > 0) {
                return SequelizeConnections.default
                  .query(commentWithUserChildQuery, {
                    replacements: replacements
                  });
              }
            }
            return [];
          })
          .then((result2) => {
            if (result2.length > 0) {
              data = [...data, ...result2[0]];
            }
            return data;
          });
      },
    },
  },
  associations: function() {}

};
