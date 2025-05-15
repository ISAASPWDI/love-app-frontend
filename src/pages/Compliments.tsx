import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Trash2,
  Plus,
  Heart,
  Shuffle,
  Edit2,
  Lock,
  EyeOff,
  CheckCircle,
  XCircle,
  Copy
} from 'lucide-react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import ConfirmDialog from '../components/ConfirmDialog';

interface EditCompliment {
  id: string;
  content: string;
}

const ADMIN_PASSWORD = 'janetystivens';

const Compliments: React.FC = () => {
  const {
    compliments,
    addCompliment,
    updateCompliment,
    deleteCompliment,
    refreshCompliments,
    loading,
    error
  } = useData();

  const [newCompliment, setNewCompliment] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [randomCompliment, setRandomCompliment] = useState<string | null>(null);
  const [showRandomAnimation, setShowRandomAnimation] = useState<boolean>(false);
  const [editingCompliment, setEditingCompliment] = useState<EditCompliment | null>(null);

  // Estados para el control de desenfoque y contraseña
  const [isBlurred, setIsBlurred] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [passwordTimeout, setPasswordTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showCopiedToast, setShowCopiedToast] = useState<boolean>(false);

  // Función para copiar al portapapeles
  const copyToClipboard = (text: string): void => {
    if (!isBlurred) {
      navigator.clipboard.writeText(text);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handleAddCompliment = async (): Promise<void> => {
    if (newCompliment.trim()) {
      try {
        await addCompliment(newCompliment.trim(), false);
        setNewCompliment('');
      } catch (err) {
        console.error('Error al añadir el cumplido:', err);
      }
    }
  };

  const toggleFavoriteCompliment = async (id: string): Promise<void> => {
    if (isBlurred) {
      setShowPasswordModal(true);
      return;
    }

    const compliment = compliments.find(c => c.id?.toString() === id);
    if (compliment) {
      try {
        await updateCompliment(id, compliment.content, !compliment.is_favorite);
        await refreshCompliments();
      } catch (err) {
        console.error('Error al actualizar favorito:', err);
      }
    }
  };

  const handleEditCompliment = async (): Promise<void> => {
    if (editingCompliment && editingCompliment.content.trim()) {
      const compliment = compliments.find(c => c.id?.toString() === editingCompliment.id);
      if (compliment) {
        try {
          await updateCompliment(
            editingCompliment.id,
            editingCompliment.content.trim(),
            compliment.is_favorite!
          );
          await refreshCompliments();
          setEditingCompliment(null);
        } catch (err) {
          console.error('Error al editar el cumplido:', err);
        }
      }
    }
  };

  const startEditing = (id: string): void => {
    if (isBlurred) {
      setShowPasswordModal(true);
      return;
    }
    const compliment = compliments.find(c => c.id?.toString() === id);
    if (compliment) {
      setEditingCompliment({ id, content: compliment.content });
    }
  };

  const cancelEditing = (): void => {
    setEditingCompliment(null);
  };

  const handleDelete = (id: string): void => {
    if (isBlurred) {
      setShowPasswordModal(true);
      return;
    }
    setDeleteId(id);
  };

  const getRandomCompliment = (): void => {
    if (compliments.length === 0) return;
    setShowRandomAnimation(true);

    let count = 0;
    const maxIterations = 10;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * compliments.length);
      setRandomCompliment(compliments[randomIndex].content);
      count++;

      if (count >= maxIterations) {
        clearInterval(interval);
        setTimeout(() => setShowRandomAnimation(false), 500);
      }
    }, 100);
  };

  // Recuperar estado de autenticación al montar
  useEffect(() => {
    const authState = sessionStorage.getItem('complimentsAuthState');
    if (authState === 'authenticated') {
      setIsBlurred(false);

      const timeout = setTimeout(() => {
        setIsBlurred(true);
        sessionStorage.removeItem('complimentsAuthState');
      }, 5 * 60 * 1000);
      setPasswordTimeout(timeout);
    }

    return () => {
      if (passwordTimeout) clearTimeout(passwordTimeout);
    };
  }, []);

  const checkPassword = (): void => {
    if (password === ADMIN_PASSWORD) {
      setIsBlurred(false);
      setPasswordSuccess(true);
      setPasswordError(false);
      sessionStorage.setItem('complimentsAuthState', 'authenticated');

      if (passwordTimeout) clearTimeout(passwordTimeout);
      const timeout = setTimeout(() => {
        setIsBlurred(true);
        setPasswordSuccess(false);
        sessionStorage.removeItem('complimentsAuthState');
      }, 5 * 60 * 1000);
      setPasswordTimeout(timeout);

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 1500);
    } else {
      setPasswordError(true);
      setPasswordSuccess(false);
      setTimeout(() => setPasswordError(false), 2000);
    }

    setPassword('');
  };

  if (loading && compliments.length === 0) {
    return (
      <div className="page-container">
        <PageHeader title="Cumplidos" subtitle="Cosas para decir y recordar xd" icon={<Star size={24} />} />
        <div className="flex justify-center">
          <p className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4">
            Cargando cumplidos...
          </p>
        </div>
      </div>
    );
  }

  if (error && compliments.length === 0) {
    return (
      <div className="page-container">
        <PageHeader title="Cumplidos" subtitle="Cosas para decir y recordar xd" icon={<Star size={24} />} />
        <div className="flex-wrap justify-center items-center h-64">
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</p>
          <div className="flex justify-center">
            <ActionButton onClick={refreshCompliments} className="ml-4">
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
        title="Cumplidos"
        subtitle="Cosas para decir y recordar xd"
        icon={<Star size={24} />}
        actions={
          <ActionButton
            onClick={() => setShowPasswordModal(true)}
            className={isBlurred ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}
          >
            {isBlurred ? (
              <>
                <Lock size={18} />
                Desbloquear lista
              </>
            ) : (
              <>
                <EyeOff size={18} />
                Lista desbloqueada
              </>
            )}
          </ActionButton>
        }
      />

      {/* Random compliment generator */}
      <motion.div
        className="mb-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-md p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold mb-4">Generador de cumplidos aleatorios</h2>

        {randomCompliment ? (
          <motion.div
            className="bg-white/10 rounded-lg p-6 mb-4"
            animate={{
              scale: showRandomAnimation ? [1, 1.05, 1] : 1,
              opacity: showRandomAnimation ? [0.7, 1] : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xl italic">&ldquo;{randomCompliment}&rdquo;</p>
          </motion.div>
        ) : (
          <div className="bg-white/10 rounded-lg p-8 mb-4 flex items-center justify-center">
            <p className="text-primary-200 italic">
              Click al botón de abajo para generar un cumplido aleatorio
            </p>
          </div>
        )}

        <ActionButton
          onClick={getRandomCompliment}
          className="text-primary-700 hover:bg-primary-50"
        >
          <Shuffle size={18} />
          Generar cumplido aleatorio
        </ActionButton>
      </motion.div>

      {/* Add new compliment form */}
      <motion.div
        className="mb-8 bg-white rounded-xl shadow-md p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl text-primary-700 mb-4">Agregar un nuevo cumplido</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={newCompliment}
            onChange={(e) => setNewCompliment(e.target.value)}
            placeholder="Escribe un cumplido bonito xd..."
            className="input w-full"
          />
          <div className="flex justify-end">
            <ActionButton onClick={handleAddCompliment}>
              <Plus size={18} />
              Agrega un cumplido
            </ActionButton>
          </div>
        </div>
      </motion.div>

      {/* Edit compliment dialog */}
      {editingCompliment && (
        <motion.div
          className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl text-primary-700 mb-4">Editar cumplido</h3>
            <input
              type="text"
              value={editingCompliment.content}
              onChange={(e) => setEditingCompliment({...editingCompliment, content: e.target.value})}
              className="input w-full mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <ActionButton 
                onClick={cancelEditing}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </ActionButton>
              <ActionButton 
                onClick={handleEditCompliment}
              >
                Guardar
              </ActionButton>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {passwordSuccess ? (
                <div className="text-center py-6">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex justify-center mb-4"
                  >
                    <CheckCircle size={60} className="text-green-500" />
                  </motion.div>
                  <h3 className="text-xl text-green-700 mb-1">¡Contraseña correcta!</h3>
                  <p className="text-green-600">Lista desbloqueada por 5 minutos</p>
                </div>
              ) : passwordError ? (
                <div className="text-center py-6">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex justify-center mb-4"
                  >
                    <XCircle size={60} className="text-red-500" />
                  </motion.div>
                  <h3 className="text-xl text-red-700 mb-1">Contraseña incorrecta</h3>
                  <p className="text-red-600">Por favor, intenta nuevamente</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl text-primary-700 mb-4 flex items-center">
                    <Lock size={22} className="mr-2" />
                    Verificación de administrador
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Ingresa la contraseña para desbloquear la lista de cumplidos y realizar cambios
                  </p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña de administrador"
                    className="input w-full mb-4"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        checkPassword();
                      }
                    }}
                  />
                  <div className="flex justify-end gap-3">
                    <ActionButton 
                      onClick={() => setShowPasswordModal(false)}
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancelar
                    </ActionButton>
                    <ActionButton 
                      onClick={checkPassword}
                      className="bg-primary-600 text-white hover:bg-primary-700"
                    >
                      Verificar
                    </ActionButton>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compliments list */}
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-primary-700">Tus cumplidos</h2>
          <div className="text-sm text-gray-500">
            {compliments.filter(c => c.is_favorite).length} favoritos
          </div>
        </div>

        {compliments.length === 0 ? (
          <div className="flex justify-center">
            <p className='bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4'>
              Aún no hay cumplidos, agrega tu primer cumplido!
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {compliments.map((compliment, index) => (
              <motion.div
                key={compliment.id}
                className={`card relative ${compliment.is_favorite ? 'bg-primary-50' : 'bg-white'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <div className="flex justify-between items-start">
                  <p className={`text-primary-800 pr-8 ${isBlurred ? 'blur-sm' : ''}`}>
                    {compliment.content}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavoriteCompliment(compliment.id?.toString() || '')}
                      className={`p-1 rounded-full transition-colors ${
                        compliment.is_favorite
                          ? 'text-accent-500 hover:text-accent-600'
                          : 'text-gray-300 hover:text-accent-400'
                      }`}
                      title={isBlurred ? "Desbloquear para marcar como favorito" : "Marcar como favorito"}
                    >
                      <Heart size={20} fill={compliment.is_favorite ? 'currentColor' : 'none'} />
                    </button>
                    {!isBlurred && (
                      <button
                        onClick={() => copyToClipboard(compliment.content)}
                        className="p-1 text-gray-300 hover:text-primary-500 rounded-full"
                        title="Copiar al portapapeles"
                      >
                        <Copy size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => startEditing(compliment.id?.toString() || '')}
                      className="p-1 text-gray-300 hover:text-blue-500 rounded-full"
                      title={isBlurred ? "Desbloquear para editar" : "Editar cumplido"}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(compliment.id?.toString() || "")}
                      className="p-1 text-gray-300 hover:text-accent-500 rounded-full"
                      title={isBlurred ? "Desbloquear para eliminar" : "Eliminar cumplido"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                {isBlurred && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-lg cursor-pointer" 
                    onClick={() => setShowPasswordModal(true)}
                  >
                    <div className="flex items-center space-x-2 bg-white/80 px-3 py-2 rounded-lg shadow hover:bg-white transition-colors">
                      <Lock size={16} className="text-primary-700" />
                      <span className="text-sm text-primary-700 font-medium">Click para desbloquear lista</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Toast notification for copied text */}
      <AnimatePresence>
        {showCopiedToast && (
          <motion.div 
            className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>Texto copiado al portapapeles</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            try {
              await deleteCompliment(deleteId);
              await refreshCompliments();
              setDeleteId(null);
            } catch (err) {
              console.error("Error al eliminar el cumplido:", err);
            }
          }
        }}
        title="Eliminar cumplido"
        message="¿Estás seguro de que deseas eliminar este cumplido? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default Compliments;