import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, Save, X, Plus, Camera } from 'lucide-react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import ConfirmDialog from '../components/ConfirmDialog';

const Memories: React.FC = () => {
  const { memories, loading, error, addMemory, updateMemory, deleteMemory, refreshMemories } = useData();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState<string>('');
  const [editImageUrl, setEditImageUrl] = useState<string>('');  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar las memorias al montar el componente
  useEffect(() => {
    refreshMemories();
  }, []);

  const handleAddMemory = () => {
    if (newImageUrl.trim() && newCaption.trim()) {
      addMemory(newImageUrl, newCaption)
        .then(() => {
          setNewImageUrl('');
          setNewCaption('');
          setShowForm(false);
        })
        .catch(err => {
          console.error('Error adding memory:', err);
        });
    }
  };

  const handleEditClick = (id: string, caption: string, image_url: string) => {
    setEditingId(id);
    setEditCaption(caption || '');
    setEditImageUrl(image_url || '');
  };  

  const handleSaveEdit = () => {
    if (editingId && editCaption.trim()) {
      updateMemory(editingId, editImageUrl, editCaption)
        .then(() => {
          setEditingId(null);
        })
        .catch(err => {
          console.error('Error updating memory:', err);
        });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteMemory(deleteId)
        .then(() => {
          setDeleteId(null);
        })
        .catch(err => {
          console.error('Error deleting memory:', err);
        });
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (loading && memories.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          title="Recuerdos fotográficos xd"
          subtitle="Guardar momentos para recordar"
          icon={<Camera size={24} />}
        />
        <div className="flex justify-center">
          <p className='bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4'>Cargando recuerdos...</p>
        </div>
      </div>
    );
  }

  if (error && memories.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          title="Recuerdos fotográficos xd"
          subtitle="Guardar momentos para recordar"
          icon={<Camera size={24} />}
        />
        <div className="flex-wrap justify-center items-center h-64">
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</p>
          <div className="flex justify-center">
            <ActionButton onClick={refreshMemories} className="ml-4">
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
        title="Recuerdos fotográficos xd"
        subtitle="Guardar momentos para recordar"
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
            Agregar nuevo recuerdo
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
              <h2 className="text-xl text-primary-700">Agrega un nuevo recuerdo</h2>
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
                  URL de la imagen
                </label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="URL (e.g., https://example.com/image.jpg)"
                  className="input w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Esto es una imagen - https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl7AUM55V_Pw-c7kTWfb7AxI20uXjidS9seQ&s
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Describe este recuerdo..."
                  className="textarea w-full h-20"
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
                  onClick={handleAddMemory}
                >
                  {loading ? 'Adding...' : (
                    <>
                      <Plus size={18} />
                      Agregar recuerdo xd
                    </>
                  )}
                </ActionButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory grid */}
      {memories.length === 0 ?

        (
          <div className="flex justify-center">
            <p className='bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4'>Aún no hay recuerdos, agrega tu primer recuerdo!</p>
          </div>
        ) :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <>
            {memories.map((memory) => (
              <motion.div
                key={memory.id}
                className="rounded-md shadow-lg overflow-hidden flex flex-col"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                  <img
                    src={memory.image_url}
                    alt={memory.caption || 'Memory'}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.dataset.errorHandled) {
                        target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        target.dataset.errorHandled = 'true';
                      }
                    }}
                  />

                </div>
                <div className="p-5 flex-1 flex flex-col">
                  {editingId === memory.id?.toString() ? (
                    <div className="space-y-3 flex-1">
                      <input
      type="text"
      placeholder="Nueva URL de la imagen"
      className="border rounded p-2 w-full mb-2"
      value={editImageUrl}
      onChange={(e) => setEditImageUrl(e.target.value)}
    />
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
                          Cancelar
                        </ActionButton>
                        <ActionButton
                          onClick={handleSaveEdit}
                          className="px-2 py-1"
                        >
                          <Save size={16} />
                          {loading ? 'Saving...' : 'Guardar'}
                        </ActionButton>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-primary-800 font-medium mb-2">{memory.caption}</p>
                      <p className="text-primary-400 text-sm">{formatDate(memory.created_at)}</p>
                      
                      <div className="flex justify-end gap-2 mt-auto pt-3">
                        <ActionButton
                          variant="secondary"
                          onClick={() => handleEditClick(memory.id?.toString() || '', memory.caption || '',
                            memory.image_url || '')}
                          className="px-2 py-1"
                        >
                          <Pencil size={16} />
                          Editar
                        </ActionButton>
                        <ActionButton
                          variant="danger"
                          onClick={() => setDeleteId(memory.id?.toString() || '')}
                          className="px-2 py-1"
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </ActionButton>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </>

        </div>
      }

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar recuerdo"
        message="Estas seguro de que quieres eliminar este recuerdo? Esta acción no puede deshacerse."
      />
    </div>
  );
};

export default Memories;