import io from 'socket.io-client';

const socket = () => {
    return io.connect(process.env.REACT_APP_SOCKET_URL);
};

export default socket;