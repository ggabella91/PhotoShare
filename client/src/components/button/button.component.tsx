import React from 'react';

import './button.styles.scss';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className: string;
  onClick: React.FormEventHandler;
  children?: any;
}

const Button: React.FC<ButtonProps> = ({ children, ...otherProps }) => (
  <button {...otherProps}>{children}</button>
);

export default Button;
