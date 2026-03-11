import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5001', {
      auth: { token: localStorage.getItem('token') }
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const joinChannel = (channelId) => socket?.emit('joinChannel', channelId);
  const sendMessage = (channelId, message) => socket?.emit('sendMessage', { channelId, message });
  const onReceiveMessage = (callback) => socket?.on('receiveMessage', callback);

  return { socket, joinChannel, sendMessage, onReceiveMessage };
};

export default useSocket;
