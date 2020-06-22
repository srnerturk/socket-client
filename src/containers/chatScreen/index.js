import React, { useState, useEffect, useRef } from 'react';
import { useAlert } from 'react-alert';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import './style.scss';
let socket;
function ChatScreen() {
  let location = useLocation();
  const ENDPOINT = 'http://localhost:4001';
  const alert = useAlert();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const history = useHistory();
  const divRef = useRef(null);
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setRoom(room);
    setName(name);
    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert.error(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket.on('message', (message) => {
      if (message.user === 'admin') {
        alert.show(message.text);
        return;
      }
      if (message.user.toLowerCase() !== name.toLocaleLowerCase()) {
        const msg = {
          chatMessage: message.text,
          type: 'other-message',
          user: message.user,
        };
        setMessages((messages) => [...messages, msg]);
      }
    });

    socket.on('roomData', ({ users }) => {
      console.log(users);
      setUsers([...users]);
    });
  }, []);

  useEffect(() => {
    divRef.current.scrollTop = divRef.current.scrollHeight;
  });

  function onInputChange(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }
  function sendMessage() {
    const { name, room } = queryString.parse(location.search);
    const msg = {
      chatMessage: message,
      type: 'my-message',
      user: name,
    };
    setMessages([...messages, msg]);

    const data = {
      type: 'NewMessage',
      data: message,
    };
    socket.emit('sendMessage', message, () => setMessage(''));
    setMessage('');
  }
  return (
    <div className='container clearfix'>
      <div class='people-list' id='people-list'>
        <ul class='list'>
          {users.map((item, i) => (
            <li class='clearfix'>
              <div className='avatar'>
                {item.name.substring(0, 1).toLocaleUpperCase()}
              </div>
              <div class='about'>
                <div class='name'>{item.name}</div>
                <div class='status'>
                  <div class='online'></div> online
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div class='chat'>
        <div ref={divRef} class='chat-history'>
          <ul>
            {messages.map((message, i) => (
              <li class='clearfix'>
                <div
                  className={
                    message.type === 'other-message'
                      ? 'message-data align-left'
                      : 'message-data align-right'
                  }
                >
                  <span class='message-data-name'>{message.user}</span>
                  <span class='message-data-time'>10:10 AM, Today</span> &nbsp;
                  &nbsp;
                </div>
                <div className={`message ${message.type}`}>
                  {message.chatMessage}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div class='chat-message clearfix'>
          <textarea
            onKeyDown={(e) => onInputChange(e)}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Enter your message'
            value={message}
            rows='3'
          ></textarea>
          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
