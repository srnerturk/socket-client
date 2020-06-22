import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ChatLogin from './containers/chatLogin';
import ChatScreen from './containers/chatScreen';
import Header from './components/Header';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-oldschool-dark';
import './_global.scss';
import './app.scss';
const options = {
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE,
};

function App() {
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem('user') ? true : false
  );
  return (
    <div className='app'>
      <AlertProvider template={AlertTemplate} {...options}>
        <Router>
          <Switch>
            <Route exact path='/'>
              <ChatLogin />
            </Route>
            <Route path='/chat'>
              <ChatScreen />
            </Route>
          </Switch>
        </Router>
      </AlertProvider>
    </div>
  );
}

export default App;
