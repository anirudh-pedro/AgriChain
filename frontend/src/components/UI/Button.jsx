// src/components/UI/Button.jsx
import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden
    disabled:cursor-not-allowed disabled:opacity-50
    ${fullWidth ? 'w-full' : ''}
  `.trim().replace(/\s+/g, ' ');

  const variants = {
    primary: `
      bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800
      text-white shadow-lg hover:shadow-xl focus:ring-green-500
      transform hover:scale-105 active:scale-95
    `,
    secondary: `
      bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50
      text-gray-700 shadow-sm hover:shadow-md focus:ring-gray-500
      transform hover:scale-105 active:scale-95
    `,
    success: `
      bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700
      text-white shadow-lg hover:shadow-xl focus:ring-emerald-500
      transform hover:scale-105 active:scale-95
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
      text-white shadow-lg hover:shadow-xl focus:ring-red-500
      transform hover:scale-105 active:scale-95
    `,
    warning: `
      bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700
      text-white shadow-lg hover:shadow-xl focus:ring-amber-500
      transform hover:scale-105 active:scale-95
    `,
    info: `
      bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
      text-white shadow-lg hover:shadow-xl focus:ring-blue-500
      transform hover:scale-105 active:scale-95
    `,
    outline: `
      border-2 border-green-600 hover:border-green-700 hover:bg-green-50
      text-green-600 hover:text-green-700 focus:ring-green-500
      transform hover:scale-105 active:scale-95
    `,
    ghost: `
      text-gray-600 hover:text-gray-800 hover:bg-gray-100
      focus:ring-gray-500 transform hover:scale-105 active:scale-95
    `,
    link: `
      text-green-600 hover:text-green-700 underline-offset-4 hover:underline
      focus:ring-green-500 p-0 h-auto
    `
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24
  };

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const iconSize = iconSizes[size];
  const isDisabled = disabled || loading;

  const renderIcon = (iconComponent) => {
    if (loading && iconPosition === 'left') {
      return <Loader2 size={iconSize} className="animate-spin" />;
    }
    if (iconComponent) {
      return React.cloneElement(iconComponent, { size: iconSize });
    }
    return null;
  };

  const renderContent = () => {
    const leftIcon = iconPosition === 'left' ? renderIcon(icon) : null;
    const rightIcon = iconPosition === 'right' ? renderIcon(icon) : null;
    
    return (
      <>
        {leftIcon && <span className={children ? 'mr-2' : ''}>{leftIcon}</span>}
        {children && <span>{children}</span>}
        {rightIcon && <span className={children ? 'ml-2' : ''}>{rightIcon}</span>}
        {loading && iconPosition === 'right' && (
          <span className="ml-2">
            <Loader2 size={iconSize} className="animate-spin" />
          </span>
        )}
      </>
    );
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-current opacity-10 rounded-lg" />
      )}
      
      {/* Ripple effect */}
      <div className="absolute inset-0 bg-current opacity-0 rounded-lg transition-opacity hover:opacity-10" />
      
      {renderContent()}
    </button>
  );
});

Button.displayName = 'Button';

// Icon Button Component
export const IconButton = forwardRef(({
  icon,
  variant = 'ghost',
  size = 'md',
  rounded = true,
  tooltip = null,
  className = '',
  ...props
}, ref) => {
  
  const roundedClass = rounded ? 'rounded-full' : 'rounded-lg';
  const iconButtonClass = `${roundedClass} ${className}`;

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      icon={icon}
      className={iconButtonClass}
      title={tooltip}
      {...props}
    />
  );
});

IconButton.displayName = 'IconButton';

// Button Group Component
export const ButtonGroup = ({ children, className = '', size = 'md', variant = 'secondary' }) => {
  return (
    <div className={`inline-flex rounded-lg shadow-sm ${className}`} role="group">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;
          
          return React.cloneElement(child, {
            size: child.props.size || size,
            variant: child.props.variant || variant,
            className: `
              ${child.props.className || ''}
              ${isFirst ? 'rounded-r-none' : ''}
              ${isLast ? 'rounded-l-none' : ''}
              ${!isFirst && !isLast ? 'rounded-none' : ''}
              ${!isFirst ? 'border-l-0' : ''}
            `.trim().replace(/\s+/g, ' ')
          });
        }
        return child;
      })}
    </div>
  );
};

// Floating Action Button
export const FloatingActionButton = forwardRef(({
  icon,
  children,
  position = 'bottom-right',
  size = 'lg',
  variant = 'primary',
  className = '',
  ...props
}, ref) => {
  
  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  const fabClasses = `
    ${positions[position]}
    z-50 shadow-2xl hover:shadow-3xl
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      icon={icon}
      className={`rounded-full ${fabClasses}`}
      {...props}
    >
      {children}
    </Button>
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';

export default Button;