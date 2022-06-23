const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const nunjucks = require('nunjucks');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db2 = require('./models');


const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});



passport.use(new Strategy(
  function(username, password, cb) {
    db2.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));



passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db2.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


const app = express();
app.engine('html', nunjucks.render);
app.set('view engine', 'html');
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));



app.use(connectLiveReload());

app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


app.get("/level", require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  res.render("level", { model: {} });
});

// POST /create
app.post("/level", (req, res) => {
  const sql = "INSERT INTO level (name, phone, eduson_id, TestType, Level, Date, score, scoreL, scoreR) VALUES (?,?,?,?,?,?,?,?,?)";
  const book = [req.body.name, req.body.phone,req.body.eduson_id, req.body.TestType, req.body.Level, req.body.Date, req.body.score, req.body.scoreL, req.body.scoreR ];
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/level");
  });
});



app.get('/login',
  function(req, res){
    res.render('login');
  }
  );
  
  app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    if (req.user.username == '1'){
      console.log(req.user.username)
      res.redirect('result');

      
    }else{
      res.redirect('level');
    }
    
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });




// Connection to SQLite
const db_name = path.join(__dirname, "data", "apptest.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("연결합니다 'apptest.db'");
});


app.listen(8080, () => {
    console.log("다음 주소에 연결되었어요( http://localhost:8080/ ) !");
});
app.get("/", function (req, res) {
  let sql  ="SELECT * FROM cnai WHERE category = 'homeNews'";
  db.all(sql,[],(err,data)=>{
    if (err){
      return console.error(err.message);
    }else{
      console.log(data);
    res.render('index', {title: 'Hello', data:data});
  }
  })  
 });



app.get('/company', (req,res) => {
  let sql = "SELECT * FROM cnai WHERE category = 'companyHistory' OR category = 'companyLeader'";

  db.all(sql,[],(err,history)=>{
    if (err){
      return console.error(err.message);
    }
    res.render('company',{title: '회사-', data:history});
  })  
})

app.get('/community', (req,res) => {
  let sql  ="SELECT * FROM cnai WHERE category = 'communityNews' OR category = 'communityInvestment'";
  db.all(sql,[],(err,data)=>{
    if (err){
      return console.error(err.message);
    }else{
      console.log(data);
    res.render('community', {title: '커뮤니티-', data:data});
  }
  })  
})

app.get('/community/20220405', (req,res) => {
  let sql  ="SELECT * FROM cnai WHERE category = 'communityInvestment'";
  db.all(sql,[],(err,data)=>{
    if (err){
      return console.error(err.message);
    }else{
      console.log(data);
    res.render('community-board', {title: '투자-', data:data});
  }
  })  

})



app.get("/career", (req, res) => {
  let questions = ['CN.AI에서 나는 어떤 사람? ','CN.AI에서 일하면서 좋은 점은 무엇인가요?', '동료로서, 어떤 성향의 사람이 잘 맞나요? ', 'I LIKE THIS', 'CN.AI에서 앞으로 이루고 싶은 목표가 있다면?']
  let sql = "SELECT * FROM career";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("career", { data: rows, title: '채용-', questions:questions });
  });
});


app.get('/test', (req,res) => {
  res.render('test', {title: 'test'});
})

// app.get("/", function (req, res) {
//   res.redirect("login");
//  });

