import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, icon, className = '', ...props }, ref) => {
    const wrapperClass = `skillogram-input-wrapper ${fullWidth ? 'input-full' : ''} ${error ? 'input-error' : ''} ${className}`;

    return (
      <div className={wrapperClass}>
        {label && <label className="input-label">{label}</label>}
        <div className="input-field-container">
          {icon && <div className="input-icon">{icon}</div>}
          <input
            ref={ref}
            className={`skillogram-input ${icon ? 'has-icon' : ''}`}
            {...props}
          />
        </div>
        {error && <span className="input-error-msg">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
