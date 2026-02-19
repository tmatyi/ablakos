import React from 'react';
import { motion } from 'framer-motion';

const PremiumButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'relative overflow-hidden font-medium transition-all duration-300';
  
  const variants = {
    primary: 'bg-brand-gradient text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg',
    accent: 'bg-accent-gradient text-white shadow-lg hover:shadow-xl',
    glass: 'backdrop-blur-md bg-white/20 dark:bg-gray-800/20 text-gray-800 dark:text-gray-200 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-2xl',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default PremiumButton;
