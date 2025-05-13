import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, Save, X, Plus,ClipboardList } from 'lucide-react';
import { useData, Note } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import ConfirmDialog from '../components/ConfirmDialog';

const Notes: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useData();
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(newNote);
      setNewNote('');
    }
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note.id);
    setEditText(note.text);
  };

  const handleSaveEdit = () => {
    if (editingNote && editText.trim()) {
      updateNote(editingNote, editText);
      setEditingNote(null);
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
        title="Notas" 
        subtitle="Guarda pensamientos, mensajes, cosas que hacer ..." 
        icon={<ClipboardList size={24} className="text-primary-600" />} 
      />
      
      {/* Add new note form */}
      <motion.div 
        className="mb-8 bg-white rounded-xl shadow-md p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-serif text-xl text-primary-700 mb-4">Create a New Note</h2>
        <div className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your loving message here..."
            className="textarea w-full h-24"
          />
          <div className="flex justify-end">
            <ActionButton 
              onClick={handleAddNote}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Add Note
            </ActionButton>
          </div>
        </div>
      </motion.div>
      
      {/* Notes list */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl text-primary-700 mb-4">Your Notes</h2>
        
        {notes.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">No notes yet. Add your first loving note above!</p>
        ) : (
          <AnimatePresence>
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                className="card bg-gradient-to-r from-primary-50 to-white relative overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                {/* Editing state */}
                {editingNote === note.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="textarea w-full h-24"
                    />
                    <div className="flex justify-end gap-2">
                      <ActionButton 
                        variant="secondary" 
                        onClick={() => setEditingNote(null)}
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
                    <div className="mb-2">
                      <p className="text-primary-900 whitespace-pre-line">{note.text}</p>
                      <p className="text-primary-400 text-sm mt-3">{formatDate(note.date)}</p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <ActionButton 
                        variant="secondary" 
                        onClick={() => handleEditClick(note)}
                        className="px-2 py-1"
                      >
                        <Pencil size={16} />
                        Edit
                      </ActionButton>
                      <ActionButton 
                        variant="danger" 
                        onClick={() => setDeleteId(note.id)}
                        className="px-2 py-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </ActionButton>
                    </div>
                  </>
                )}
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
            deleteNote(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
    </div>
  );
};

export default Notes;