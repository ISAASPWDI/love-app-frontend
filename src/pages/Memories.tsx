import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Pencil, Trash2, Save, X, Plus, Camera } from 'lucide-react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import ConfirmDialog from '../components/ConfirmDialog';

const Memories: React.FC = () => {
  const { memories, addMemory, updateMemory, deleteMemory } = useData();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddMemory = () => {
    if (newImageUrl.trim() && newCaption.trim()) {
      addMemory(newImageUrl, newCaption);
      setNewImageUrl('');
      setNewCaption('');
      setShowForm(false);
    }
  };

  const handleEditClick = (id: string, caption: string) => {
    setEditingId(id);
    setEditCaption(caption);
  };

  const handleSaveEdit = () => {
    if (editingId && editCaption.trim()) {
      updateMemory(editingId, editCaption);
      setEditingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="page-container">
      <PageHeader 
        title="Photo Memories" 
        subtitle="Capture and save your special moments" 
        icon={<Camera size={24} />} 
      />
      
      {/* Toggle Add Form */}
      {!showForm && (
        <div className="mb-6 flex justify-center">
          <ActionButton 
            onClick={() => setShowForm(true)}
            className="px-6"
          >
            <Plus size={18} />
            Add New Memory
          </ActionButton>
        </div>
      )}
      
      {/* Add new memory form */}
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
              <h2 className="font-serif text-xl text-primary-700">Add a New Memory</h2>
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
                  Image URL
                </label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  className="input w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: You can use a photo from Pexels or other free stock photo sites
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Describe this memory..."
                  className="textarea w-full h-20"
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
                  onClick={handleAddMemory}
                >
                  <Plus size={18} />
                  Add Memory
                </ActionButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Memory grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {memories.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8 col-span-2">No memories yet. Add your first memory!</p>
        ) : (
          <AnimatePresence>
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                className="card overflow-hidden flex flex-col"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                  <img 
                    src={memory.imageUrl} 
                    alt={memory.caption}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  {editingId === memory.id ? (
                    <div className="space-y-3 flex-1">
                      <textarea
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        className="textarea w-full flex-1"
                      />
                      <div className="flex justify-end gap-2">
                        <ActionButton 
                          variant="secondary" 
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1"
                        >
                          <X size={16} />
                          Cancel
                        </ActionButton>
                        <ActionButton 
                          onClick={handleSaveEdit}
                          className="px-2 py-1"
                        >
                          <Save size={16} />
                          Save
                        </ActionButton>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-primary-800 font-medium mb-2">{memory.caption}</p>
                      <p className="text-primary-400 text-sm">{formatDate(memory.date)}</p>
                      <div className="flex justify-end gap-2 mt-auto pt-3">
                        <ActionButton 
                          variant="secondary" 
                          onClick={() => handleEditClick(memory.id, memory.caption)}
                          className="px-2 py-1"
                        >
                          <Pencil size={16} />
                          Edit
                        </ActionButton>
                        <ActionButton 
                          variant="danger" 
                          onClick={() => setDeleteId(memory.id)}
                          className="px-2 py-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </ActionButton>
                      </div>
                    </>
                  )}
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
            deleteMemory(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Memory"
        message="Are you sure you want to delete this memory? This action cannot be undone."
      />
    </div>
  );
};

export default Memories;