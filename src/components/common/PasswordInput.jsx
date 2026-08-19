import { useState } from 'react';

export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function validatePasswordStrength(password = '') {
  return {
    hasMinLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    isValid: STRONG_PASSWORD_REGEX.test(password),
  };
}

export default function PasswordInput({
  value = '',
  onChange,
  placeholder = 'Password',
  required = false,
  name = 'password',
  id,
  autoComplete,
  showRequirements = false,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = validatePasswordStrength(value);

  return (
    <div className="password-field-container">
      <div className="password-input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          name={name}
          id={id}
          autoComplete={autoComplete}
          disabled={disabled}
        />
        <button
          type="button"
          className="password-eye-btn"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex="-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {showRequirements && value.length > 0 && (
        <div className="password-checklist">
          <span className={strength.hasMinLength ? 'met' : 'unmet'}>
            {strength.hasMinLength ? '✓' : '○'} 8+ characters
          </span>
          <span className={strength.hasUpper ? 'met' : 'unmet'}>
            {strength.hasUpper ? '✓' : '○'} Uppercase letter (A-Z)
          </span>
          <span className={strength.hasLower ? 'met' : 'unmet'}>
            {strength.hasLower ? '✓' : '○'} Lowercase letter (a-z)
          </span>
          <span className={strength.hasNumber ? 'met' : 'unmet'}>
            {strength.hasNumber ? '✓' : '○'} Number (0-9)
          </span>
          <span className={strength.hasSpecial ? 'met' : 'unmet'}>
            {strength.hasSpecial ? '✓' : '○'} Special symbol (!@#$...)
          </span>
        </div>
      )}
    </div>
  );
}
