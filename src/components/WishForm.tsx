
import { useState } from 'react';
import { Star } from 'lucide-react';

interface WishFormProps {
  onAddWish: (wish: string) => void;
  wishes: string[];
}

export const WishForm = ({ onAddWish, wishes }: { onAddWish: (wish: string) => void; wishes: string[] }) => {
  const [newWish, setNewWish] = useState('');

  const handleSubmit = () => {
    if (newWish.trim()) {
      onAddWish(newWish.trim());
      setNewWish('');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-purple-600 mb-6 text-center">
        Mis Deseos de Cumpleaños
      </h3>
      
      <div className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            placeholder="Escribe un deseo..."
            className="flex-1 px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          />
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            ✨
          </button>
        </div>
      </div>

      {wishes.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-600 mb-3">Mis deseos:</h4>
          {wishes.map((wish, index) => (
            <div key={index} className="bg-purple-50 p-3 rounded-xl flex items-center">
              <span className="text-purple-600 mr-3">🌟</span>
              <span className="text-gray-700">{wish}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};