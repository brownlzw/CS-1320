var http = require('http')
var express = require('express');
var app = express();
var server = http.createServer(app)
app.use(express.static(__dirname));

// add socket.io
var io = require('socket.io').listen(server);




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

io.sockets.on('connection', function(socket){
    // clients emit this when they join new rooms
    socket.on('join', function(roomName, nickname, callback){
        socket.join(roomName); // this is a socket.io method
        socket.nickname = nickname; // yay JavaScript! see below
        var content = new Object()
        content.id = socket.id
        var sql = 'SELECT nickname, body, time FROM message WHERE room=$1 ORDER BY time ASC';
        conn.query(sql, [roomName], function(error, result){
            if(error){
              console.log(error)
            } else{
              content.messages = result.rows
              callback(content)
              socket.emit('broadcast','Welcome to chatroom '+roomName.substr(0,8))
            }
        })
        broadcast(socket,'join')
        // get a list of messages currently in the room, then send it back
    });

    // the client emits this when they want to send a message
    socket.on('message', function(message){
        // process an incoming message (don't forget to broadcast it to everyone!)

        // note that you somehow need to determine what room this is in
        // io.of(namespace).adapter.rooms[socket.id] may be of some help, or you
        // could consider adding another custom property to the socket object.

        // Note that io.sockets.adapter.sids is a hash mapping
        // from room name to true for all rooms that the socket is in.
        // The first member of the list is always the socket itself,
        // and each successive element is a room the socket is in,
        // So, to get the room name without adding another custom property,
        // you could do something like this:

        var roomName = Object.keys(io.sockets.adapter.sids[socket.id])[1];
        var now = new Date().getTime()
        insert(roomName,socket.nickname,message,now)
        io.sockets.in(roomName).emit('message', socket.id,socket.nickname, message,now);
        // then send the message to users!
    });

    // this gets emitted if a user changes their nickname
    socket.on('nickname', function(nickname){
        socket.nickname = nickname;
        broadcast(socket,'nickname')
        //broadcast update to room! (see below)
    });

    socket.on('typing',function(roomName){
      var data = new Object()
      data.name = socket.nickname
      data.id = socket.id
      socket.to(roomName).emit('typing',data)
    })

    socket.on('endtyping',function(roomName){
      socket.to(roomName).emit('endtyping',socket.id)
    })

    socket.on('away',function(roomName){
      broadcast(socket,'away')
       io.in(roomName).emit('away',socket.id)
    })

    socket.on('focus',function(roomName){
      broadcast(socket,'focus')
       io.in(roomName).emit('focus',socket.id)
    })

    // the client disconnected/closed their browser window
    socket.on('disconnecting', function(){
        // Leave the room!
        broadcast(socket,'leave')
    });


    // an error occured with sockets
    socket.on('error', function(){
        // Don't forget to handle errors!
        // Maybe you can try to notify users that an error occured and log the error as well.
        socket.emit('broadcast','Oops, there seems a error!')
    });

});

function broadcast(socket,type) {
    // send them out
    var roomName = Object.keys(io.sockets.adapter.sids[socket.id])[1];
    var nickname = socket.nickname
    var sockets = io.sockets.adapter.rooms[roomName].sockets
    var clients = [];
    for (key in sockets) { // sockets =
      var client = new Object()
      client.id = io.sockets.connected[key].id
      client.nickname = io.sockets.connected[key].nickname
	    clients.push(client)
     }

    if(type==='join'){
      socket.to(roomName).emit('broadcast','user '+nickname+' join this room');
    } else if(type==='leave'){
      socket.to(roomName).emit('broadcast', 'user '+nickname+' leave this room');
      socket.to(roomName).emit('leave', socket.id);
    } else if(type==='nickname'){
      socket.to(roomName).emit('broadcast','A user changes his/her name to '+nickname)
    } else if(type==='away'){
      socket.to(roomName).emit('broadcast',nickname+' is away')
    } else if(type==='focus'){
      socket.to(roomName).emit('broadcast',nickname+' is online')
    } else{
      console.log('type error:'+type);
    }
    io.sockets.in(roomName).emit('membershipChanged',clients)
}

app.get('/',function(req,res){
  res.render('index.html',{root:__dirname});
})

app.get('/showrooms',getRooms)

app.get('/room',createRoom)

app.get('/:roomName',gotoRoom)

function getRooms(req,res){
  var sql = 'SELECT room,time FROM message where NOT EXISTS ( SELECT m.room,m.time FROM message as m WHERE message.room=m.room AND m.time>message.time) ORDER BY time DESC limit 5'
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
  res.render('room.html', {roomName: req.params.roomName});
}

function insert(roomName,nickname,message,time){
  var sql = 'INSERT INTO message(room,nickname,body,time) values($1,$2,$3,$4)'
  conn.query(sql,[roomName,nickname,message,time],function(err,result){
      if(err){
        console.log(err);
      }
  })
}

server.listen(8080);
