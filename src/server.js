import express from "express";
import morgan from "morgan";
import socketIO from "socket.io";
import {globalRouter} from "./routers";
import socketController from "./socketController";
const PORT = 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', process.cwd()+`/src/views`);
app.use(morgan('dev'));
app.use("/", globalRouter);
app.use(express.static(process.cwd()+"/src/static"));

const handleListen = () => {
    console.log(`Listening at http://localhost:${PORT}`)
};
const server = app.listen(PORT, handleListen);
const io = socketIO(server);

io.on("connection", (socket) => socketController(socket, io));