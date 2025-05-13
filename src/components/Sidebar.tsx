import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ClipboardList, Image, Clock, Star, BrainCircuit, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  // Por defecto, sidebar abierto en pantallas grandes, cerrado en móviles
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  
  // Detectar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      // En pantallas grandes (>=1024px) el sidebar está abierto por defecto
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Notas', icon: ClipboardList, path: '/' },
    { name: 'Recuerdos', icon: Image, path: '/memories' },
    { name: 'Línea de tiempo', icon: Clock, path: '/timeline' },
    // { name: 'Special Countdown', icon: Clock, path: '/countdown' },
    { name: 'Cumplidos', icon: Star, path: '/compliments' },
    { name: 'Prueba', icon: BrainCircuit, path: '/quiz' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button - solo visible en móviles */}
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary-600 text-white lg:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop cuando el sidebar está abierto (visible solo en móviles) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-30 lg:bg-transparent lg:pointer-events-none"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar con diferentes comportamientos para móvil y escritorio */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.aside
            className="bg-gradient-to-b from-primary-700 to-primary-800 text-white w-64 min-h-screen fixed lg:sticky top-0 left-0 z-40 overflow-y-auto shadow-lg"
            initial={{ x: window.innerWidth >= 1024 ? 0 : -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                    onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
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
                <p className="text-primary-300 text-sm mb-6">Hecho especialmente para ti :3</p>
                <p className='text-primary-300 text-sm'>© Todos los derechos reservados xd</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;