import React from 'react';

import './button.styles.scss';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className: string;
  onClick: React.FormEventHandler;
  disabled?: boolean;
  children?: any;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  ...otherProps
}) => (
  <button disabled={disabled} {...otherProps}>
    {children}
  </button>
);

export default Button;
