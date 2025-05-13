import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Baseline as TimelineIcon, Pencil, Trash2, Save, X, Plus, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import ConfirmDialog from '../components/ConfirmDialog';

const Timeline: React.FC = () => {
  const { timelineEvents, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent } = useData();
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddEvent = () => {
    if (newTitle.trim() && newDate) {
      addTimelineEvent(newTitle, newDescription, newDate);
      setNewTitle('');
      setNewDescription('');
      setNewDate('');
      setShowForm(false);
    }
  };

  const handleEditClick = (id: string, title: string, description: string, date: string) => {
    setEditingId(id);
    setEditTitle(title);
    setEditDescription(description);
    setEditDate(date);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim() && editDate) {
      updateTimelineEvent(editingId, editTitle, editDescription, editDate);
      setEditingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="page-container">
      <PageHeader 
        title="Línea de tiempo" 
        subtitle="Tener documentado experiencias xd" 
        icon={<TimelineIcon size={24} />} 
      />
      
      {/* Toggle Add Form */}
      {!showForm && (
        <div className="mb-6 flex justify-center">
          <ActionButton 
            onClick={() => setShowForm(true)}
            className="px-6"
          >
            <Plus size={18} />
            Add New Event
          </ActionButton>
        </div>
      )}
      
      {/* Add new event form */}
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
              <h2 className="font-serif text-xl text-primary-700">Add a New Event</h2>
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
                  Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What happened?"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Tell the story..."
                  className="textarea w-full h-20"
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
                  Add Event
                </ActionButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        {timelineEvents.length > 0 && (
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-300"></div>
        )}
        
        {timelineEvents.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">No events yet. Add your first event to your timeline!</p>
        ) : (
          <div className="space-y-8 relative pl-12">
            <AnimatePresence>
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white shadow-md">
                    <Calendar size={18} />
                  </div>
                  
                  {/* Content */}
                  <motion.div
                    className="card bg-gradient-to-r from-primary-50 to-white"
                    whileHover={{ y: -3 }}
                  >
                    {editingId === event.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
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
                            Description
                          </label>
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="textarea w-full h-20"
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
                    ) : (
                      <>
                        <div className="mb-4">
                          <div className="text-primary-400 text-sm mb-1">{formatDate(event.date)}</div>
                          <h3 className="font-serif text-xl font-semibold text-primary-800">{event.title}</h3>
                          <p className="text-gray-600 mt-2">{event.description}</p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <ActionButton 
                            variant="secondary" 
                            onClick={() => handleEditClick(event.id, event.title, event.description, event.date)}
                            className="px-2 py-1"
                          >
                            <Pencil size={16} />
                            Edit
                          </ActionButton>
                          <ActionButton 
                            variant="danger" 
                            onClick={() => setDeleteId(event.id)}
                            className="px-2 py-1"
                          >
                            <Trash2 size={16} />
                            Delete
                          </ActionButton>
                        </div>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteTimelineEvent(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
      />
    </div>
  );
};

export default Timeline;