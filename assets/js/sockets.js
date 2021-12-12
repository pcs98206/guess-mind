import { handleNewUser, handleDisconnected } from "./notifications";
import { handleNewMsg, handlePlayerUpdate, handleDisconnectUser } from "./chat";
import { handleGameStarted, handleLeaderNotif, handleGameEnded, handleBeforeGameStart } from "./players";
import { 
    handleBeganPath, 
    handleStrokedPath, 
    handleFilled,
} from "./game";

let socket = null;

export const getSocket = () => socket;

export const initSocket= (socket2) => {
    const { events } = window;
    socket = socket2
    socket.on(events.newUser, handleNewUser);
    socket.on(events.disconnected, handleDisconnected);
    socket.on(events.newMsg, handleNewMsg);
    socket.on(events.beganPath, handleBeganPath);
    socket.on(events.strokedPath, handleStrokedPath);
    socket.on(events.filled, handleFilled);
    socket.on(events.playerUpdate, handlePlayerUpdate);
    socket.on(events.leaderNotif, handleLeaderNotif);
    socket.on(events.gameStarted, handleGameStarted);
    socket.on(events.gameEnded, handleGameEnded);
    socket.on(events.beforeGameStart, handleBeforeGameStart);
    socket.on(events.disconnectUser, handleDisconnectUser);
};