import React from 'react';

import './footer.styles.scss';

const Footer: React.FC = () => (
  <div>
    <div className='footer'>
      <span>Created by Giuliano Gabella</span>
      <a
        className='favicon-link'
        href='https://icons8.com/icon/Z6RmPnIUvybQ/photo-gallery'
      >
        Photo Gallery icon by Icons8
      </a>
    </div>
  </div>
);

export default Footer;
