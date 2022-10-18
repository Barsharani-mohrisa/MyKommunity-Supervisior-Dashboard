module.exports = (sequelize, DataTypes) => {
    const file = sequelize.define("files_photo", {
      image:  DataTypes.STRING,
      owner_id: DataTypes.INTEGER
      
    },{
      tableName:'files_photo',
      timestamps: false


    }
    );
    return file;
  };