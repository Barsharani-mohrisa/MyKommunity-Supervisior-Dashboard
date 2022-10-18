var express = require("express");
var bodyparser = require("body-parser");
var cors = require("cors");
var mysql = require("mysql2");

var app=express();

app.use(cors());
app.use(bodyparser.json());

var db=mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'newschema',
    port: 3306,
});

db.connect(err=>{
    if(err) {console.log(err,'dberr');}
    console.log('database connected...');
});


app.get('/account',(req,res)=>{
    let qr = `select a.id,a.first_name,a.last_name,a.email,
    a.phone,a.password,
     a.is_staff,a.is_admin_approved,a.is_active,
    b.community_name,b.id
    from account a
    inner join communities_communitystaff c 
     on a.id = c.user_id
     inner join communities_community b
     on b.id = c.community_id where is_staff="1"`;
    db.query(qr,(err,result)=>{
        if(err)
        {
            console.log(err,'errs');
        }

        if(!err)
        {
            res.send({
                message:'All user data',
                data:result
            });
        }
    });
});


app.get('/user',(req,res)=>{
    let qr = `select * from account `;
    db.query(qr,(err,result)=>{
        if(err)
        {
            console.log(err,'errs');
        }

        if(!err)
        {
            res.send({
                message:'All user data',
                data:result
            });
        }
    });
});

app.get('/account/:id',(req,res)=>{
    
    let gID = req.params.id;

    let qr2 = `select * from account where id=${gID}`;

    db.query(qr2,(err,result2)=>{
        if (err) {
            console.log(err);
        }
        if (!err)
        {
            res.send({
                message:'Get single data',
                data:result2
            });
        }
        else 
        {
            res.send({
                message:'not found'
            });
        }
    
    });     
    });   


    app.post('/account',(req,res)=>{
        console.log(req.body,'createdata');

     /*   let staff = req.body;
        var sql ="SET @first_name = ?; SET @last_name = ?; SET @email = ?; SET @phone = ?;  SET @password = ?; SET @community_name = ?; \
        CALL "
        */

        
      let firstName = req.body.first_name;
        let lastName = req.body.last_name;
        let eMail = req.body.email;
        let mb = req.body.phone;
        let pwd = req.body.password;
        let community_id = req.body.community_id;
       
/*
        let qr = `insert into account(first_name,last_name,email,phone,password) \
        values('${firstName}','${lastName}','${eMail}','${mb}','${pwd}');`;
        
        qr += `insert into communities_communitystaff(community_id,role) values('${community_id}','management')\
                  
     let qr=`    SP_NEW_USER(
                    req.body.password,
                  req.body.phone,
                  req.body.email,
                  req.body.first_name,
                  req.body.last_name,
                  req.body.community_id,
                  1,
                  1,
                  1,
                  'management',
                  community_id);`
        
  
       */

    let qr = `insert into account(first_name,last_name,email,phone,password,is_staff,is_admin_approved,is_active) \
    values('${firstName}','${lastName}','${eMail}','${mb}','${pwd}',1,1,1);`;
                  
    qr += `insert into communities_communitystaff(community_id,role) values('${community_id}','management')`;

        db.query(qr,(err,result3)=>{
            if(err)
            {
                console.log(err);
            }
            console.log(result3,'result3')
            res.send({
                message:'data inserted',
            });
           
        });
    });


    app.get('/role',(req,res)=>{
        let qr = `select * from communities_communitystaff `;
        db.query(qr,(err,result)=>{
            if(err)
            {
                console.log(err,'errs');
            }
    
            if(!err)
            {
                res.send({
                    message:'All user data',
                    data:result
                });
            }
        });
    });
    

    app.post('/role',(req,res)=>{
        console.log(req.body,'createdata');

        let role = req.body.role;
    
        let qr = `insert into communities_communitystaff (role)
                        values('${role}')`;


        db.query(qr,(err,result3)=>{
            if(err)
            {
                console.log(err);
            }
            console.log(result3,'result3')
            res.send({
                message:'data inserted',
            });
           
        });
    });

    app.put('/account/:id',(req,res)=>{
        console.log(req.body,'updatedata');

        let gID = req.params.id;

        let firstName = req.body.first_name;
        let lastName = req.body.last_name;
        let eMail = req.body.email;
        let mb = req.body.phone;
        let pwd = req.body.password;
        let sts = req.body.is_active;
        let staff = req.body.is_staff;
        let sup = req.body.is_superuser;
        let community_name = req.community_name;

        let qr = `update account set 
                    first_name = '${firstName}',
                    last_name = '${lastName}',
                    email = '${eMail}',
                    phone = '${mb}',
                    password = '${pwd}',
                    is_active = '${sts}',
                    is_staff = '${staff}',
                    is_superuser = '${sup}',
                    community_name = '${community_name}'
                    where id = ${gID}`;

        db.query(qr,(err,result)=>{
            if(err){console.log(err);}
            res.send({
                message:'data updated...'
            });
        
        });
    });

