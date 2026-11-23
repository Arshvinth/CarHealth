import { motion } from 'framer-motion';

const SIZES = {
  sm: 'px-3.5 py-2 text-xs gap-1.5 rounded-lg',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3.5 text-sm font-semibold gap-2.5 rounded-xl',
};

export default function SecondaryButton({
  children,
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...rest
}) {
  return (
    <motion.button
      type={type}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center justify-center font-medium text-white bg-[#172338]/70 hover:bg-[#1C2B45] border border-[#263449] hover:border-[#3B82F6]/50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] disabled:cursor-not-allowed disabled:opacity-50 ${SIZES[size] || SIZES.md} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-[#22D3EE]" />}
      <span>{children}</span>
      {IconRight && <IconRight className="h-4 w-4 shrink-0 text-[#94A3B8]" />}
    </motion.button>
  );
}
