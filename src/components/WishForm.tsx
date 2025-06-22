
import { useState } from 'react';
import { Star } from 'lucide-react';

interface WishFormProps {
  onAddWish: (wish: string) => void;
  wishes: string[];
}

export const WishForm = ({ onAddWish, wishes }: WishFormProps) => {
  const [wish, setWish] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wish.trim()) {
      onAddWish(wish.trim());
      setWish('');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up">
      <div className="flex items-center justify-center mb-6">
        <Star className="w-8 h-8 text-birthday-purple mr-3" />
        <h2 className="text-2xl font-bold text-birthday-purple">
          Tus deseos
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-birthday-purple mb-2">
            Escribe un deseo
          </label>
          <textarea
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-birthday-purple/20 focus:border-birthday-purple focus:ring-2 focus:ring-birthday-purple/20 outline-none transition-all resize-none"
            rows={3}
            placeholder=""
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-birthday-purple hover:bg-birthday-purple-dark text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
        >
          Crear el deseo 🌟
        </button>
      </form>

      {wishes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-birthday-purple mb-4">
            Lista de deseos ({wishes.length})
          </h3>
          <div className="max-h-64 overflow-y-auto space-y-3">
            {wishes.map((w, index) => (
              <div
                key={index}
                className="bg-birthday-purple/5 rounded-xl p-4 shadow-sm border border-birthday-purple/10"
              >
                <p className="text-birthday-gray-medium italic">"{w}"</p>
                <div className="flex justify-end mt-2">
                  <span className="text-2xl animate-sparkle">✨</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
