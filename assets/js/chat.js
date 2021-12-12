import { getSocket } from './sockets';

const messages = document.getElementById("jsMessages");
const sendMsg = document.getElementById("jsSendMsg");
const scoreBoard = document.getElementById("jsScore");

const appendMsg = (text, nickname) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="author ${nickname? "out" : "self"}">${nickname? nickname : 'You'} : </span> ${text}`;
    messages.appendChild(li);
};

const handleSendMsg = (event) => {
    event.preventDefault();
    const input = sendMsg.querySelector('input');
    const {value} = input;
    getSocket().emit(window.events.sendMsg, {message : value});
    input.value = "";
    appendMsg(value);
};

export const handleNewMsg = ({message, nickname}) => {
    appendMsg(message, nickname);
};

const addPlayer = (players) => {
    scoreBoard.innerText = "";
    players.forEach((player) => {
        const playerSpan = document.createElement("span");
        playerSpan.innerText = `${player.nickname} : ${player.score}점`;
        scoreBoard.appendChild(playerSpan);
    })
};

export const handlePlayerUpdate = ({sockets}) => {
    addPlayer(sockets);
};

export const handleDisconnectUser = () => {
    messages.innerText = "";
};

if(sendMsg){
    sendMsg.addEventListener("submit", handleSendMsg);
};