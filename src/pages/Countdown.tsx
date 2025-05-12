import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Pencil, Trash2, Save, X, Plus, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import ConfirmDialog from '../components/ConfirmDialog';

const Countdown: React.FC = () => {
  const { countdownEvents, addCountdownEvent, updateCountdownEvent, deleteCountdownEvent } = useData();
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddEvent = () => {
    if (newTitle.trim() && newDate) {
      addCountdownEvent(newTitle, newDate);
      setNewTitle('');
      setNewDate('');
      setShowForm(false);
    }
  };

  const handleEditClick = (id: string, title: string, date: string) => {
    setEditingId(id);
    setEditTitle(title);
    setEditDate(date);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim() && editDate) {
      updateCountdownEvent(editingId, editTitle, editDate);
      setEditingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const calculateTimeLeft = (dateString: string) => {
    const targetDate = new Date(dateString);
    const currentDate = now;
    
    if (targetDate <= currentDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const days = differenceInDays(targetDate, currentDate);
    const hours = differenceInHours(targetDate, currentDate) % 24;
    const minutes = differenceInMinutes(targetDate, currentDate) % 60;
    const seconds = differenceInSeconds(targetDate, currentDate) % 60;
    
    return { days, hours, minutes, seconds };
  };

  return (
    <div className="page-container">
      <PageHeader 
        title="Special Countdown" 
        subtitle="Counting down to your important moments" 
        icon={<Clock size={24} />} 
      />
      
      {/* Toggle Add Form */}
      {!showForm && (
        <div className="mb-6 flex justify-center">
          <ActionButton 
            onClick={() => setShowForm(true)}
            className="px-6"
          >
            <Plus size={18} />
            Add New Countdown
          </ActionButton>
        </div>
      )}
      
      {/* Add new countdown form */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            className="mb-8 bg-white rounded-xl shadow-md p-5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl text-primary-700">Add a New Countdown</h2>
              <button 
                className="text-gray-400 hover:text-gray-600" 
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What are you counting down to?"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="input w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <ActionButton 
                  variant="secondary" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </ActionButton>
                <ActionButton 
                  onClick={handleAddEvent}
                >
                  <Plus size={18} />
                  Add Countdown
                </ActionButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Countdowns */}
      <div className="space-y-8">
        {countdownEvents.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">No countdowns yet. Add your first countdown!</p>
        ) : (
          <AnimatePresence>
            {countdownEvents.map((event, index) => {
              const timeLeft = calculateTimeLeft(event.date);
              return (
                <motion.div
                  key={event.id}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {editingId === event.id ? (
                    <motion.div className="card">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Title
                          </label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="input w-full"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <ActionButton 
                            variant="secondary" 
                            onClick={() => setEditingId(null)}
                          >
                            <X size={16} />
                            Cancel
                          </ActionButton>
                          <ActionButton 
                            onClick={handleSaveEdit}
                          >
                            <Save size={16} />
                            Save
                          </ActionButton>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="bg-gradient-to-r from-primary-800 to-primary-600 text-white rounded-xl shadow-lg p-6 overflow-hidden relative"
                      whileHover={{ y: -5, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-serif text-2xl font-bold text-white">{event.title}</h3>
                            <p className="text-primary-200 mt-1">
                              <Calendar size={16} className="inline mr-1" />
                              {formatDate(event.date)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <ActionButton 
                              variant="secondary" 
                              onClick={() => handleEditClick(event.id, event.title, event.date)}
                              className="px-2 py-1 bg-white/20 border-transparent hover:bg-white/30"
                            >
                              <Pencil size={16} />
                            </ActionButton>
                            <ActionButton 
                              variant="danger" 
                              onClick={() => setDeleteId(event.id)}
                              className="px-2 py-1 bg-accent-500/80 border-transparent hover:bg-accent-600"
                            >
                              <Trash2 size={16} />
                            </ActionButton>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 mt-6">
                          {[
                            { label: 'DAYS', value: timeLeft.days },
                            { label: 'HOURS', value: timeLeft.hours },
                            { label: 'MINUTES', value: timeLeft.minutes },
                            { label: 'SECONDS', value: timeLeft.seconds }
                          ].map((item, i) => (
                            <div key={i} className="bg-white/10 rounded-lg p-3 text-center">
                              <div className="text-2xl md:text-3xl font-bold">{item.value}</div>
                              <div className="text-xs text-primary-200">{item.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteCountdownEvent(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Countdown"
        message="Are you sure you want to delete this countdown? This action cannot be undone."
      />
    </div>
  );
};

export default Countdown;