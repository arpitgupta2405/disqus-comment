/**
 * Post.js
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
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    postData: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
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
    tableName: 'post',
    timestamps: true,
    createdAt: 'createdTime',
    updatedAt: 'updatedTime',
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default',
    classMethods: {
      getAll: async function() {
        let opts = {
          order: [
            ['createdTime', 'DESC']
          ]
        };
        return this.findAll(opts)
          .then((result) => {
            return JSON.parse(JSON.stringify(result));
          });
      },
      getBySlugAndId: async function(qOpts) {
        let opts = {
          where: {
            id: qOpts.postId,
            slug: qOpts.postSlug
          }
        }
        return this.find(opts)
          .then((result) => {
            return JSON.parse(JSON.stringify(result));
          });
      },
      addPost: async function(opts) {
        return this.create(opts);
      }
    },
  },
  associations: function() {
    Post.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id'
    });
  }

};
