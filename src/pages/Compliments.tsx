import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, Plus, X, Heart, Shuffle } from 'lucide-react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import ConfirmDialog from '../components/ConfirmDialog';

const Compliments: React.FC = () => {
  const { compliments, addCompliment, toggleFavoriteCompliment, deleteCompliment } = useData();
  const [newCompliment, setNewCompliment] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [randomCompliment, setRandomCompliment] = useState<string | null>(null);
  const [showRandomAnimation, setShowRandomAnimation] = useState(false);

  const handleAddCompliment = () => {
    if (newCompliment.trim()) {
      addCompliment(newCompliment);
      setNewCompliment('');
    }
  };

  const getRandomCompliment = () => {
    if (compliments.length === 0) return;
    
    setShowRandomAnimation(true);
    
    // Simulate "shuffling" animation
    let count = 0;
    const maxIterations = 10;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * compliments.length);
      setRandomCompliment(compliments[randomIndex].text);
      count++;
      
      if (count >= maxIterations) {
        clearInterval(interval);
        setTimeout(() => {
          setShowRandomAnimation(false);
        }, 500);
      }
    }, 100);
  };

  return (
    <div className="page-container">
      <PageHeader 
        title="Compliments" 
        subtitle="Sweet things to say and remember" 
        icon={<Star size={24} />} 
      />
      
      {/* Random compliment generator */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-md p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-serif text-xl font-bold mb-4">Random Compliment Generator</h2>
        
        {randomCompliment ? (
          <motion.div 
            className="bg-white/10 rounded-lg p-6 mb-4"
            animate={{ 
              scale: showRandomAnimation ? [1, 1.05, 1] : 1,
              opacity: showRandomAnimation ? [0.7, 1] : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xl font-serif italic">&ldquo;{randomCompliment}&rdquo;</p>
          </motion.div>
        ) : (
          <div className="bg-white/10 rounded-lg p-8 mb-4 flex items-center justify-center">
            <p className="text-primary-200 italic">Click the button below to generate a random compliment</p>
          </div>
        )}
        
        <ActionButton 
          onClick={getRandomCompliment}
          className="bg-white text-primary-700 hover:bg-primary-50"
        >
          <Shuffle size={18} />
          Generate Random Compliment
        </ActionButton>
      </motion.div>
      
      {/* Add new compliment form */}
      <motion.div 
        className="mb-8 bg-white rounded-xl shadow-md p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-serif text-xl text-primary-700 mb-4">Add a New Compliment</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={newCompliment}
            onChange={(e) => setNewCompliment(e.target.value)}
            placeholder="Write a sweet compliment..."
            className="input w-full"
          />
          <div className="flex justify-end">
            <ActionButton onClick={handleAddCompliment}>
              <Plus size={18} />
              Add Compliment
            </ActionButton>
          </div>
        </div>
      </motion.div>
      
      {/* Compliments list */}
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-xl text-primary-700">Your Compliments</h2>
          <div className="text-sm text-gray-500">
            {compliments.filter(c => c.favorite).length} favorites
          </div>
        </div>
        
        {compliments.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">No compliments yet. Add your first compliment above!</p>
        ) : (
          <AnimatePresence>
            {compliments.map((compliment, index) => (
              <motion.div
                key={compliment.id}
                className={`card relative ${compliment.favorite ? 'bg-primary-50' : 'bg-white'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <div className="flex justify-between items-start">
                  <p className="text-primary-800 pr-8">{compliment.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavoriteCompliment(compliment.id)}
                      className={`p-1 rounded-full transition-colors ${
                        compliment.favorite 
                          ? 'text-accent-500 hover:text-accent-600' 
                          : 'text-gray-300 hover:text-accent-400'
                      }`}
                    >
                      <Heart size={20} fill={compliment.favorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => setDeleteId(compliment.id)}
                      className="p-1 text-gray-300 hover:text-accent-500 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteCompliment(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Compliment"
        message="Are you sure you want to delete this compliment? This action cannot be undone."
      />
    </div>
  );
};

export default Compliments;