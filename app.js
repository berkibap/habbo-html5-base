// author: Necmi Hasan
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
var server = app.listen(1337, () => {
  console.log('Webserver listening on port 1337!');
});
const io = require('socket.io')(server);
const setTitle = require('node-bash-title');

const sqlite3 = require('sqlite3');
let db = new sqlite3.Database("./db/habbo.db", 
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
    (err) => { 
        // do your thing 
    });

const path = require('path');

// Express configuration
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.console.logger('[:mydate] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));
app.use(express.static(path.join(__dirname, 'public')));

//console.log(db.get('rooms').find({ owner : 'Kylon' }).value().title);
let authenticated = [
  {
    users: {}
  }
]
let connections = [];
// Socket Events
io.on('connection', (socket) => {
  
  socket.on('message', (msg) => {
    //not finished '-'
  });

  socket.on('auth', (user) => {
    let sql = 'SELECT * FROM users WHERE username = ?'
    let username = user.username;
    let users = db.all(sql , [username], (err, rows) => {
      console.log(rows);
      if(rows.length > 0) {
        let checkPassword = bcrypt.compareSync(user.password, rows[0].password);
        if(checkPassword === true){
          socket.emit('auth', true);
          let size = Object.keys(authenticated[0].users).length;
          authenticated[0].users[size + 1] = rows[0];
          connections.push(socket);
          socket.on('disconnect', (data) => {
            var i = connections.indexOf(socket);
            connections.splice(i,1);
          })
          socket.emit('auth', {message: 'ok', userData: rows[0]})
          let onlineUsers = size;
          setTitle('HABBO SERVER - [' +  onlineUsers + '] USERS ONLINE');
          //send all rooms
          db.all("SELECT * FROM rooms INNER JOIN users ON rooms.owner_id = users.id INNER JOIN room_models ON room_models.id = rooms.model_id", (err, rows) => {
            if(err) socket.emit('rooms error', err);
            socket.emit('rooms', [rows]);
          });
        }
        else {
          socket.emit('auth', {messsage: 'incorrect password'});
        }
        //set auth for client and server to true
        
      }
      else {
        socket.emit('auth', {message: 'user not found.'});
      }
    })
    //Check if user Kylon exists
    
  });

  socket.on('disconnect', (data) => {
    console.log('user disconnected');
    
  });
});

// Handle Routes
app.get('/', (req, res) => {
  res.sendFile('/views/index.html', { root: __dirname });
});

console.log('Starting Game');
