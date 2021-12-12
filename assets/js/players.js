import { disableCanvas, enableCavas, fill, diableChat, enableChat } from "./game";

const span = document.getElementById("jsSpan");

const setWord = (word) => {
    span.innerText = "";
    span.innerText = word;
};

const resetCanvas = () => {
    fill("#fff");
};

export const handleLeaderNotif = ({word}) => {
    setWord(word);
    enableCavas();
    diableChat();
};

export const handleGameStarted = () => {
    setWord("문제를 맞춰주세요");
    disableCanvas();
};

export const handleGameEnded = () => {
    setWord("게임이 종료되었습니다.");
    disableCanvas();
    resetCanvas();
    enableChat();
};

export const handleBeforeGameStart = () => {
    setWord("게임이 곧 시작합니다.");
};