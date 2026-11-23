import { motion, useReducedMotion } from 'framer-motion';
import { MOTION } from '../../theme/tokens';

export default function PageTransition({ children, className = '' }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={MOTION.pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
