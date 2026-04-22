import { forwardRef } from 'react';

const variants = {
  primary: 'bg-white text-text-dark hover:bg-white/90',
  outline: 'border border-white/30 text-white hover:bg-white/10',
  ghost: 'text-white hover:bg-white/10',
  green: 'bg-accent-green text-white hover:bg-accent-green/90',
  lime: 'bg-accent-lime text-text-dark hover:bg-accent-lime/90',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const PillButton = forwardRef(function PillButton(
  { variant = 'primary', size = 'md', as: Tag = 'button', className = '', children, ...rest },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-pill font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export default PillButton;
