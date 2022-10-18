const express = require('express');
const app = express();
var bodyparser = require("body-parser");
var cors = require("cors");

const port = 8000;
require('./models');
var userCtrl = require('./controller/userController');

const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'image/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

app.use(cors());
app.use(bodyparser.json());

app.get("/", (res,resp)=>{
  resp.send("Home Page");
});

app.get("/oneToMany", userCtrl.oneToMany);
app.get("/belongsTo", userCtrl.belongsTo);
app.get("/manyToMany", userCtrl.manyToMany);
app.post("/add", userCtrl.add);


app.post("/notice", upload.single('image'),userCtrl.multer);
app.post("/image", upload.single('image'),userCtrl.image);




app.listen(port,()=>{
  console.log(`App is listening at http://localhost:${port}`);
});

