import events from "./events";
import {chooseWord} from "./words";

let sockets = [];
let inProgress = false;
let leader = null;
let word = null;
let timeout = null;
const chooseLeader = () => sockets[Math.floor(Math.random()*sockets.length)];

const socketController = (socket, io) => {
    const broadcast = (event, data) => socket.broadcast.emit(event, data);
    const superBroadcast = (event, data) => io.emit(event, data);
    const sendPlayerUpdate = () => superBroadcast(events.playerUpdate, {sockets});
    const startGame = () => {
        if (sockets.length > 1){
            if(inProgress===false){
                inProgress===true;
                leader = chooseLeader();
                word = chooseWord();
                superBroadcast(events.beforeGameStart);
                setTimeout(() => {
                    superBroadcast(events.gameStarted);
                    io.to(leader.id).emit(events.leaderNotif, {word});
                    timeout = setTimeout(endGame, 10000);
                }, 5000)
            };
        };
    };
    const endGame = () => {
        inProgress===false;
        superBroadcast(events.gameEnded);
        if(timeout !== null){
            clearTimeout(timeout);
        };
        setTimeout(() => startGame(), 5000);
        console.log(sockets);
    };
    const addPoint = (id) => {
        sockets = sockets.map(socket => {
            if(socket.id === id){
                socket.score += 10
            };
            return socket;
        });
        sendPlayerUpdate();
        endGame();
    };
    const resetScore = (sockets) => {
        sockets[0].score = 0;
        sendPlayerUpdate();
    };
    socket.on(events.setNickname, ({nickname})=>{
        socket.nickname = nickname;
        sockets.push({id:socket.id, score:0, nickname:socket.nickname});
        sendPlayerUpdate();
        broadcast(events.newUser, {nickname});
        if(sockets.length >= 2){
            startGame();
        };
    });
    socket.on(events.disconnect, () => {
        sockets = sockets.filter((socketInfo)=> socketInfo.id != socket.id);
        if(sockets.length === 1){
            endGame();
            superBroadcast(events.disconnectUser);
            resetScore(sockets);
        }else if(leader){
            if(leader.id === socket.id){
                endGame();
                superBroadcast(events.disconnectUser);
                resetScore(sockets);
            };
        };
        broadcast(events.disconnected, {nickname: socket.nickname});
        sendPlayerUpdate();
    });
    socket.on(events.sendMsg, ({message}) => {
        if(message === word){
            broadcast(events.newMsg, {message, nickname: socket.nickname});
            superBroadcast(events.newMsg, {
                message: `${socket.nickname}님이 정답을 맞췄습니다. 정답은 ${word}입니다.`,
                nickname: "Bot"
            });
            addPoint(socket.id);
        }else{
            broadcast(events.newMsg, {message, nickname: socket.nickname});
        };
    });
    socket.on(events.beginPath, ({x, y}) => {
        broadcast(events.beganPath, {x,y});
    });
    socket.on(events.strokePath, ({x,y,color,lineWidth}) => {
        broadcast(events.strokedPath, {x,y,color,lineWidth});
    });
    socket.on(events.fill, ({color}) => {
        broadcast(events.filled, {color});
    })
};

export default socketController;