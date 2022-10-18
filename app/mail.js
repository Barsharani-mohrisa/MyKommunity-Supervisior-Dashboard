var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'barsharani898@gmail.com',
    password: 'bimalkumar'
  }
});

var mailOptions = {
  from: 'barsharani898@gmail.com',
  to: 'barsharani.rath@mohrisa.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});