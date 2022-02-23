//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');

const app = express();



app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true});

const userSchema = {
  username: String,
  mobile : String
};

const User = mongoose.model("User", userSchema);

///////////////////////////////////Requests Targetting all Articles////////////////////////

app.route("/users")

.get(function(req, res){
  User.find(function(err, foundUsers){
    if (!err) {
      res.send(foundUsers);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newUser = new User({
    username: req.body.username,
    mobile: req.body.mobile
  });

  newUser.save(function(err){
    if (!err){
      res.send("Successfully added a new User.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  User.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all Users.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/users/:username")

.get(function(req, res){

  User.findOne({title: req.params.username}, function(err, foundUsers){
    if (foundUsers) {
      res.send(foundUsers);
    } else {
      res.send("No users matching that username was found.");
    }
  });
})

.put(function(req, res){

  User.update(
    {username: req.params.username},
    {username: req.body.username, mobile: req.body.mobile},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected Users.");
      }
    }
  );
})

.patch(function(req, res){

  User.update(
    {username: req.params.username},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated users.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  User.deleteOne(
    {title: req.params.username},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding Users.");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
