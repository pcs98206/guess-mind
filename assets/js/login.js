import { initSocket } from './sockets';

const body = document.querySelector('body');
const loginForm = document.getElementById('jsLogin');
const nickname = localStorage.getItem("nickname");

const logIn = (nickname) => {
    const socket = io("/");
    socket.emit(window.events.setNickname, {nickname});
    initSocket(socket);
};

if(nickname===null){
    body.className = "loggedOut"
}else{
    body.className = "loggedIn"
    logIn(nickname);
};

const handleSubmit = (event) => {
    event.preventDefault();
    const input = loginForm.querySelector('input');
    const { value } = input;
    input.value = "";
    localStorage.setItem("nickname", value);
    body.className = "loggedIn"
    logIn(value);
};

if(loginForm){
    loginForm.addEventListener("submit", handleSubmit);
};
