import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  icon: Icon,
  actions,
  hover = false,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : '';
  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {(title || subtitle || Icon || actions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {Icon && <Icon className="h-6 w-6 text-gray-600" />}
              <div>
                {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
              </div>
            </div>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
