(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlePlayerUpdate = exports.handleNewMsg = exports.handleDisconnectUser = void 0;

var _sockets = require("./sockets");

var messages = document.getElementById("jsMessages");
var sendMsg = document.getElementById("jsSendMsg");
var scoreBoard = document.getElementById("jsScore");

var appendMsg = function appendMsg(text, nickname) {
  var li = document.createElement("li");
  li.innerHTML = "<span class=\"author ".concat(nickname ? "out" : "self", "\">").concat(nickname ? nickname : 'You', " : </span> ").concat(text);
  messages.appendChild(li);
};

var handleSendMsg = function handleSendMsg(event) {
  event.preventDefault();
  var input = sendMsg.querySelector('input');
  var value = input.value;
  (0, _sockets.getSocket)().emit(window.events.sendMsg, {
    message: value
  });
  input.value = "";
  appendMsg(value);
};

var handleNewMsg = function handleNewMsg(_ref) {
  var message = _ref.message,
      nickname = _ref.nickname;
  appendMsg(message, nickname);
};

exports.handleNewMsg = handleNewMsg;

var addPlayer = function addPlayer(players) {
  scoreBoard.innerText = "";
  players.forEach(function (player) {
    var playerSpan = document.createElement("span");
    playerSpan.innerText = "".concat(player.nickname, " : ").concat(player.score, "\uC810");
    scoreBoard.appendChild(playerSpan);
  });
};

var handlePlayerUpdate = function handlePlayerUpdate(_ref2) {
  var sockets = _ref2.sockets;
  addPlayer(sockets);
};

exports.handlePlayerUpdate = handlePlayerUpdate;

var handleDisconnectUser = function handleDisconnectUser() {
  messages.innerText = "";
};

exports.handleDisconnectUser = handleDisconnectUser;

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}

;

},{"./sockets":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleStrokedPath = exports.handleFilled = exports.handleBeganPath = exports.fill = exports.enableChat = exports.enableCavas = exports.disableCanvas = exports.diableChat = void 0;

var _sockets = require("./sockets");

var canvas = document.getElementById("jsCanvas");
var controls = document.getElementById("jsControls");
var colors = document.getElementsByClassName("jsColor");
var range = document.getElementById("jsRange");
var button = document.getElementById("jsMode");
var ctx = canvas.getContext("2d");
var form = document.getElementById("jsSendMsg");
var input = form.querySelector("input");
canvas.width = "700";
canvas.height = "700";
ctx.strokeStyle = "black";
ctx.lineWidth = "2.5";
var painting = false;
var filling = false;

var stopPainting = function stopPainting() {
  painting = false;
};

var handleMouseMove = function handleMouseMove(event) {
  var x = event.offsetX;
  var y = event.offsetY;

  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    (0, _sockets.getSocket)().emit(window.events.beginPath, {
      x: x,
      y: y
    });
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
    (0, _sockets.getSocket)().emit(window.events.strokePath, {
      x: x,
      y: y,
      color: ctx.strokeStyle,
      lineWidth: ctx.lineWidth
    });
  }
};

var handleMouseDown = function handleMouseDown() {
  painting = true;
};

var handleMouseUp = function handleMouseUp() {
  stopPainting();
};

var changeColor = function changeColor(event) {
  var color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
};

var changeWidth = function changeWidth(event) {
  ctx.lineWidth = event.target.value;
};

var handleBtn = function handleBtn() {
  if (!filling) {
    filling = true;
    button.innerText = "Stroke";
  } else {
    filling = false;
    button.innerText = "Fill";
  }
};

var handleCanvasClick = function handleCanvasClick() {
  if (filling === true) {
    fill();
    (0, _sockets.getSocket)().emit(window.events.fill, {
      color: ctx.fillStyle
    });
  }

  ;
};

var handleBeganPath = function handleBeganPath(_ref) {
  var x = _ref.x,
      y = _ref.y;
  ctx.beginPath();
  ctx.moveTo(x, y);
};

exports.handleBeganPath = handleBeganPath;

var handleStrokedPath = function handleStrokedPath(_ref2) {
  var x = _ref2.x,
      y = _ref2.y,
      color = _ref2.color,
      lineWidth = _ref2.lineWidth;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineTo(x, y);
  ctx.stroke();
};

exports.handleStrokedPath = handleStrokedPath;

var fill = function fill() {
  var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var currentColor = ctx.fillStyle;

  if (color != null) {
    ctx.fillStyle = color;
  }

  ctx.fillRect(0, 0, 700, 700);
  ctx.fillStyle = currentColor;
};

exports.fill = fill;

var handleFilled = function handleFilled(_ref3) {
  var color = _ref3.color;
  fill(color);
};

exports.handleFilled = handleFilled;

var disableCanvas = function disableCanvas() {
  canvas.removeEventListener("mousemove", handleMouseMove);
  canvas.removeEventListener("mousedown", handleMouseDown);
  canvas.removeEventListener("mouseup", handleMouseUp);
  canvas.removeEventListener("mouseleave", stopPainting);
  canvas.removeEventListener("click", handleCanvasClick);
  controls.style.display = "none";
};

exports.disableCanvas = disableCanvas;

var enableCavas = function enableCavas() {
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
  controls.style.display = "block";
};

