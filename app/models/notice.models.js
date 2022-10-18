module.exports = (sequelize, DataTypes) => {
    const notice = sequelize.define("communities_notice", {
      subject: DataTypes.STRING,
      message: DataTypes.STRING,
      author_id: DataTypes.INTEGER,
      community_id: DataTypes.INTEGER
    },
    {
      createdAt:'published_at',
      tableName:'communities_notice',
      timestamps: false


    }
    );
    return notice;
  };