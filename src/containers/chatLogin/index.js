import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './style.scss';
function ChatLogin(props) {
  const alert = useAlert();
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('zurna');
  const [isEnable, changeIsEnable] = useState(true);
  useEffect(() => {
    if (username.length > 3) {
      changeIsEnable(false);
    } else {
      changeIsEnable(true);
    }
  }, [username]);
  return (
    <div className='chatRoom'>
      <div className='form-gr'>
        <label>Username:</label>
        <input
          placeholder='enter your username'
          type='text'
          onChange={(e) => setUsername(e.target.value)}
          id='username'
        />
      </div>
      <div className='form-gr'>
        <label>Room:</label>
        <input
          placeholder='enter room name'
          type='text'
          onChange={(e) => setRoom(e.target.value)}
          id='room'
          value={room}
        />
      </div>
      <div className='submit'>
        <Link
          onClick={(e) => (!username || !room ? e.preventDefault() : null)}
          to={`/chat?name=${username}&room=${room}`}
        >
          <button type='submit' disabled={isEnable} className='btn default'>
            Connect
          </button>
        </Link>
      </div>
    </div>
  );
}
export default ChatLogin;
