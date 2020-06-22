import React from 'react';
import './style.scss';
function Header(props) {
  return (
    <div className='header'>
      <div className='userInfo'>
        <span>{props.username}</span>
        {props.isLogin ? (
          <button className='btn default' onClick={() => logout()}>
            Logout
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
  function logout() {
    localStorage.clear();
    props.loginListener(null);
  }
}
export default Header;
