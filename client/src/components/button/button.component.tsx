import React from 'react';

import './button.styles.scss';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className: string;
  onClick: React.FormEventHandler | ((() => void) | undefined);
  disabled?: boolean;
  children?: any;
  dataTestId?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  dataTestId,
  ...otherProps
}) => (
  <button disabled={disabled} data-testid={dataTestId} {...otherProps}>
    {children}
  </button>
);

export default Button;
