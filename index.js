const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');



app.set("view engine" , "views");
app.set("views" , path.join(__dirname , "/views"));

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended : true}));

const port = 8080;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'cosmic_app',
    password : "Arin@5754",
  });



  app.listen(port , () =>{
    console.log("app is listening at port : " ,port);
  });

  app.get("/" , (req,res) =>{
    let q = " SELECT count(*) FROM user";
     
    try{
        connection.query(q , (err , result) =>{
        if (err) throw err;
       let count = result[0]["count(*)"] 
        res.render("home.ejs" , {count});
  
      });
      } catch(err){
          console.log(err);
           res.send("Some error has occured");
      } 

  });

  app.get("/user", (req,res) =>{
    let q = "SELECT * FROM user";
      
    try{
        connection.query(q , (err , users) =>{
        if (err) throw err;
      
           res.render("showuser.ejs" , {users});
 
      });
      } catch(err){
          console.log(err);
            res.send("Some error has occured");
      } 
  });

  // EDIT ROUTE 

  app.get("/user/:id/edit" , (req,res) => {
    let {id} = req.params;
   
   
    let q = `SELECT * FROM user WHERE id = '${id}'`;
   
    try{
      connection.query(q , (err , result) =>{
      if (err) throw err;
      let user = result[0];
      
       res.render("edit.ejs" , {user});

    });
    } catch(err){
        console.log(err);
         res.send("Some error has occured on edit route");
    } 
    
  });

  //UPDATE (DB) ROUTE
  app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { username, password } = req.body;
    console.log(username);
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if(err) throw err;
        let user = result[0];
  
        if (user.password != password) {
          res.send("WRONG Password entered!");
        } else {
          let q2 = `UPDATE user SET username='${username}' WHERE id='${id}'`;
          connection.query(q2, (err, result) => {
            if (err) throw err;
            else {
              console.log(result);
              console.log("updated!");
              res.redirect("/user");
            }
          });
        }
      });
    } catch(err) {
      res.send("some error with DB");
    }
  });
  

 app.get("/user/new", (req ,res) =>{
  res.render("new.ejs");
 });

 app.post("/user/new" , (req ,res) =>{
  
  let { email , username , password } = req.body;
 let id = uuidv4();
 

 let q = `INSERT INTO user ( id , email , username , password) VALUES ( '${id}' ,'${email}' , '${username}' , '${password}')`;
 try{
  connection.query(q , (err ,result) => {
    if(err) throw err;
    
    
     res.redirect("/user");
  });

 } catch(err){
  return res.send("some error has accoured on the new page");
 }
 });


 app.get("/user/:id/delete" , (req,res) =>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  connection.query( q ,(err , result) =>{

    try{
      if(err) throw err;
      let user = result[0];
    
      res.render("delete.ejs" , {user});
    } catch{
      res.send("Some err has occured in the database")
    }
  })
 });

 app.delete("/user/:id" ,(req ,res) =>{

  let { id } = req.params;
    let { password } = req.body;
    // console.log(username);
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if(err) throw err;
        let user = result[0];
  
        if (user.password != password) {
          res.send("WRONG Password entered!");
        } else {
          let q2 = `DELETE  FROM user WHERE id='${id}'`;
          connection.query(q2, (err, result) => {
            if (err) throw err;
            else {
              console.log("Deleted");
              res.redirect("/user");
            }
          });
        }
      });
    } catch(err) {
      res.send("some error with DB");
    }

 });



//   connection.end();





