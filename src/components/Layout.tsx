import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './Navigation';
import { motion, AnimatePresence } from 'motion/react';

export const Layout = () => {
  const location = useLocation();
  const hideNav = ['/', '/login', '/register', '/onboarding', '/sos'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-brand-ivory pb-24">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="mx-auto max-w-md px-4 pt-8"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      {!hideNav && <BottomNav />}
    </div>
  );
};
