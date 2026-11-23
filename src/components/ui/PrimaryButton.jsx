import { motion } from 'framer-motion';

const SIZES = {
  sm: 'px-3.5 py-2 text-xs gap-1.5 rounded-lg',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3.5 text-sm font-semibold gap-2.5 rounded-xl',
};

export default function PrimaryButton({
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
      className={`inline-flex cursor-pointer items-center justify-center font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] shadow-[0_6px_22px_rgba(59,130,246,0.32)] hover:shadow-[0_10px_28px_rgba(59,130,246,0.45)] border border-[#60A5FA]/30 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] disabled:cursor-not-allowed disabled:opacity-50 ${SIZES[size] || SIZES.md} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span>{children}</span>
      {IconRight && <IconRight className="h-4 w-4 shrink-0" />}
    </motion.button>
  );
}
