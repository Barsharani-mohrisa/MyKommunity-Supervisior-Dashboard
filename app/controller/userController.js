
var db = require('../models');
const { sequelize } = require("../models"); 


const user = db.user;
const notice = db.notice;
const file = db.file;
const notice_files = db.notice_files;

const {response} = require('express');


var oneToMany = async (req,resp)=>{

    let data = await user.findAll({
        attributes:['first_name','last_name'],
        include:[{
            model:notice,
            as:'noticeDetail',
            attributes:['subject']
        }],
        where:{id:11} 
    });
    resp.status(200).json(data);
}

var belongsTo = async (req,resp)=>{

    let data = await notice.findAll({
        attributes:['subject','message'],
        include:[{
            model:user,
            as:'userInfo',
            attributes:['first_name','last_name']
        }]
    });
    resp.status(200).json(data);
}

var manyToMany = async (req,resp)=>{

    let data = await user.findAll({
        attributes:['first_name','last_name'],
        include:[{
            model:notice,
            as:'noticeDetails',
            attributes:[]
        }],
        where :{id:11}
    });
    resp.status(200).json(data);
}

var add = async (req,res)=>{

    let data = await notice.create({
        subject : req.body.subject, 
        message : req.body.message, 
        author_id:'11',
        community_id:'1'
});

res.status(200).json(data)
}

var multer = async (req,res)=>{
    
    let transaction;
    try {
        transaction = await sequelize.transaction();
        // chain all your queries here. make sure you return them.
        let data = await notice.create({
            subject: req.body.subject, 
            message : req.body.message, 
            author_id:'11',
            community_id:'1'
        }, { transaction });
      //  data = await data.save();

     let f =  await file.create({
            image: req.file.filename,
            owner_id: '11'
        }, { transaction });
      //  console.log(req.file);

        await notice_files.create({
           
            file_id: f.id,
            notice_id: data.id
        }, { transaction })
        
    //    data = await data.save();

    
    console.log('success');
    await transaction.commit(); 
} catch (error) {
    console.log('error');
}

     res.status(200).json(notice)
 }

 var image = async (req,res)=>{
    console.log(req.file);
    let data = await file.create({
        image:req.file.filename,
        owner_id:'11'   
    });
    try{
        data = await data.save();
    }catch(err){
        console.log(err,'error');
    }
     res.status(200).json({message:'uploaded'})
 }

module.exports ={
    oneToMany,
    belongsTo,
    manyToMany,
    add,
    multer,
    image
}