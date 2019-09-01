import Socket from "socket.io-client";

const socket = new Socket();

const useSocket = () =>
    socket;

export {
    useSocket
};
