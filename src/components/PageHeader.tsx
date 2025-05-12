import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <motion.div 
      className="mb-8 border-b border-primary-100 pb-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="text-primary-600">
            {icon}
          </div>
        )}
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary-800">{title}</h1>
          {subtitle && <p className="text-primary-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;