const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('mykom-dash', 'root', '',{
  host:'localhost',
  dialect:'mysql',
  logging:true,
  pool:{max:5,min:0,idle:10000}
});

sequelize.authenticate()
.then(()=>{
  console.log("connected");
})
.catch(err=>{
  console.log("Error"+err);
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.sequelize.sync({force:false,match:/mykom-dash$/})
.then(()=>{
  console.log("yes re-sync");

})
db.user = require('./user')(sequelize,DataTypes);
db.notice = require('./notice.models')(sequelize,DataTypes);
db.file = require('./files.models')(sequelize,DataTypes);
db.notice_files = require('./notice_files')(sequelize,DataTypes);


db.user.hasOne(db.notice,{foreignKey:'author_id',as:'noticeDetail'});
db.notice.belongsTo(db.user,{foreignKey:'author_id', as:'userInfo'});
//db.file.belongsTo(db.user,{foreignKey:'owner_id', as:'userInfo'});


db.notice.belongsToMany(db.file,{foreignKey:'notice_id',through:'notice_files'});
db.file.belongsToMany(db.notice,{foreignKey:'file_id',through:'notice_files'});

module.exports = db;