exports.enableCavas = enableCavas;

var diableChat = function diableChat() {
  input.style.display = "none";
};

exports.diableChat = diableChat;

var enableChat = function enableChat() {
  input.style.display = "block";
};

exports.enableChat = enableChat;

if (canvas) {
  disableCanvas();
}

;
Array.from(colors).forEach(function (color) {
  return color.addEventListener("click", changeColor);
});
range.addEventListener("input", changeWidth);
button.addEventListener("click", handleBtn);

},{"./sockets":7}],3:[function(require,module,exports){
"use strict";

var _sockets = require("./sockets");

var body = document.querySelector('body');
var loginForm = document.getElementById('jsLogin');
var nickname = localStorage.getItem("nickname");

var logIn = function logIn(nickname) {
  var socket = io("/");
  socket.emit(window.events.setNickname, {
    nickname: nickname
  });
  (0, _sockets.initSocket)(socket);
};

if (nickname === null) {
  body.className = "loggedOut";
} else {
  body.className = "loggedIn";
  logIn(nickname);
}

;

var handleSubmit = function handleSubmit(event) {
  event.preventDefault();
  var input = loginForm.querySelector('input');
  var value = input.value;
  input.value = "";
  localStorage.setItem("nickname", value);
  body.className = "loggedIn";
  logIn(value);
};

if (loginForm) {
  loginForm.addEventListener("submit", handleSubmit);
}

;

},{"./sockets":7}],4:[function(require,module,exports){
"use strict";

require("./login");

require("./chat");

require("./notifications");

require("./game");

},{"./chat":1,"./game":2,"./login":3,"./notifications":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleNewUser = exports.handleDisconnected = void 0;
var body = document.querySelector('body');

var fireNotifications = function fireNotifications(text, color) {
  var notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerText = text;
  notification.style.backgroundColor = color;
  body.appendChild(notification);
};

var handleNewUser = function handleNewUser(_ref) {
  var nickname = _ref.nickname;
  return fireNotifications("".concat(nickname, "\uB2D8\uC774 \uB85C\uADF8\uC778\uD588\uC2B5\uB2C8\uB2E4."), "rgb(0, 122, 255)");
};

exports.handleNewUser = handleNewUser;

var handleDisconnected = function handleDisconnected(_ref2) {
  var nickname = _ref2.nickname;
  return fireNotifications("".concat(nickname, "\uB2D8\uC774 \uB85C\uADF8\uC544\uC6C3\uD588\uC2B5\uB2C8\uB2E4."), "rgb(255, 59, 48)");
};

exports.handleDisconnected = handleDisconnected;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleLeaderNotif = exports.handleGameStarted = exports.handleGameEnded = exports.handleBeforeGameStart = void 0;

var _game = require("./game");

var span = document.getElementById("jsSpan");

var setWord = function setWord(word) {
  span.innerText = "";
  span.innerText = word;
};

var resetCanvas = function resetCanvas() {
  (0, _game.fill)("#fff");
};

var handleLeaderNotif = function handleLeaderNotif(_ref) {
  var word = _ref.word;
  setWord(word);
  (0, _game.enableCavas)();
  (0, _game.diableChat)();
};

exports.handleLeaderNotif = handleLeaderNotif;

var handleGameStarted = function handleGameStarted() {
  setWord("문제를 맞춰주세요");
  (0, _game.disableCanvas)();
};

exports.handleGameStarted = handleGameStarted;

var handleGameEnded = function handleGameEnded() {
  setWord("게임이 종료되었습니다.");
  (0, _game.disableCanvas)();
  resetCanvas();
  (0, _game.enableChat)();
};

exports.handleGameEnded = handleGameEnded;

var handleBeforeGameStart = function handleBeforeGameStart() {
  setWord("게임이 곧 시작합니다.");
};

exports.handleBeforeGameStart = handleBeforeGameStart;

},{"./game":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSocket = exports.getSocket = void 0;

var _notifications = require("./notifications");

var _chat = require("./chat");

var _players = require("./players");

var _game = require("./game");

var socket = null;

var getSocket = function getSocket() {
  return socket;
};

exports.getSocket = getSocket;

var initSocket = function initSocket(socket2) {
  var _window = window,
      events = _window.events;
  socket = socket2;
  socket.on(events.newUser, _notifications.handleNewUser);
  socket.on(events.disconnected, _notifications.handleDisconnected);
  socket.on(events.newMsg, _chat.handleNewMsg);
  socket.on(events.beganPath, _game.handleBeganPath);
  socket.on(events.strokedPath, _game.handleStrokedPath);
  socket.on(events.filled, _game.handleFilled);
  socket.on(events.playerUpdate, _chat.handlePlayerUpdate);
  socket.on(events.leaderNotif, _players.handleLeaderNotif);
  socket.on(events.gameStarted, _players.handleGameStarted);
  socket.on(events.gameEnded, _players.handleGameEnded);
  socket.on(events.beforeGameStart, _players.handleBeforeGameStart);
  socket.on(events.disconnectUser, _chat.handleDisconnectUser);
};

exports.initSocket = initSocket;

},{"./chat":1,"./game":2,"./notifications":5,"./players":6}]},{},[4]);
