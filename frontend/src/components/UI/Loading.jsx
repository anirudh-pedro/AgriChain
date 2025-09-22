// src/components/UI/Loading.jsx
import React from 'react';

// Basic Spinner Component
export const Spinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colors = {
    primary: 'border-green-500',
    secondary: 'border-gray-500',
    white: 'border-white',
    blue: 'border-blue-500',
    red: 'border-red-500'
  };

  return (
    <div
      className={`
        ${sizes[size]} 
        border-2 ${colors[color]} border-t-transparent 
        rounded-full animate-spin 
        ${className}
      `}
      {...props}
    />
  );
};

// Dots Loader
export const DotsLoader = ({ 
  size = 'md',
  color = 'primary',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const colors = {
    primary: 'bg-green-500',
    secondary: 'bg-gray-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500'
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${sizes[size]} ${colors[color]} rounded-full 
            animate-bounce
          `}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

// Pulse Loader
export const PulseLoader = ({ 
  size = 'md',
  color = 'primary',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const colors = {
    primary: 'bg-green-500',
    secondary: 'bg-gray-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500'
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <div className={`absolute inset-0 ${colors[color]} rounded-full animate-ping opacity-75`} />
      <div className={`absolute inset-2 ${colors[color]} rounded-full`} />
    </div>
  );
};

// Progress Bar
export const ProgressBar = ({ 
  progress = 0,
  size = 'md',
  color = 'primary',
  showPercentage = false,
  label,
  animated = true,
  className = ''
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colors = {
    primary: 'bg-green-500',
    secondary: 'bg-gray-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-gray-700">{label}</span>}
          {showPercentage && <span className="text-gray-500">{clampedProgress}%</span>}
        </div>
      )}
      
      <div className={`w-full ${sizes[size]} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`
            ${sizes[size]} ${colors[color]} rounded-full transition-all duration-500 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

// Skeleton Loader Components
export const SkeletonText = ({ 
  lines = 1,
  className = '',
  animated = true 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`
            h-4 bg-gray-200 rounded
            ${animated ? 'animate-pulse' : ''}
            ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}
          `}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ 
  className = '',
  animated = true,
  showAvatar = false,
  showImage = false 
}) => {
  return (
    <div className={`p-6 bg-white rounded-lg border border-gray-200 ${className}`}>
      {showImage && (
        <div className={`
          w-full h-48 bg-gray-200 rounded-lg mb-4
          ${animated ? 'animate-pulse' : ''}
        `} />
      )}
      
      <div className="space-y-4">
        {showAvatar && (
          <div className="flex items-center space-x-3">
            <div className={`
              w-10 h-10 bg-gray-200 rounded-full
              ${animated ? 'animate-pulse' : ''}
            `} />
            <div className="space-y-2 flex-1">
              <div className={`
                h-4 bg-gray-200 rounded w-1/4
                ${animated ? 'animate-pulse' : ''}
              `} />
              <div className={`
                h-3 bg-gray-200 rounded w-1/6
                ${animated ? 'animate-pulse' : ''}
              `} />
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <div className={`
            h-6 bg-gray-200 rounded w-3/4
            ${animated ? 'animate-pulse' : ''}
          `} />
          <div className={`
            h-4 bg-gray-200 rounded
            ${animated ? 'animate-pulse' : ''}
          `} />
          <div className={`
            h-4 bg-gray-200 rounded w-5/6
            ${animated ? 'animate-pulse' : ''}
          `} />
        </div>
        
        <div className="flex space-x-2 pt-2">
          <div className={`
            h-8 bg-gray-200 rounded w-20
            ${animated ? 'animate-pulse' : ''}
          `} />
          <div className={`
            h-8 bg-gray-200 rounded w-16
            ${animated ? 'animate-pulse' : ''}
          `} />
        </div>
      </div>
    </div>
  );
};

export const SkeletonTable = ({ 
  rows = 5,
  columns = 4,
  className = '',
  animated = true 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className={`
              h-6 bg-gray-200 rounded
              ${animated ? 'animate-pulse' : ''}
            `}
          />
        ))}
      </div>
      
      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`
                  h-4 bg-gray-200 rounded
                  ${animated ? 'animate-pulse' : ''}
                `}
                style={{
                  animationDelay: `${(rowIndex * columns + colIndex) * 0.1}s`
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading Overlay
export const LoadingOverlay = ({ 
  loading = true,
  children,
  spinner = 'spinner',
  message = 'Loading...',
  className = ''
}) => {
  if (!loading) return children;

  const renderLoader = () => {
    switch (spinner) {
      case 'dots':
        return <DotsLoader size="lg" />;
      case 'pulse':
        return <PulseLoader size="lg" />;
      default:
        return <Spinner size="lg" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <div className="text-center">
          {renderLoader()}
          {message && (
            <p className="mt-4 text-gray-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Page Loading Component
export const PageLoader = ({ 
  message = 'Loading...',
  spinner = 'spinner',
  fullScreen = true 
}) => {
  const renderLoader = () => {
    switch (spinner) {
      case 'dots':
        return <DotsLoader size="lg" />;
      case 'pulse':
        return <PulseLoader size="lg" />;
      default:
        return <Spinner size="xl" />;
    }
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 bg-white z-50'
    : 'w-full h-64';

  return (
    <div className={`${containerClass} flex items-center justify-center`}>
      <div className="text-center">
        {renderLoader()}
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Transition Components
export const FadeIn = ({ 
  children, 
  delay = 0,
  duration = 300,
  className = '' 
}) => {
  return (
    <div
      className={`animate-in fade-in ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

export const SlideIn = ({ 
  children, 
  direction = 'up',
  delay = 0,
  duration = 300,
  className = '' 
}) => {
  const directions = {
    up: 'slide-in-from-bottom',
    down: 'slide-in-from-top',
    left: 'slide-in-from-right',
    right: 'slide-in-from-left'
  };

  return (
    <div
      className={`animate-in ${directions[direction]} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

export const ScaleIn = ({ 
  children, 
  delay = 0,
  duration = 300,
  className = '' 
}) => {
  return (
    <div
      className={`animate-in zoom-in ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

// Staggered Animation Container
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 100,
  className = '' 
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            style: {
              ...child.props.style,
              animationDelay: `${index * staggerDelay}ms`
            },
            className: `${child.props.className || ''} animate-in fade-in slide-in-from-bottom`
          });
        }
        return child;
      })}
    </div>
  );
};

export default Spinner;