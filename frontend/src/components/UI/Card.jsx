// src/components/UI/Card.jsx
import React, { forwardRef } from 'react';
import { ChevronRight, ExternalLink, MoreVertical } from 'lucide-react';

const Card = forwardRef(({
  children,
  variant = 'default',
  hover = true,
  clickable = false,
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  className = '',
  onClick,
  ...props
}, ref) => {
  
  const baseClasses = `
    bg-white border border-gray-200 transition-all duration-200
    ${clickable || onClick ? 'cursor-pointer' : ''}
  `;

  const variants = {
    default: 'border-gray-200',
    success: 'border-green-200 bg-green-50/50',
    warning: 'border-amber-200 bg-amber-50/50',
    danger: 'border-red-200 bg-red-50/50',
    info: 'border-blue-200 bg-blue-50/50',
    primary: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
  };

  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const roundeds = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl'
  };

  const hoverEffects = hover ? 'hover:scale-[1.02] hover:-translate-y-1' : '';

  const cardClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${shadows[shadow]}
    ${paddings[padding]}
    ${roundeds[rounded]}
    ${hoverEffects}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      ref={ref}
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header Component
export const CardHeader = ({ 
  title, 
  subtitle, 
  action, 
  icon,
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="p-2 bg-gray-100 rounded-lg">
            {React.cloneElement(icon, { size: 20 })}
          </div>
        )}
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

// Card Body Component
export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`text-gray-600 ${className}`}>
      {children}
    </div>
  );
};

// Card Footer Component
export const CardFooter = ({ 
  children, 
  divided = false, 
  className = '' 
}) => {
  return (
    <div className={`
      mt-4 pt-4 
      ${divided ? 'border-t border-gray-200' : ''} 
      ${className}
    `}>
      {children}
    </div>
  );
};

// Stats Card Component
export const StatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  trend = null,
  className = ''
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100'
  };

  return (
    <Card className={`relative overflow-hidden ${className}`} hover>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${changeColors[changeType]}
              `}>
                {change}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            {React.cloneElement(icon, { size: 24, className: 'text-white' })}
          </div>
        )}
      </div>
      
      {/* Trend Line */}
      {trend && (
        <div className="mt-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${trend}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-full -mr-10 -mt-10" />
    </Card>
  );
};

// Feature Card Component
export const FeatureCard = ({
  title,
  description,
  icon,
  action,
  badge,
  image,
  className = ''
}) => {
  return (
    <Card className={`group ${className}`} hover clickable>
      {image && (
        <div className="relative mb-4 -mx-4 -mt-4">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {badge && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                {badge}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="flex-shrink-0 p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
            {React.cloneElement(icon, { size: 20, className: 'text-white' })}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
              {title}
            </h3>
            {!image && badge && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {badge}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">{description}</p>
          
          {action && (
            <div className="flex items-center justify-between">
              {action}
              <ChevronRight size={16} className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Product Card Component
export const ProductCard = ({
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  badge,
  onAddToCart,
  onQuickView,
  className = ''
}) => {
  return (
    <Card className={`group ${className}`} hover>
      <div className="relative mb-4 -mx-4 -mt-4">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
        />
        
        {badge && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
              {badge}
            </span>
          </div>
        )}
        
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onQuickView}
            className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <ExternalLink size={16} className="text-gray-700" />
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
        
        {rating && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">({reviews})</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">₹{price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
            )}
          </div>
          
          <button
            onClick={onAddToCart}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Card>
  );
};

// Notification Card Component
export const NotificationCard = ({
  title,
  message,
  type = 'info',
  timestamp,
  read = false,
  onMarkAsRead,
  onDelete,
  className = ''
}) => {
  const typeStyles = {
    info: 'border-blue-200 bg-blue-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-amber-200 bg-amber-50',
    error: 'border-red-200 bg-red-50'
  };

  const typeIcons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <Card 
      variant={type}
      className={`${!read ? 'border-l-4 border-l-blue-500' : ''} ${className}`}
      padding="md"
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg">{typeIcons[type]}</span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
            <div className="flex items-center space-x-1">
              {!read && (
                <button
                  onClick={onMarkAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark as read
                </button>
              )}
              <button
                onClick={onDelete}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <MoreVertical size={14} />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{message}</p>
          
          <span className="text-xs text-gray-400">{timestamp}</span>
        </div>
      </div>
    </Card>
  );
};

export default Card;