var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var socketIo = require("socket.io");
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
app.use(cors());
const server = require("http").createServer(app);

//--------------Socket IO------------------------
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var clients = 0;
io.on("connection", function (socket) {
  clients++;
  console.log(socket.id + "connected");

  socket.emit("me", {
    description: "Hey, welcome!" + socket.id + "from Sever !",
    socketId: socket.id,
  });
  
  io.sockets.emit("newclientconnect1", { description: "ALL CLIENT" });
  socket.broadcast.emit("newclientconnect", {
    description: clients + " clients connected!",
  });
  socket.on("disconnect", function () {
    clients--;
    socket.broadcast.emit("newclientconnect", {
      description: clients + " clients connected!",
    });
  });
});
//--------------------------------------

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = { app, server };
