import { getSocket } from "./sockets";

const canvas = document.getElementById("jsCanvas");
const controls = document.getElementById("jsControls");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const button = document.getElementById("jsMode");
const ctx = canvas.getContext("2d");
const form = document.getElementById("jsSendMsg");
const input = form.querySelector("input");

canvas.width = "700";
canvas.height = "700";
ctx.strokeStyle = "black";
ctx.lineWidth = "2.5";

let painting = false;
let filling = false;

const stopPainting = () => {
    painting = false;
};

const handleMouseMove = (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting){
        ctx.beginPath();
        ctx.moveTo(x,y);
        getSocket().emit(window.events.beginPath, {x, y});
    }else{
        ctx.lineTo(x,y);
        ctx.stroke();
        getSocket().emit(window.events.strokePath, {x, y, color:ctx.strokeStyle, lineWidth:ctx.lineWidth});
    }
};

const handleMouseDown = () => {
    painting = true;
};

const handleMouseUp = () => {
    stopPainting();
};

const changeColor = (event) => {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
};

const changeWidth = (event) => {
    ctx.lineWidth = event.target.value;
};

const handleBtn = () => {
    if(!filling){
        filling = true;
        button.innerText = "Stroke";
    }else{
        filling = false;
        button.innerText = "Fill";
    }
};

const handleCanvasClick = () => {
    if(filling===true){
        fill();
        getSocket().emit(window.events.fill, {color: ctx.fillStyle})
    };
};

export const handleBeganPath = ({x, y}) => {
    ctx.beginPath();
    ctx.moveTo(x,y);
};

export const handleStrokedPath = ({x, y, color,lineWidth}) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x,y);
    ctx.stroke();
};

export const fill = (color=null) => {
    let currentColor = ctx.fillStyle;
    if(color!=null){
        ctx.fillStyle = color;
    }
    ctx.fillRect(0,0,700,700);
    ctx.fillStyle = currentColor;
};

export const handleFilled = ({color}) => {
    fill(color);
};

export const disableCanvas = () => {
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mouseleave", stopPainting);
    canvas.removeEventListener("click", handleCanvasClick);
    controls.style.display="none";
};

export const enableCavas = () => {
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    controls.style.display="block";
};

export const diableChat = () => {
    input.style.display = "none";
};

export const enableChat = () => {
    input.style.display = "block";
};

if(canvas){
    disableCanvas();
};

Array.from(colors).forEach(color => color.addEventListener("click", changeColor));

range.addEventListener("input", changeWidth);
button.addEventListener("click", handleBtn);