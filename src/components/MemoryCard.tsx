
import { useState } from 'react';
import { Heart } from 'lucide-react';

interface Memory {
  title: string;
  description: string;
  date: string;
  mood: string;
}

interface MemoryCardProps {
  onAddMemory: (memory: Memory) => void;
}

const moodEmojis = {
  happy: '😊',
  love: '💕',
  funny: '😄',
  grateful: '🙏',
  excited: '🎉',
  peaceful: '😌'
};

export const MemoryCard = ({ onAddMemory }: MemoryCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [memory, setMemory] = useState<Memory>({
    title: '',
    description: '',
    date: '',
    mood: 'happy'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (memory.title.trim() && memory.description.trim()) {
      onAddMemory(memory);
      setMemory({ title: '', description: '', date: '', mood: 'happy' });
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-card-gradient backdrop-blur-sm rounded-3xl shadow-2xl p-8 animate-fade-in-up">
      <div className="flex items-center justify-center mb-6">
        <Heart className="w-8 h-8 text-birthday-purple mr-3" />
        <h2 className="text-2xl font-bold text-birthday-purple">
          Memory Collection
        </h2>
      </div>

      {!isAdding ? (
        <div className="text-center">
          <p className="text-birthday-gray-medium mb-6">
            Capture beautiful memories and moments to treasure forever
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-birthday-purple hover:bg-birthday-purple-dark text-white font-semibold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            Add Memory ✨
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-birthday-purple mb-2">
              Memory Title
            </label>
            <input
              type="text"
              value={memory.title}
              onChange={(e) => setMemory({ ...memory, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-birthday-purple/20 focus:border-birthday-purple focus:ring-2 focus:ring-birthday-purple/20 outline-none transition-all"
              placeholder="Give this memory a title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-birthday-purple mb-2">
              Description
            </label>
            <textarea
              value={memory.description}
              onChange={(e) => setMemory({ ...memory, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-birthday-purple/20 focus:border-birthday-purple focus:ring-2 focus:ring-birthday-purple/20 outline-none transition-all resize-none"
              rows={3}
              placeholder="Describe this beautiful memory..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-birthday-purple mb-2">
              Date (optional)
            </label>
            <input
              type="date"
              value={memory.date}
              onChange={(e) => setMemory({ ...memory, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-birthday-purple/20 focus:border-birthday-purple focus:ring-2 focus:ring-birthday-purple/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-birthday-purple mb-2">
              Mood
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(moodEmojis).map(([mood, emoji]) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setMemory({ ...memory, mood })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    memory.mood === mood
                      ? 'border-birthday-purple bg-birthday-purple/10'
                      : 'border-birthday-purple/20 hover:border-birthday-purple/40'
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <div className="text-xs text-birthday-purple capitalize mt-1">{mood}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-birthday-purple hover:bg-birthday-purple-dark text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Save Memory
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 bg-white border-2 border-birthday-purple text-birthday-purple hover:bg-birthday-purple/5 font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
