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
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
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
  let sql  ="SELECT * FROM cnai WHERE category = 'homeNews' OR category = 'main'";
  db.all(sql,[],(err,data)=>{
    if (err){
      return console.error(err.message);
    }else{
      console.log(data);
 
      console.log("data['content_en']", data['name'])
      // let contents = data['content_en']
      // console.log(contents)
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
      ;
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
      ;
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



// en

app.get('/en/company', (req,res) => {
  let sql = "SELECT * FROM cnai WHERE category = 'companyHistory' OR category = 'companyLeader'";

  db.all(sql,[],(err,history)=>{
    if (err){
      return console.error(err.message);
    }
    res.render('company',{title: 'company-', data:history});
  })  
})

app.get('/en/community', (req,res) => {
  let sql  ="SELECT * FROM cnai WHERE category = 'communityNews' OR category = 'communityInvestment'";
  db.all(sql,[],(err,data)=>{
    if (err){
      return console.error(err.message);
    }else{
      ;
    res.render('community', {title: 'community-', data:data});
  }
  })  
})

app.get('/en/community/20220405', (req,res) => {
  let sql  ="SELECT * FROM cnai WHERE category = 'communityInvestment'";
  db.all(sql,[],(err,data)=>{
    if (err){
      return console.error(err.message);
    }else{
      ;
    res.render('community-board', {title: 'investment-', data:data});
  }
  })  

})

let career = {
  cHeadEn: {1: "Search CN.AI Job Openings", 2: "Together, We shine brighter",0:"Search CN.AI Job Openings", 4: 'The way we advance'},
  cHeadKr: {1:'함께이기에 <br />빛이 나는 사람들', 2:'그들의 이야기가 궁금하다면', 
  3: `아낌없는 지원으로 업무 몰입 뿐 아니라,
  팀원들의 성장과 자아실현까지 이끌어갑니다`,
  0: '채용공고 보러가기', 4:'우리가 성장하는 방식'
},
say1Kr: {1: { title: "시행착오의 가치를 믿어요.", id: 1, description: "실패는 잘못이 아니에요. 넘어지는 것을 두려워하지 않고, 다시 일어나 두 걸음 더 앞으로 나아가요." },
2: {title: "함께 성장하는 힘을 믿어요.", id: 2, description: "혼자보다 함께할 때 더 큰 변화를 만들 수 있음을 믿고, 신뢰를 기반으로 소통하며 하나의 목표를 위해 협력해 나가요."} ,
3: {title: "스스로 업무를 정의해나가요.", id: 3, description: "주체적으로 롤을 정의하고 업무를 선택하며 깊이 몰입해요. 끊임없이 역량을 쌓으며 더 나은 미래를 만들어 나가요."},
4: {title: "솔직함과 자유로움으로 성과를 만들어 나가요.", id:4, description: "의견 충돌을 두려워하지 않고 피드백을 나누며 서로가 더 건강하게 성장해요. 치열한 논의와 소통을 통해, 최고의 결과를 도출해요."}
},
say1En: {1: { title: "We believe in the value of trial and error", id: 1, description: "Failure is not a fault. We're not afraid to fall, we get up again and take two more steps forward." },
2: {title: "We believe in a team that grows together.", id: 2, description: "We believe that we can make greater changes when we are together than alone, communicate based on trust, and cooperate for one goal."} ,
3: {title: "We define our own work", id: 3, description: "We define roles independently, select tasks, and immerse deeply. Constantly develop our capabilities and create a better future."},
4: {title: "We make achievements with honesty and freedom.", id:4, description: "We are not afraid of disagreements. We share feedbacks for each other’s growth. Through intense discussion and communication, we produce the best results."}
}
}

let main = {
  say1Kr: {1: { title: "Medical 의료 분야", id: 1, title2: "일반적으로 구하기 어려운 희귀 병변 데이터를 생성하고 정밀하게 탐지합니다.", description: "개인 민감정보 활용 이슈에서 자유로운 의료 합성데이터를 만듭니다. 합성데이터는 학습 데이터의 부족 문제를 해결해 AI 진단의 정확도를 높입니다." },
2: {title: "AI Human 가상인간", id: 2, title2: "AI Human을 통해 가치를 전달하고, 언택트 시대의 소통을 혁신합니다.",description: "고도화된 영상/음성 합성기술로 실제 인간과 구분할 수 없는 수준의 가상인간을 만듭니다."} ,
3: {title: "Autonomous Driving 자율주행", title2: "보다 현실에 가까운 학습데이터로 자율주행의 안전성을 높입니다.", id: 3, description: "도로/주차 운전 시, 일상에서 수집하기 어려운 여러 상황을 학습데이터로 만듭니다."},
},
say1En: {1: { title: "BioMedical", id: 1, title2: "Generate rare lesion data that is typically difficult to obtain and detect with precision.", description: "Generate medical Synthetic Data is free from issues using personal sensitive information. Synthetic Data improves the accuracy of AI dianostics by solving the lack of learning data." },
2: {title: "AI Human", id: 2, title2: "Deliver value through AI Human and innovates communication in the untact era.",description: "Create a virtaul human that is indistinguishable from a real human using advanced video/voice synthesis technology. "} ,
3: {title: "Autonomous Driving", title2: "Increase the safety of Autonomus Driving with more realistic learing data.", id: 3, description: "When driving/parking, various situations that are difficult to collect in daily life are made into learning data."},
},
}

let company = {
  say1Kr:{1: { title: "사내 동아리 활동 운영",
  description: "골프 , 싸이클, 풋살, 클라이밍 등 동료들과 함께 즐기는 사내 동아리" },
  2: { title: "업무 몰입 및 역량 개발 지원",
  description: "업무용 최신 장비 지원 및 세미나, 도서 구입 등 자기개발비 지원" } ,
  3: {title: "식대 및 차대 제공 ",description: "점심식사와 커피 한잔은 물론, 간식과 야근식대까지 든든하게 보장"},
  4: {title: "리프레쉬 휴가(3, 5, 7주년)",description: "회사의 성장을 이끌어준 팀원들을 위해 리프레시 휴가 지급(2주)"}},

  say1En:{1: { title: "Support for in-house club activities",
  description: "In-house clubs to enjoy with colleagues such as golf, cycling, futsal, and climbing" },
  2: { title: "Support for engagement and employee competency development",
  description: "Support for the latest business equipment and self-development expenses such as seminars and book purchases" } ,
  3: {title: "Food/Transporation Support",description: "Support for lunch and a cup of coffee, as well as snacks and overtime meal"},
  4: {title: "Refresh vacation (3, 5, 7th Anniversary)",description: "Refresh vacation for team members who contributed to the company's growth (2 weeks)"}}

}


app.get("/en/career", (req, res) => {
console.log(JSON.stringify(career['cHeadEn']))
  let questions = ['What am I in CN.AI?','What are the merits of working at CN.AI?', 'As a co-worker, what kind of person fits you well? ', 'I LIKE THIS', "Do you have any goals you'd like to achieve in CN.AI?"]
  let sql = "SELECT * FROM cnai where category = 'career' OR category = 'careerInterview' ";
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("career", { data: rows, title: 'Job Openings-', questions:questions , zc :JSON.parse(JSON.stringify(career['cHeadEn'])), 
    say1: JSON.parse(JSON.stringify(career['say1Kr']))});
  })
});

app.get("/en", function (req, res) {
  let sql  ="SELECT * FROM cnai WHERE category = 'homeNews'";
  db.all(sql,[],(err,data)=>{
    if (err){
      return console.error(err.message);
    }else{
      // console.log(data);
    res.render('index', {title: 'Hi ', data:data});
  }
  })  
 });


