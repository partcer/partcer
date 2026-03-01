import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            const token = localStorage.getItem('accessToken');

            const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
                auth: { token },
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            socketRef.current = newSocket;

            newSocket.on('connect', () => {
                // console.log('Socket connected');
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                // console.log('Socket disconnected');
                setIsConnected(false);
            });

            newSocket.on('users:online', (users) => {
                setOnlineUsers(users);
            });

            newSocket.on('error', ({ message }) => {
                toast.error(message);
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        } else {
            if (socketRef.current) {
                socketRef.current.close();
                setSocket(null);
                setIsConnected(false);
            }
        }
    }, [isAuthenticated, user]);

    const value = {
        socket,
        isConnected,
        onlineUsers
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};