import React, { useState, useEffect, useRef } from 'react';
import { useAlert } from 'react-alert';
import { useLocation } from 'react-router-dom';
import useSound from 'use-sound';
import queryString from 'query-string';
import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import userJoinedSound from '../../sounds/userjoined.mp3';
import newMessageSound from '../../sounds/new-message.wav';
import './style.scss';
let socket;
function ChatScreen() {
  const [userJoined] = useSound(userJoinedSound);
  const [newMessage] = useSound(newMessageSound);
  let location = useLocation();
  const ENDPOINT = 'https://srnsocketserver.herokuapp.com/';
  const alert = useAlert();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const divRef = useRef(null);
  const userJoinedTrigger = useRef();
  const newMessageTrigger = useRef();
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
        newMessageTrigger.current.click();
        const msg = {
          chatMessage: message.text,
          type: 'other-message',
          user: message.user,
          color: message.color,
        };
        setMessages((messages) => [...messages, msg]);
      }
    });

    socket.on('roomData', (data) => {
      if(data.type==="login"){
        userJoinedTrigger.current.click();
      }
      setUsers([...data.users]);
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
      <div className='people-list' id='people-list'>
        <ul className='list'>
          {users.map((item, i) => (
            <li key={i} className='clearfix'>
              <div className='avatar'>
                {item.name.substring(0, 1).toLocaleUpperCase()}
              </div>
              <div className='about'>
                <div className='name'>{item.name}</div>
                <div className='status'>
                  <div className='online'></div> online
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='chat'>
        <div ref={divRef} className='chat-history'>
          <ul>
            {messages.map((message, i) => (
              <li key={i} className='clearfix'>
                <div
                  className={
                    message.type === 'other-message'
                      ? 'message-data align-left'
                      : 'message-data align-right'
                  }
                >
                  <span className='message-data-name'>{message.user}</span>
                  <span className='message-data-time'>
                    10:10 AM, Today
                  </span>{' '}
                  &nbsp; &nbsp;
                </div>
                <div
                  style={{ backgroundColor: message.color }}
                  className={`message ${message.type}`}
                >
                  {message.chatMessage}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='chat-message clearfix'>
          <textarea
            onKeyDown={(e) => onInputChange(e)}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Enter your message'
            value={message}
            rows='3'
          ></textarea>
          <button onClick={() => sendMessage()}>Send</button>
          <button
            className='hidden'
            ref={userJoinedTrigger}
            onClick={() => userJoined()}
          >
            UserJoined
          </button>
          <button
            className='hidden'
            ref={newMessageTrigger}
            onClick={() => newMessage()}
          >
            NewMessage
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
