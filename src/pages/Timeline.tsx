import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Baseline as TimelineIcon, Pencil, Trash2, Save, X, Plus, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import ConfirmDialog from '../components/ConfirmDialog';

const Timeline: React.FC = () => {
  const { 
    loading, 
    error,
    timelineEvents, 
    addTimelineEvent, 
    updateTimelineEvent, 
    deleteTimelineEvent,
    refreshTimelineEvents
  } = useData();
  
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Cargar eventos al iniciar
  useEffect(() => {
    refreshTimelineEvents();
  }, []);

  const handleAddEvent = async () => {
    if (newTitle.trim() && newDate) {
      try {
        await addTimelineEvent(newTitle, newDescription, newDate);
        setNewTitle('');
        setNewDescription('');
        setNewDate('');
        setShowForm(false);
      } catch (err) {
        console.error('Error adding event:', err);
      }
    }
  };

  const handleEditClick = (id: string, title: string, description: string, date: string) => {
    setEditingId(id);
    setEditTitle(title);
    setEditDescription(description || '');
    
    // Formato de fecha para input type="date" (YYYY-MM-DD)
    const dateObj = new Date(date);
    const formattedDate = dateObj.toISOString().split('T')[0];
    setEditDate(formattedDate);
  };

  const handleSaveEdit = async () => {
    if (editingId && editTitle.trim() && editDate) {
      try {
        await updateTimelineEvent(editingId, editTitle, editDescription, editDate);
        setEditingId(null);
      } catch (err) {
        console.error('Error updating event:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteTimelineEvent(deleteId);
        setDeleteId(null);
      } catch (err) {
        console.error('Error deleting event:', err);
      }
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

  // Ordenar eventos por fecha
  const sortedEvents = [...timelineEvents].sort((a, b) => {
    return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
  });
  if (loading && timelineEvents.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          title="Línea de tiempo"
          subtitle="Tener documentado experiencias xd"
          icon={<TimelineIcon size={24} />}
        />
        <div className="flex justify-center">
          <p className='bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4'>Cargando recuerdos...</p>
        </div>
      </div>
    );
  }
  if (error && timelineEvents.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          title="Línea de tiempo"
          subtitle="Tener documentado experiencias xd"
          icon={<TimelineIcon size={24} />}
        />
        <div className="flex-wrap justify-center items-center h-64">
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</p>
          <div className="flex justify-center">
            <ActionButton onClick={refreshTimelineEvents} className="ml-4">
              Reintentar
            </ActionButton>
          </div>

        </div>
      </div>
    );
  }
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
            Agregar nuevo evento
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
              <h2 className=" text-xl text-primary-700">Agregar un nuevo evento</h2>
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
                  Título
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Qué se realizó?"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Contar una historia..."
                  className="textarea w-full h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
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
                  Cancelar
                </ActionButton>
                <ActionButton 
                  onClick={handleAddEvent}
                >
                  <Plus size={18} />
                  Agregar evento
                </ActionButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        {sortedEvents.length > 0 && (
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-300"></div>
        )}
        
        {sortedEvents.length === 0 ? (
          <div className="flex justify-center">
          <p className='bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4'>Aún no hay eventos, agrega tu primer evento!</p>
        </div>
        ) : (
          <div className="space-y-8 relative pl-12">
            <AnimatePresence>
              {sortedEvents.map((event, index) => (
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
                    {editingId === event.id?.toString() ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título
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
                            Descripción
                          </label>
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="textarea w-full h-20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha
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
                            Cancelar
                          </ActionButton>
                          <ActionButton 
                            onClick={handleSaveEdit}
                          >
                            <Save size={16} />
                            Guardar
                          </ActionButton>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4">
                          <div className="text-primary-400 text-sm mb-1">{formatDate(event.event_date.toString())}</div>
                          <h3 className=" text-xl font-semibold text-primary-800">{event.title}</h3>
                          <p className="text-gray-600 mt-2">{event.description}</p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <ActionButton 
                            variant="secondary" 
                            onClick={() => handleEditClick(
                              event.id!.toString(), 
                              event.title, 
                              event.description || '', 
                              event.event_date.toString()
                            )}
                            className="px-2 py-1"
                          >
                            <Pencil size={16} />
                            Edit
                          </ActionButton>
                          <ActionButton 
                            variant="danger" 
                            onClick={() => setDeleteId(event.id!.toString())}
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
        onConfirm={handleDelete}
        title="Eliminar evento"
        message="Estas seguro de que quieres eliminar este evento? Esta acción no puede deshacerse."
      />
    </div>
  );
};

export default Timeline;