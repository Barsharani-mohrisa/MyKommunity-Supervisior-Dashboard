module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define("account", {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING
    },
    {
      tableName:'account',
      CreatedAt:'date_joined'
    }
    );
    return user;
  };