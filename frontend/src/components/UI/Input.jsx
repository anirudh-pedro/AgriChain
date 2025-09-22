// src/components/UI/Input.jsx
import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, Search, Calendar, DollarSign } from 'lucide-react';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  helper,
  className = '',
  size = 'md',
  variant = 'default',
  ...props
}, ref) => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base'
  };

  const variants = {
    default: 'border-gray-300 focus:border-green-500 focus:ring-green-500',
    filled: 'bg-gray-50 border-gray-200 focus:bg-white focus:border-green-500 focus:ring-green-500',
    outlined: 'border-2 border-gray-300 focus:border-green-500 focus:ring-0'
  };

  const baseClasses = `
    w-full rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
  `;

  const getInputClasses = () => {
    let classes = `${baseClasses} ${sizes[size]} ${variants[variant]}`;
    
    if (error) {
      classes += ' border-red-500 focus:border-red-500 focus:ring-red-500';
    } else if (success) {
      classes += ' border-green-500 focus:border-green-500 focus:ring-green-500';
    }
    
    if (icon || type === 'password') {
      if (iconPosition === 'left' || (icon && iconPosition === 'left')) {
        classes += ' pl-11';
      }
      if (iconPosition === 'right' || type === 'password') {
        classes += ' pr-11';
      }
    }
    
    return `${classes} ${className}`.trim().replace(/\s+/g, ' ');
  };

  const renderIcon = () => {
    if (type === 'password') {
      return (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      );
    }
    
    if (icon) {
      const iconElement = React.cloneElement(icon, { 
        size: 18,
        className: `text-gray-400 ${focused ? 'text-green-500' : ''} transition-colors`
      });
      
      if (iconPosition === 'left') {
        return (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {iconElement}
          </div>
        );
      } else {
        return (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {iconElement}
          </div>
        );
      }
    }
    
    return null;
  };

  const renderStatusIcon = () => {
    if (error) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <AlertCircle size={18} className="text-red-500" />
        </div>
      );
    }
    
    if (success) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <CheckCircle size={18} className="text-green-500" />
        </div>
      );
    }
    
    return null;
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={getInputClasses()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        
        {renderIcon()}
        {!icon && renderStatusIcon()}
      </div>
      
      {(helper || error || success) && (
        <div className="text-sm">
          {error && (
            <p className="text-red-600 flex items-center space-x-1">
              <AlertCircle size={14} />
              <span>{error}</span>
            </p>
          )}
          {success && !error && (
            <p className="text-green-600 flex items-center space-x-1">
              <CheckCircle size={14} />
              <span>{success}</span>
            </p>
          )}
          {helper && !error && !success && (
            <p className="text-gray-500">{helper}</p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Specialized Input Components
export const SearchInput = forwardRef((props, ref) => {
  return (
    <Input
      ref={ref}
      icon={<Search />}
      placeholder="Search..."
      {...props}
    />
  );
});

export const CurrencyInput = forwardRef((props, ref) => {
  return (
    <Input
      ref={ref}
      type="number"
      icon={<DollarSign />}
      iconPosition="left"
      placeholder="0.00"
      {...props}
    />
  );
});

export const DateInput = forwardRef((props, ref) => {
  return (
    <Input
      ref={ref}
      type="date"
      icon={<Calendar />}
      iconPosition="right"
      {...props}
    />
  );
});

// Textarea Component
export const Textarea = forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  helper,
  rows = 4,
  resize = true,
  className = '',
  ...props
}, ref) => {
  
  const baseClasses = `
    w-full px-4 py-3 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:border-green-500
    transition-all duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
    ${resize ? 'resize-y' : 'resize-none'}
  `;

  const getTextareaClasses = () => {
    let classes = baseClasses;
    
    if (error) {
      classes += ' border-red-500 focus:border-red-500 focus:ring-red-500';
    } else if (success) {
      classes += ' border-green-500 focus:border-green-500 focus:ring-green-500';
    }
    
    return `${classes} ${className}`.trim().replace(/\s+/g, ' ');
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={getTextareaClasses()}
          {...props}
        />
      </div>
      
      {(helper || error || success) && (
        <div className="text-sm">
          {error && (
            <p className="text-red-600 flex items-center space-x-1">
              <AlertCircle size={14} />
              <span>{error}</span>
            </p>
          )}
          {success && !error && (
            <p className="text-green-600 flex items-center space-x-1">
              <CheckCircle size={14} />
              <span>{success}</span>
            </p>
          )}
          {helper && !error && !success && (
            <p className="text-gray-500">{helper}</p>
          )}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select Component
export const Select = forwardRef(({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  error,
  success,
  disabled = false,
  required = false,
  helper,
  className = '',
  size = 'md',
  ...props
}, ref) => {
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base'
  };

  const baseClasses = `
    w-full border border-gray-300 rounded-lg bg-white
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:border-green-500
    transition-all duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
  `;

  const getSelectClasses = () => {
    let classes = `${baseClasses} ${sizes[size]}`;
    
    if (error) {
      classes += ' border-red-500 focus:border-red-500 focus:ring-red-500';
    } else if (success) {
      classes += ' border-green-500 focus:border-green-500 focus:ring-green-500';
    }
    
    return `${classes} ${className}`.trim().replace(/\s+/g, ' ');
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={getSelectClasses()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {(helper || error || success) && (
        <div className="text-sm">
          {error && (
            <p className="text-red-600 flex items-center space-x-1">
              <AlertCircle size={14} />
              <span>{error}</span>
            </p>
          )}
          {success && !error && (
            <p className="text-green-600 flex items-center space-x-1">
              <CheckCircle size={14} />
              <span>{success}</span>
            </p>
          )}
          {helper && !error && !success && (
            <p className="text-gray-500">{helper}</p>
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Checkbox Component
export const Checkbox = forwardRef(({
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  error,
  helper,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`
              ${sizes[size]} border-2 border-gray-300 rounded
              text-green-600 focus:ring-green-500 focus:ring-2 focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        
        {label && (
          <label className="flex-1 text-sm text-gray-700 cursor-pointer">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      
      {(helper || error) && (
        <div className="text-sm ml-8">
          {error && (
            <p className="text-red-600 flex items-center space-x-1">
              <AlertCircle size={14} />
              <span>{error}</span>
            </p>
          )}
          {helper && !error && (
            <p className="text-gray-500">{helper}</p>
          )}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// Radio Component
export const Radio = forwardRef(({
  name,
  options = [],
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  helper,
  direction = 'vertical',
  className = '',
  ...props
}, ref) => {
  
  const directionClasses = {
    vertical: 'space-y-3',
    horizontal: 'flex space-x-6'
  };

  return (
    <div className="space-y-2">
      <div className={`${directionClasses[direction]} ${className}`}>
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              ref={index === 0 ? ref : null}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled || option.disabled}
              required={required}
              className={`
                w-4 h-4 border-2 border-gray-300
                text-green-600 focus:ring-green-500 focus:ring-2 focus:ring-opacity-50
                disabled:opacity-50 disabled:cursor-not-allowed
                ${error ? 'border-red-500' : ''}
              `}
              {...props}
            />
            <label className="text-sm text-gray-700 cursor-pointer">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {(helper || error) && (
        <div className="text-sm">
          {error && (
            <p className="text-red-600 flex items-center space-x-1">
              <AlertCircle size={14} />
              <span>{error}</span>
            </p>
          )}
          {helper && !error && (
            <p className="text-gray-500">{helper}</p>
          )}
        </div>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Input;