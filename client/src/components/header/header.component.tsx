import React from 'react';
import './header.styles.scss';

const Header: React.FC = () => {
  return (
    <div className='header'>
      <div className='app-name'>
        <h1 className='title'>PhotoShare</h1>
      </div>
    </div>
  );
};

export default Header;
