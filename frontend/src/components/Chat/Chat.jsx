import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { sendMessage, getMessages } from '../../api/ChatRequest';
import { getUser } from '../../api/UserRequest';
import { useSelector } from 'react-redux';
import './Chat.css';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

const Chat = ({ conversationId, receiverId }) => {
  const { authData } = useSelector((state) => state.authReducer);
  const currentUserId = authData?.user?._id || authData?.user?.id || authData?.id;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [peerUser, setPeerUser] = useState(null);
  const [warning, setWarning] = useState('');

  const fetchMessages = React.useCallback(async () => {
    if (!conversationId) return;
    try {
      const { data } = await getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  }, [conversationId]);

  useEffect(() => {
    socket.emit('addUser', currentUserId);

    socket.on('getUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('getMessage', (payload) => {
      setMessages((prev) => [...prev, payload]);
    });

    return () => {
      socket.off('getUsers');
      socket.off('getMessage');
    };
  }, [currentUserId]);

  useEffect(() => {
    const getReceiver = async () => {
      if (!receiverId) return;
      try {
        const { data } = await getUser(receiverId);
        setPeerUser(data);
      } catch (err) {
        setWarning('ไม่สามารถโหลดข้อมูลผู้รับได้');
      }
    };

    getReceiver();
  }, [receiverId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!message.trim() || !receiverId || !currentUserId || !conversationId) return;

    const msg = {
      conversationId,
      senderId: currentUserId,
      receiverId,
      text: message.trim()
    };

    try {
      await sendMessage(msg);
      socket.emit('sendMessage', msg);
      setMessages((prev) => [...prev, { ...msg, createdAt: new Date() }]);
      setMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const isPeerOnline = onlineUsers.some((u) => u.userId === receiverId);

  return (
    <div className="chatBox">
      <div className="chatHeader">
        <div>
          <h3>Chat with {peerUser ? `${peerUser.firstname} ${peerUser.lastname}` : '...'}</h3>
          <p>{peerUser?.username || 'unknown'}</p>
        </div>
        <div className={`status ${isPeerOnline ? 'online' : 'offline'}`}>
          {isPeerOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      {warning && <p className='chatWarning'>{warning}</p>}

      <div className="chatMeta">Online users: {onlineUsers.length}</div>
      <div className="chatContent">
        {messages.map((m, i) => (
          <div key={i} className={`chatBubble ${m.senderId === currentUserId ? 'mine' : 'theirs'}`}>
            <small>{m.senderId === currentUserId ? 'You' : peerUser?.firstname || m.senderId}</small>
            <div>{m.text}</div>
            <small className='msgTime'>{new Date(m.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div className="chatInputArea">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className='sendButton' onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
