var express = require('express');
var app = express();
app.listen(8080);
app.use(express.static(__dirname));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://chatroom.db');
var create = 'CREATE TABLE IF NOT EXISTS message'
create+= '(id INTEGER PRIMARY KEY AUTOINCREMENT,room TEXT,nickname TEXT,body TEXT,time INTEGER)'
conn.query(create,function(err,result){
  if(err) console.log("Create database err:"+err);
})

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates, in this case the '/templates' directory
app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages

const uuidV4 = require('uuid/v4');


app.get('/',function(req,res){
  res.render('index.html',{root:__dirname});
})

app.get('/showrooms',getRooms)

app.get('/room',createRoom)

app.get('/:roomName',gotoRoom)

app.get('/:roomName/messages', getMessage)

app.post('/:roomName/messages', saveMessage)

function getRooms(req,res){
  var sql = 'SELECT room,time FROM message where NOT EXISTS ( SELECT m.room,m.time FROM message as m WHERE message.room=m.room AND m.time<message.time) ORDER BY time DESC limit 5'
  conn.query(sql, function(error, result){
      if(error){
        console.log(error);
      } else{
        res.json(result.rows)
      }
  })
}

function createRoom(req,res){
  var rand = uuidV4()
  var now = new Date().getTime()
  insert(rand,null,'The room created!',parseInt(now))
  // res.render('room.html', {roomName: rand});
  res.json({roomName: rand})
}

function gotoRoom(req, res){
  // do any work you need to do, then
  var sql = 'SELECT MIN(time) AS mintime FROM message WHERE room=$1'
  conn.query(sql,[req.params.roomName],function(error,result){
    if(error){
      console.log(error);
    } else{
      var row = result.rows
      var now = new Date().getTime()
      var time = row[0].mintime||parseInt(now)
      res.render('room.html', {roomName: req.params.roomName,time:time});
      console.log(new Date(time).toLocaleString())
    }
  })


}

function getMessage(req,res){
  var sql = 'SELECT nickname, body, time FROM message WHERE room=$1 AND time>$2 ORDER BY time ASC';
  conn.query(sql, [req.params.roomName,req.get('time')], function(error, result){
    if(error){
      console.log(error)
    } else{
      res.json(result.rows)
    }
  })
  // encode the messages object as JSON and send it back
}

function saveMessage(req, res) {
  var roomName = req.params.roomName
  var nickname = req.body.nickname
  var message = req.body.message
  var now = new Date().getTime()
  insert(roomName,nickname,message,parseInt(now))
  res.end()
}

function insert(roomName,nickname,message,time){
  var sql = 'INSERT INTO message(room,nickname,body,time) values($1,$2,$3,$4)'
  conn.query(sql,[roomName,nickname,message,time],function(err,result){
      if(err){
        console.log(err);
      }
  })
}
