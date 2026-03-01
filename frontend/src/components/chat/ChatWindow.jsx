import { useState, useRef, useEffect } from 'react';
import { Avatar } from '../../components';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { ArrowLeft, Phone, Video, Info, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const ChatWindow = ({
    conversation,
    messages,
    currentUser,
    onSendMessage,
    onTyping,
    onlineUsers,
    onBack
}) => {
    const [typingUsers, setTypingUsers] = useState({});
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const lastMessageIdRef = useRef(null);

    const otherParticipant = conversation?.participants?.find(
        p => p._id !== currentUser._id
    );

    const isOnline = onlineUsers.includes(otherParticipant?._id);

    // Handle typing indicators from socket
    useEffect(() => {
        const handleTypingStart = ({ senderId, senderName }) => {
            if (senderId === otherParticipant?._id) {
                setTypingUsers(prev => ({
                    ...prev,
                    [senderId]: senderName
                }));
            }
        };

        const handleTypingStop = ({ senderId }) => {
            if (senderId === otherParticipant?._id) {
                setTypingUsers(prev => {
                    const newState = { ...prev };
                    delete newState[senderId];
                    return newState;
                });
            }
        };

        window.addEventListener('typing:start', handleTypingStart);
        window.addEventListener('typing:stop', handleTypingStop);

        return () => {
            window.removeEventListener('typing:start', handleTypingStart);
            window.removeEventListener('typing:stop', handleTypingStop);
        };
    }, [otherParticipant?._id]);

    // Handle scroll behavior when new messages arrive
    useEffect(() => {
        const messagesContainer = messagesContainerRef.current;
        if (!messagesContainer || messages.length === 0) return;

        const currentLastMessage = messages[messages.length - 1];
        const currentLastMessageId = currentLastMessage?._id;

        if (currentLastMessageId && currentLastMessageId !== lastMessageIdRef.current) {

            const isOwnMessage = currentLastMessage?.sender?._id === currentUser._id;

            if (isOwnMessage) {
                setTimeout(() => {
                    messagesContainer.scrollTo({
                        top: messagesContainer.scrollHeight,
                        behavior: 'smooth'
                    });
                    setShowScrollButton(false);
                }, 50);
            } else {
                const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
                const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;

                if (isNearBottom) {
                    setTimeout(() => {
                        messagesContainer.scrollTo({
                            top: messagesContainer.scrollHeight,
                            behavior: 'smooth'
                        });
                        setShowScrollButton(false);
                    }, 50);
                } else {
                    setShowScrollButton(true);
                }
            }

            lastMessageIdRef.current = currentLastMessageId;
        }
    }, [messages, currentUser._id]);

    // Scroll to bottom on initial load
    useEffect(() => {
        if (messagesContainerRef.current && messages.length > 0) {
            // Scroll to bottom immediately when messages load
            setTimeout(() => {
                messagesContainerRef.current.scrollTo({
                    top: messagesContainerRef.current.scrollHeight,
                    behavior: 'instant' // Use 'instant' for initial load, no animation
                });
                setShowScrollButton(false);
            }, 100);
        }
    }, [messages]); // Run when messages change (initial load)

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
            setShowScrollButton(false);
        }
    };

    const handleScroll = () => {
        if (!messagesContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const date = format(new Date(message.createdAt), 'MMMM d, yyyy');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-5">
                    <button
                        onClick={onBack}
                        className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>

                    <div className="relative">
                        <Avatar
                            src={otherParticipant?.profileImage}
                            name={`${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
                            size="lg"
                        />
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                        )}
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {otherParticipant?.firstName} {otherParticipant?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {isOnline ? 'Online' : 'Offline'}
                            {Object.keys(typingUsers).length > 0 && (
                                <span className="ml-2 text-primary animate-pulse">
                                    typing...
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Phone size={18} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Video size={18} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Info size={18} className="text-gray-600" />
                    </button>
                </div> */}
            </div>

            {/* Messages Container */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-6"
                style={{ scrollBehavior: 'smooth' }}
            >
                {messages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No messages yet. Start the conversation!
                    </div>
                )}

                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date} className="space-y-4">
                        <div className="flex justify-center">
                            <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                                {date}
                            </span>
                        </div>

                        {dateMessages.map((message, index) => {
                            const showAvatar = index === 0 ||
                                dateMessages[index - 1].sender?._id !== message.sender?._id;

                            return (
                                <MessageBubble
                                    key={message._id}
                                    message={message}
                                    isOwn={message.sender?._id === currentUser._id}
                                    showAvatar={showAvatar}
                                    sender={message.sender}
                                />
                            );
                        })}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-28 right-8 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                >
                    <ArrowRight size={18} className="rotate-90" />
                </button>
            )}

            {/* Message Input */}
            <MessageInput
                onSendMessage={onSendMessage}
                onTyping={onTyping}
            />
        </div>
    );
};

export default ChatWindow;