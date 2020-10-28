import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';

import './App.scss';
import Header from './components/header/header.component';

const App: React.FC = () => {
  return (
    <div className='App'>
      <Header />
    </div>
  );
};

export default App;
