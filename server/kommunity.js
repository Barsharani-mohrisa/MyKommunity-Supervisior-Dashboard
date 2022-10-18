var express = require("express");
var bodyparser = require("body-parser");
var cors = require("cors");
//var mysql = require("mysql2");

var app=express();
var db = require('./dbconnection');
var bcrypt = require('bcrypt');

//var LocalStorage = require ('../node_modules/node-localstorage/LocalStorage');
//import {LocalStorage} from '../node_modules/node-localstorage' ;

// constructor function to create a storage directory inside our project for all our localStorage setItem.
//var ls = new LocalStorage('./scratch'); 
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');


app.use(cors());
app.use(bodyparser.json());


// current timestamp in milliseconds
const timestamp = Date.now();
 
const dateObject = new Date(timestamp);
const date = dateObject.getDate();
const month = dateObject.getMonth() + 1;
const year = dateObject.getFullYear();
// current hours
const hours = dateObject.getHours();
 
// current minutes
const minutes = dateObject.getMinutes();
 
// current seconds
const seconds = dateObject.getSeconds();
 
// prints date & time in YYYY-MM-DD format
console.log(`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`);
/*
var db=mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'mykom-dash',
    port: 3306,
});
*/

db.connect(err=>{
    if(err) {console.log(err,'dberr');}
    console.log('database connected...');
});


app.get('/account',(req,res)=>{
    let qr = `select a.id,a.first_name,a.last_name,a.email,
    a.phone,a.password,
     a.is_staff,a.is_admin_approved,a.is_active,
    b.community_name
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
app.patch('/approved/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let Approved = req.body.is_admin_approved;
    

    let qr = `update account set 
                 is_admin_approved = '1'
                where id = ${gID} ;

               `;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});


app.put('/notapproved/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let Approved = req.body.is_admin_approved;
    
    let qr = `update account set 
                 is_admin_approved = '0'
                where id = ${gID}  `;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});

app.put('/residentapproved/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let Approved = req.body.is_approved;
    

    let qr = `update residents_resident set 
                 is_approved = '1'
                where user_id = ${gID} ;

               `;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});

app.put('/residentnotapproved/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let Approved = req.body.is_approved;
    
    let qr = `update residents_resident set 
                 is_approved = '0'
                where user_id = ${gID}  `;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});


app.get('/security',(req,res)=>{
    var getcom = localStorage.getItem('community_id');
    let qr = `select a.id,a.first_name,a.last_name,a.email,
    a.phone,a.password,
     a.is_staff,a.is_admin_approved,a.is_active,
    b.community_name
    from account a
    inner join communities_communitystaff c 
     on a.id = c.user_id
     inner join communities_community b
     on b.id = c.community_id where c.role = "security" &&  community_id = ${getcom}`;
    db.query(qr,(err,result)=>{
        if(err)
        {
            console.log(err,'errs');
        }

        if(!err)
        {
            res.send({
                message:'All user data',
                data:result,
                community_id:result[0].community_id
            });
        }
    });
});

app.post('/security',(req,res)=>{
    console.log(req.body,'createdata');
 
    let firstname = req.body.first_name;
    let lastName = req.body.last_name;
    let eMail = req.body.email;
    let mb = "+91"+req.body.phone;
    let pwd = req.body.password;
    
    let community_name = req.body.community_id;
    let sts = req.body.is_active;
    

    let qr = `CALL Add_Security("${pwd}","${mb}","${eMail}","${firstname}","${lastName}","${year}-${month}-${date} ${hours}:${minutes}:${seconds}","${getcom}","${sts}")`;
                  
   

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

    app.put('/security/:id',(req,res)=>{
        console.log(req.body,'updatedata');

        let gID = req.params.id;

        let firstName = req.body.first_name;
        let lastName = req.body.last_name;
        let eMail = req.body.email;
        let mb = req.body.phone;
        let pwd = req.body.password;
        let sts = req.body.is_active;
        

        let qr = `update account set 
                    first_name = '${firstName}',
                    last_name = '${lastName}',
                    email = '${eMail}',
                    phone = '${mb}',
                    password = '${pwd}',
                    is_active = '${sts}'
                    where id = ${gID}`;

        db.query(qr,(err,result)=>{
            if(err){console.log(err);}
            res.send({
                message:'data updated...'
            });
        
        });
    });

app.delete('/security/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from communities_communitystaff where user_id = '${dID}' `;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
});

