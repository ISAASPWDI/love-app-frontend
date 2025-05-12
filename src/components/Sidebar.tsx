import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Image, Baseline as Timeline, Clock, Star, BrainCircuit, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Love Notes', icon: Heart, path: '/' },
    { name: 'Photo Memories', icon: Image, path: '/memories' },
    { name: 'Our Timeline', icon: Timeline, path: '/timeline' },
    { name: 'Special Countdown', icon: Clock, path: '/countdown' },
    { name: 'Compliments', icon: Star, path: '/compliments' },
    { name: 'Love Quiz', icon: BrainCircuit, path: '/quiz' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary-600 text-white lg:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black lg:hidden z-40"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`bg-gradient-to-b from-primary-700 to-primary-800 text-white w-64 min-h-screen fixed top-0 left-0 z-40 lg:sticky lg:z-0 overflow-y-auto`}
        animate={{ x: isOpen ? 0 : -256 }}
        initial={{ x: -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ position: 'sticky', top: 0, height: '100vh' }}
      >
        <div className="p-6 space-y-8">
          <div className="text-center p-4">
            <h1 className="font-serif text-2xl font-bold">For You</h1>
            <p className="text-primary-200 mt-2 italic">With all my love</p>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'text-primary-100 hover:bg-primary-600/50'
                  }`
                }
              >
                <item.icon size={20} className="mr-3" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="pt-6 mt-6 border-t border-primary-600 text-center">
            <p className="text-primary-300 text-sm">Made with ❤️ for you</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;