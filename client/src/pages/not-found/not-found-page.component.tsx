import React from 'react';
import { NavLink } from 'react-router-dom';

import './not-found-page.styles.scss';

const NotFoundPage: React.FC = () => {
  return (
    <div className='not-found-page'>
      <h2 className='not-found-header'>Sorry, this page isn't available.</h2>
      <div className='not-found-body'>
        <span className='not-found-body-text'>
          The link you followed may be broken, or the page may have been
          removed.
          <NavLink to='/me'> Go back to PhotoShare.</NavLink>
        </span>
      </div>
    </div>
  );
};

export default NotFoundPage;