app.get('/user',(req,res)=>{
    let qr = `select * from account where is_staff=1 `;
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

app.get('/super',(req,res)=>{

     var getcom = localStorage.getItem('community_id');
    console.log(getcom, 'community id...');
    let qr = `select * from account a inner join residents_resident b on a.id = b.user_id inner join households_flat c on b.flat_id = c.id  where community_id = ${getcom}`;
    db.query(qr,(err,result)=>{
        if(err)
        {
            console.log(err,'errs');
        }

        if(!err)
        {
            res.send({
                message:'All user data',
                total_user:result.length,
                community_id:getcom,
                data:result
            });
        }
    });
});

/*
app.post('/login',(req,res)=>{
    console.log(req.body,'login');

    let email = req.body.email;
    let password = req.body.password;
                    
    let checkmailid = `select * from account where is_staff = '1' && email='${email}' `;

    db.query(checkmailid, async (err,result)=>{
        if(err) throw err;

       if(result.length > 0){
        
          let chkpwd = await bcrypt.compare (password,result[0].password);
          console.log(chkpwd, 'chkpwd##') ;

          if(chkpwd===false)
          {
              res.send({
                  status:true,
                  msg:'user login successfully'
              });

          } 
          else{
              res.send({
                  status:false,
                  msg:'Invalid user'
              });
          }
        }
        else
        {
        console.log(result,'result')
        res.send({
            status:false,
            msg:'invalid mailId'
        });
        }  
    });
});

*/

app.post('/login',(req,res)=>{
    console.log(req.body,'login');
    let email=req.body.email;
    let password=req.body.password;

    db.query('SELECT * FROM account inner join communities_communitystaff on account.id=communities_communitystaff.user_id WHERE is_staff = 1 && email = ? ',[email],function(error, results, fields){
      if(error){
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
        if(results){
            if(password == results[0].password){
                res.json({
                    status:true,
                    superuser:results[0].is_superuser,
                    message:'successfully authenticated',
                   first_name:results[0].first_name,
                   last_name:results[0].last_name,
                   community_id:results[0].community_id,
                   id:results[0].user_id

                })
              
                    localStorage.setItem('community_id', results[0].community_id);
                    localStorage.setItem('user_id', results[0].user_id);
                
                    
                   console.log(localStorage.getItem('community_id'));
                    
                  }
            
            else{
                res.json({
                  status:false,
                  message:"Email and password does not match"
                 });
            }
         
        }
        else{
          res.json({
              status:false,    
            message:"Email does not exist"
});
        }
      }
    });
});



// app.post('/loginAdmin',(req,res)=>{
//     console.log(req.body,'login');
//     let email=req.body.email;
//     let password=req.body.password;

//     db.query('SELECT * FROM account WHERE is_superuser = 1 && email = ? ',[email],function(error, results, fields){
//       if(error){
//           res.json({
//             status:false,
//             message:'there are some error with query'
//             })
//       }else{
//         if(results){
//             if(password==results[0].password){
//                 res.json({
//                     status:true,
//                     superuser:results[0].is_superuser,
//                     message:'successfully authenticated',
//                    first_name:results[0].first_name,
//                    last_name:results[0].last_name

//                 })
//               }
//                // }     
            
//             else{
//                 res.json({
//                   status:false,
//                   message:"Email and password does not match"
//                  });
//             }
         
//         }
//         else{
//           res.json({
//               status:false,    
//             message:"Email does not exist"
// });
//         }
//       }
//     });
// });

 


/*
// http://localhost:3000/login
app.post('/login', function(request, response) {
	// Capture the input fields
	let email = request.body.email;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified email and password
		db.query('SELECT * FROM account WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
			//	request.session.loggedin = true;
			//	request.session.email = email;
            
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect email and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter email and Password!');
		response.end();
	}
});
*/

app.get('/directory',(req,res)=>{
    var getcom = localStorage.getItem('community_id');

    let qr = `select a.id,a.password,a.first_name,a.last_name,a.email,a.phone,c.flat_number 
    from account a INNER JOIN residents_resident b on a.id=b.user_id inner join households_flat c on c.id=b.flat_id  where community_id = ${getcom}

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



app.delete('/super/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `
   delete from account where id='${dID}'
   `;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
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
      /*
      INSERT INTO kommunity.account
(
password,
phone,
email,
first_name,
last_name,
date_joined,
is_active,
is_admin_approved,
is_staff,
is_superuser)
VALUES
(
'ahs',
'+919853985340',
'a@xyz.com',
'too',
'jetry',
'2022-03-17 16:39:29.638094',
'1',
'1',
'1',
'0'
);
INSERT INTO kommunity.communities_communitystaff

(
role,
community_id,
user_id)
VALUES
(
'managment',
,
last_insert_id()

)
insert into account(first_name,last_name,email,phone,password,is_staff,is_admin_approved,is_active) 
    values('${firstName}','${lastName}','${eMail}','${mb}','${pwd}',1,1,1);
    INSERT INTO communities_communitystaff(role,community_id,user_id)
   VALUES('managment','${community_name}',last_insert_id())
      */
      /*   let staff = req.body;
    var sql ="SET @first_name = ?; SET @last_name = ?; SET @email = ?; SET @phone = ?;  SET @password = ?; SET @community_name = ?; \
    CALL "
    */

  
    
    
    


  /*  app.post('/account',(req,res)=>{
        console.log(req.body,'createdata');
     
        let firstname = req.body.first_name;
        let lastName = req.body.last_name;
        let eMail = req.body.email;
        let mb = '+91'+ req.body.phone;
        let pwd = req.body.password;
        
        let community_name = req.body.community_id;
        
        
    
        let qr = ` INSERT INTO account
          ( password, phone, email, first_name, last_name, is_admin_approved, is_staff, is_superuser,is_active)
           VALUES ( "${pwd}","${mb}","${eMail}","${firstname}","${lastName}", '1', '1', '1', '1' ); 
           INSERT INTO communities_communitystaff ( role, community_id,user_id )
            VALUES ( 'Management', "${community_name}", last_insert_id() )`;
                      
       
    
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
        
    */

    /*
    DROP PROCEDURE `Add_Supervisior`; CREATE DEFINER=`root`@`localhost` PROCEDURE `Add_Supervisior`
    (IN `password_p` VARCHAR(100), IN `phone_p` VARCHAR(13), IN `email_p` VARCHAR(100), IN `first_name_p`
     VARCHAR(100), IN `last_name_p` VARCHAR(100), IN `communityid_p` INT(6)) DETERMINISTIC CONTAINS SQL SQL
     SECURITY DEFINER BEGIN START TRANSACTION; INSERT INTO `mykom-dash`.`account`
      ( `password`, `phone`, `email`, `first_name`, `last_name`, `is_admin_approved`, `is_staff`, `is_superuser`, `is_active` )
       VALUES ( password_p, phone_p, email_p, first_name_p, last_name_p, '1', '1', '1', '1' ); 
       INSERT INTO `mykom-dash`.`communities_communitystaff` ( `role`, `community_id`, `user_id` )
        VALUES ( 'Management', communityid_p, last_insert_id() ); COMMIT; END
    */

    app.post('/super',(req,res)=>{
        console.log(req.body,'createdata');
     
        let firstname = req.body.first_name;
        let lastName = req.body.last_name;
        let eMail = req.body.email;
        let mb = '+91'+ req.body.phone;
        let pwd = req.body.password;
        
        let role = req.body.role;
        let occupancy = req.body.occupancy_status;
        let flat = req.body.flat_id;
        
    
        let qr = `CALL Add_Staff("${pwd}","${mb}","${eMail}","${firstname}","${lastName}","${year}-${month}-${date}","${role}","${occupancy}","${flat}")`;
                      
       
    
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

        app.put('/super/:id',(req,res)=>{
            console.log(req.body,'updatedata');
    
            let gID = req.params.id;
    
            let firstName = req.body.first_name;
            let lastName = req.body.last_name;
            let eMail = req.body.email;
            let mb = req.body.phone;
            let pwd = req.body.password;
    
            let qr = `update account set 
                        first_name = '${firstName}',
                        last_name = '${lastName}',
                        email = '${eMail}',
                        phone = '${mb}',
                        password = '${pwd}'
                        where id = ${gID}`;
    
            db.query(qr,(err,result)=>{
                if(err){console.log(err);}
                res.send({
                    message:'data updated...'
                });
            
            });
        });


    app.get('/complain',(req,res)=>{

        var getcom = localStorage.getItem('community_id');
        let qr = `select a.id,a.ticket_number,a.complain_type,a.description,a.status,a.created_at,b.first_name,c.image,d.comment 
                  from complaints_complaint a inner join account b on a.resident_id = b.id
                  inner join files_photo c on b.id = c.owner_id 
                  inner join complaints_comment d on a.id = d.complaint_id  where community_id = ${getcom} `;
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

    app.put('/complain/:complaint_id',(req,res)=>{
        console.log(req.body,'createdata');
        var user = localStorage.getItem('user_id');
        let gID = req.params.complaint_id;

        let comment = req.body.comment;
        let community_name = req.body.community_id;
    
        let qr = `insert into complaints_comment(comment,commented_by_id,complaint_id)
                        values('${comment}','${user}','${gID}') `;


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

        var getcom = localStorage.getItem('community_id');
        let qr = `select * from communities_communitystaff  where community_id = ${getcom}`;
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
        let email = req.body.user_id;
        let community_name = req.body.community_id;
    
        let qr = `insert into communities_communitystaff(role,user_id,community_id)
                        values('${role}','${email}','${community_name}')`;


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


    app.put('/role/:id',(req,res)=>{
        console.log(req.body,'updatedata');

        let gID = req.params.id;

        let role = req.body.role;
        let email = req.body.user_id;
        let community_name = req.body.community_id;
        

        let qr = `update communities_communitystaff set 
                    role = '${role}',
                    user_id = '${email}',
                    community_id = '${community_name}'
                    where id = ${gID}`;
                   

        db.query(qr,(err,result)=>{
            if(err){console.log(err);}
            res.send({
                message:'data updated...'
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
        

        let qr = `update account set 
                    first_name = '${firstName}',
                    last_name = '${lastName}',
                    email = '${eMail}',
                    phone = '${mb}',
                    password = '${pwd}',
                    is_active = '${sts}'
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

    let qr = `delete from communities_communitystaff where user_id = '${dID}'`;

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


app.get('/notice',(req,res)=>{
    var getcom = localStorage.getItem('community_id');
    let qr = `select a.id,a.message,a.subject,a.published_at,b.first_name,b.last_name from communities_notice a inner join account b on b.id = a.author_id  where community_id = ${getcom}`;
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

app.get('/notice2',(req,res)=>{
    var getcom = localStorage.getItem('community_id');
    let qr = `select * from communities_notice  where community_id = ${getcom}`;
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

app.post('/notice',(req,res)=>{
    console.log(req.body,'createdata');

    var getcom = localStorage.getItem('community_id');
    var getuser = localStorage.getItem('user_id');
    let Sub = req.body.subject;
    let Msg = req.body.message;
    let author = req.body.author;
    

    let qr = `insert into communities_notice(subject,message,author_id,community_id,published_at)
                    values('${Sub}','${Msg}',${getuser},${getcom},'${year}-${month}-${date} ${hours}:${minutes}:${seconds}')`;


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

app.put('/notice/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let Sub = req.body.subject;
    let Msg = req.body.message;

    let qr = `update communities_notice set 
                 subject = '${Sub}',
                 message = '${Msg}'    
               
            
                where id = ${gID}`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});

app.delete('/notice/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from  communities_notice where id = '${dID}'`;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
});


app.post('/notice2',(req,res)=>{
    console.log(req.body,'createdata');

    let image = req.body.image;
    
    let notice = req.body.notice_id;
    

    let qr = `CALL Add_Notice("${image}")`;


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



app.get('/servicecategory',(req,res)=>{
    var getcom = localStorage.getItem('community_id');
    let qr = `select * from local_services_category  where community_id = ${getcom} `;
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

app.post('/servicecategory',(req,res)=>{
    console.log(req.body,'createdata');

    let Name = req.body.service_name;
    //let com = req.body.community_id;
    var getcom = localStorage.getItem('community_id');

    let qr = `insert into local_services_category(service_name,community_id)
                    values('${Name}','${getcom}')`;


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


app.put('/servicecategory/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let Name = req.body.service_name;
   // let com = req.body.community_id;
   var getcom = localStorage.getItem('community_id');

    let qr = `update local_services_category set 
                 service_name = '${Name}',
                community_id = '${getcom}'
                
                where id = ${gID}`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});



app.delete('/servicecategory/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from local_services_category where id = '${dID}'`;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
});


app.get('/services',(req,res)=>{
     var getcom = localStorage.getItem('community_id');

    let qr = `select a.id,a.name,a.photo,a.passcode,a.contact_number,b.service_name from local_services_localservice a inner join local_services_category b on a.category_id = b.id where a.community_id = ${getcom}`;
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

app.post('/services',(req,res)=>{
    console.log(req.body,'createdata');

    let Fullname = req.body.name;
    let profile = req.body.photo;
   // let com = req.body.community_id;
    let category = req.body.category_id;
    let contact = req.body.contact_number;
    let passcode = req.body.passcode;
    var getcom = localStorage.getItem('community_id');
   
    let qr = `insert into local_services_localservice (name,photo,category_id,contact_number,community_id,passcode)
                    values('${Fullname}','${profile}','${category}','${contact}', '${getcom}','${passcode}')`;


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

app.put('/services/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let Fullname = req.body.name;
   // let profile = req.body.photo;
    //let com = req.body.community_id;
    let category = req.body.category_id;
    let contact = req.body.contact_number;
    let passcode = req.body.passcode;
    var getcom = localStorage.getItem('community_id');

    let qr = `update local_services_localservice set 
                 name = '${Fullname}',
                
                 community_id = '${getcom}',
                 category_id = '${category}',
                 contact_number = '${contact}',
                passcode = '${passcode}'

                where id = ${gID}`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});

app.delete('/services/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from local_services_localservice where id = '${dID}'`;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
});

app.get('/emergency',(req,res)=>{

    var getcom = localStorage.getItem('community_id');
    let qr = `select * from communities_emergencycontact  where community_id = ${getcom}`;
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


app.post('/emergency',(req,res)=>{
    console.log(req.body,'createdata');

    let contact = "+91"+req.body.contact;
    let title = req.body.title;
   // let id = req.body.community_id;
   var getcom = localStorage.getItem('community_id');
   
    let qr = `insert into communities_emergencycontact (contact,title,community_id)
                    values('${contact}','${title}', '${getcom}')`;


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
app.put('/emergency/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let contact = req.body.contact;
    let title = req.body.title;
    //let id = req.body.community_id;
    var getcom = localStorage.getItem('community_id');
    

    let qr = `update communities_emergencycontact set 
                 contact = '${contact}',
                 title = '${title}',
                 community_id = '${getcom}'
                      where id = ${gID}`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});



app.delete('/emergency/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from communities_emergencycontact where id = '${dID}'`;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
});

app.get('/block',(req,res)=>{

    var getcom = localStorage.getItem('community_id');
    let qr = `select * from communities_blockbuilding  where community_id = ${getcom} `;
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


app.post('/block',(req,res)=>{
    console.log(req.body,'createdata');

    let name = req.body.block_name;
    //let id = req.body.community_id;
    var getcom = localStorage.getItem('community_id');
   
    let qr = `insert into communities_blockbuilding (block_name,community_id)
                    values('${name}', '${getcom}')`;


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

app.put('/block/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let name = req.body.block_name;
    //let community = req.body.community_id;
    var getcom = localStorage.getItem('community_id');

    let qr = `update communities_blockbuilding set 
                 block_name = '${name}',
                 community_id = '${getcom}'
                      where id = ${gID}`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});

app.delete('/block/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from communities_blockbuilding where id = '${dID}'`;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
}); 



app.get('/floor',(req,res)=>{

    var getcom = localStorage.getItem('community_id');
    let qr = `select a.name,a.block_id,a.id,b.block_name from communities_floor a inner join communities_blockbuilding b on a.block_id = b.id  where community_id = ${getcom}`;
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

app.get('/floor/:block_id',(req,res)=>{

    var getcom = localStorage.getItem('community_id');
    let gid = req.params.block_id;
    let qr = `select * from communities_floor where block_id= ${gid}`;
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



app.post('/floor',(req,res)=>{
    console.log(req.body,'createdata');

    let name = req.body.name;
    let id = req.body.block_id;
   
    let qr = `insert into communities_floor (block_id,name)
                    values('${id}', '${name}')`;


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

app.put('/floor/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let name = req.body.name;
    let b_id = req.body.block_id;
   
    

    let qr = `update communities_floor set 
                 name = '${name}',
                 block_id = '${b_id}'
                      where id = ${gID}`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});



app.delete('/floor/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from communities_floor where id = '${dID}'`;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
}); 


app.get('/flat',(req,res)=>{

    var getcom = localStorage.getItem('community_id');
    let qr = `select c.id,c.flat_number,a.name,b.block_name from households_flat c 
    inner join communities_floor a on c.floor_id = a.id 
    inner join communities_blockbuilding b on a.block_id = b.id  where c.community_id=${getcom} `;
    db.query(qr,(err,result)=>{
        if(err)
        {
            console.log(err,'errs');
        }

        if(!err)
        {
            res.send({
                message:'All user data',
                community_id:result[0].community_id,
                data:result
            });
        }
    });
});

app.get('/getflat',(req,res)=>{

    var getcom = localStorage.getItem('community_id');
    let qr = `select * from households_flat   where community_id = ${getcom}`;
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


app.post('/flat',(req,res)=>{
    console.log(req.body,'createdata');

    let name = req.body.floor_id;
    let id = req.body.block_id;
    let flat = req.body.flat_number;
   // let com = req.body.community_id;
   var getcom = localStorage.getItem('community_id');
   
    let qr = `insert into households_flat (block_id,floor_id,flat_number,community_id)
                    values('${id}', '${name}', '${flat}','${getcom}')`;


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

app.put('/flat/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let floor_id = req.body.floor_id;
    let block_id = req.body.block_id;
    let flat = req.body.flat_number;
   
    

    let qr = `update households_flat set 
                 floor_id = '${floor_id}',
                 block_id = '${block_id}',
                 flat_number = '${flat}'
                      where id = ${gID}`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});

app.delete('/flat/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from households_flat where id = '${dID}'`;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
}); 


app.get('/gate',(req,res)=>{

    var getcom = localStorage.getItem('community_id');
    let qr = `select * from communities_gate  where community_id = ${getcom} `;
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

app.post('/gate',(req,res)=>{
    console.log(req.body,'createdata');

    let gate_name = req.body.gate_name;
   // let community = req.body.community_id;
   var getcom = localStorage.getItem('community_id');
   
    let qr = `insert into communities_gate (gate_name,community_id)
                    values('${gate_name}','${getcom}')`;


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

app.put('/gate/:id',(req,res)=>{
    console.log(req.body,'updatedata');

    let gID = req.params.id;
    let gate_name = req.body.gate_name;
   // let community = req.body.community_id;
   var getcom = localStorage.getItem('community_id');

    let qr = `update communities_gate set 
                 gate_name = '${gate_name}',
                 community_id = '${getcom}'
                      where id = ${gID}`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'data updated...'
        });
    
    });
});

app.delete('/gate/:id',(req,res)=>{
    let dID = req.params.id;

    let qr = `delete from communities_gate where id = '${dID}'`;

    db.query(qr,(err,result5)=>{
        if(err){console.log(err);}

        console.log(result5)
        res.send({
            message: 'data deleted...'
        });
    });
}); 






app.listen(3000,()=>{
    console.log('Server Running...');
});