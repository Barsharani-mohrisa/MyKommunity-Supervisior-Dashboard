

module.exports = (sequelize,DataTypes)=>{
    const notice_files = sequelize.define("communities_notice_media", {
        file_id: DataTypes.INTEGER,
        notice_id: DataTypes.INTEGER
    }, {
        timestamps: false,
        tableName:'communities_notice_media'

    });
    return notice_files;
}