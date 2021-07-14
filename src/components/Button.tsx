import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

type ButtonsProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined ?: boolean
};

export function Button ({ isOutlined = false, ...props }: ButtonsProps) {
  return (
    <button 
      className={`button ${isOutlined ? 'outlined' : ''}`}
      {...props} 
    />
  )
}