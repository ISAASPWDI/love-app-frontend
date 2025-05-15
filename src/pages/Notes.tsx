import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, Save, X, Plus, ClipboardList } from 'lucide-react';
import { useData, Note } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import ConfirmDialog from '../components/ConfirmDialog';

const Notes: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, loading, error, refreshNotes } = useData();
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Refrescar notas cuando se monta el componente
  useEffect(() => {
    refreshNotes();
  }, []);

  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        setIsAdding(true);
        console.log('Intentando añadir nota con texto:', newNote);
        await addNote(newNote);
        setNewNote('');
      } catch (err) {
        console.error("Error al añadir nota:", err);
        // No es necesario mostrar una alerta aquí ya que el error ya se establece en DataContext
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note.id!.toString());
    setEditText(note.content);
  };

  const handleSaveEdit = async () => {
    if (editingNote && editText.trim()) {
      try {
        await updateNote(editingNote, editText);
        setEditingNote(null);
      } catch (err) {
        console.error("Error al guardar la edición:", err);
      }
    }
  };
  

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await deleteNote(deleteId);
        setDeleteId(null);
      } catch (err) {
        console.error("Error al eliminar nota:", err);
      }
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  if (loading && notes.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          title="Notas"
          subtitle="Crea tus notas aqui..."
          icon={<ClipboardList size={24} />}
        />
        <div className="flex justify-center">
          <p className='bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4'>Cargando notas...</p>
        </div>
      </div>
    );
  }
  if (error && notes.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
        title="Notas"
        icon={<ClipboardList className="h-6 w-6" />}
        subtitle="Crea tus notas aqui..."
      />
        <div className="flex-wrap justify-center items-center h-64">
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</p>
          <div className="flex justify-center">
          <ActionButton onClick={refreshNotes} className="ml-4">
            Reintentar  
          </ActionButton>
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title="Notas"
        icon={<ClipboardList className="h-6 w-6" />}
        subtitle="Crea tus notas aqui..."
      />

      {/* Mostrar mensaje de error si existe */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Formulario para agregar notas */}
      <div className="card bg-white mb-6">
        <div className="flex flex-col gap-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escribe una nueva nota..."
            className="textarea w-full h-24"
            disabled={isAdding}
          />
          <div className="flex justify-end">
            <ActionButton
              onClick={handleAddNote}
              // disabled={!newNote.trim() || isAdding}
            >
              <Plus size={16} />
              {isAdding ? 'Añadiendo...' : 'Añadir Nota'}
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Mensaje de carga */}
      {loading && <div className="flex justify-center">
          <p className='bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4'>Cargando notas...</p>
        </div> }

      {/* Lista de notas */}
      { notes.length == 0 && !loading ? <div className="flex justify-center">
          <p className='bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4'>Aún no hay notas, agrega tu primera nota arriba...</p>
        </div> :
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
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
              {editingNote === note.id?.toString() ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="textarea w-full h-24"
                  />
                  <div className="flex justify-end gap-2">
                    <ActionButton variant="secondary" onClick={() => setEditingNote(null)}>
                      <X size={16} /> Cancelar
                    </ActionButton>
                    <ActionButton onClick={handleSaveEdit}>
                      <Save size={16} /> Guardar
                    </ActionButton>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-2">
                    <p className="text-primary-900 whitespace-pre-line">{note.content}</p>
                    <p className="text-primary-400 text-sm mt-3">
                    {formatDate(
                    note.created_at instanceof Date
                      ? note.created_at
                      : note.created_at
                      ? new Date(note.created_at)
                      : new Date()
                    )}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <ActionButton
                      variant="secondary"
                      onClick={() => handleEditClick(note)}
                      className="px-2 py-1"
                    >
                      <Pencil size={16} /> Editar
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => setDeleteId(note.id!.toString())}
                      className="px-2 py-1"
                    >
                      <Trash2 size={16} /> Eliminar
                    </ActionButton>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
         
      </div>
      }

      {/* Diálogo de confirmación para eliminar nota */}
      {deleteId && (
        <ConfirmDialog
          title="Eliminar Nota"
          message="¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteId(null)}
          isOpen={deleteId !== null}
        />
      )}
    </div>
  );
};

export default Notes;