app.delete('/account/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from account where id = '${dID}'`;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
});

app.get('/community',(req,res)=>{
    let qr = `select c.id, c.community_name,c.pincode,c.is_active,c.city_id,d.name
              from communities_community c 
              inner join communities_city d 
               on c.city_id = d.id 
               `;
    db.query(qr,(err,result)=>{
        if(err)
        {
            console.log(err,'errs');
        }

        if(!err)
        {
            res.send({
                message:'All user data',
                data:result
            });
        }
    });
});


app.post('/community',(req,res)=>{
    console.log(req.body,'createcom');

    let Name = req.body.community_name;
    let pincode = req.body.pincode;
    let sts = req.body.is_active;
    let id = req.body.city_id;

    let qr = `insert into communities_community(community_name,pincode,is_active,city_id)
                   values('${Name}','${pincode}','${sts}','${id}')
                    `;


    db.query(qr,(err,result3)=>{
        if(err)
        {
            console.log(err);
        }
        console.log(result3,'result3')
        res.send({
            message:'data inserted',
        });
       
    });
});



app.delete('/community/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from communities_community where id = '${dID}'`;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
});


app.put('/community/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let Name = req.body.community_name;
    let pincode = req.body.pincode;
    let sts = req.body.is_active;
    let city= req.body.city_id;

    let qr = `update communities_community set 
                 community_name = '${Name}',
                pincode = '${pincode}',
                city_id = '${city}',
                is_active = '${sts}'
                
                where id = ${gID}`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});

app.get('/city',(req,res)=>{
    let qr = `select * from communities_city `;
    db.query(qr,(err,result)=>{
        if(err)
        {
            console.log(err,'errs');
        }

        if(!err)
        {
            res.send({
                message:'All user data',
                data:result
            });
        }
    });
});

app.post('/city',(req,res)=>{
    console.log(req.body,'createdata');

    let Name = req.body.name;
    

    let qr = `insert into communities_city(name)
                    values('${Name}')`;


    db.query(qr,(err,result3)=>{
        if(err)
        {
            console.log(err);
        }
        console.log(result3,'result3')
        res.send({
            message:'data inserted',
        });
       
    });
});


app.put('/city/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let Name = req.body.name;
    

    let qr = `update communities_city set 
                 name = '${Name}'
               
                
                where id = ${gID}`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});



app.delete('/city/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from communities_city where id = '${dID}'`;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
});



app.get('/staff',(req,res)=>{
    let qr = `select * from residents_resident `;
    db.query(qr,(err,result)=>{
        if(err)
        {
            console.log(err,'errs');
        }

        if(!err)
        {
            res.send({
                message:'All user data',
                data:result
            });
        }
    });
});



app.listen(3000,()=>{
    console.log('Server Running...');
});