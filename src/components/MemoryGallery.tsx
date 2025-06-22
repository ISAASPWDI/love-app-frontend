
import { Calendar, Clock } from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  mood: string;
}

interface MemoryGalleryProps {
  memories: Memory[];
  onDeleteMemory: (id: string) => void;
}

const moodEmojis = {
  happy: '😊',
  love: '💕',
  funny: '😄',
  grateful: '🙏',
  excited: '🎉',
  peaceful: '😌'
};

export const MemoryGallery = ({ memories, onDeleteMemory }: MemoryGalleryProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-card-gradient backdrop-blur-sm rounded-3xl shadow-2xl p-8 animate-fade-in-up">
      <div className="flex items-center justify-center mb-8">
        <Calendar className="w-8 h-8 text-birthday-purple mr-3" />
        <h2 className="text-2xl font-bold text-birthday-purple">
          Memory Gallery
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {memories.map((memory, index) => (
          <div
            key={memory.id}
            className="bg-white/90 rounded-2xl p-6 shadow-lg border border-birthday-purple/10 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">
                  {moodEmojis[memory.mood as keyof typeof moodEmojis]}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-birthday-purple">
                    {memory.title}
                  </h3>
                  {memory.date && (
                    <div className="flex items-center text-sm text-birthday-gray-medium mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(memory.date)}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDeleteMemory(memory.id)}
                className="text-birthday-gray-medium hover:text-red-500 transition-colors"
                title="Delete memory"
              >
                ✕
              </button>
            </div>
            
            <p className="text-birthday-gray-medium leading-relaxed">
              {memory.description}
            </p>
          </div>
        ))}
      </div>

      {memories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">📸</div>
          <p className="text-birthday-gray-medium">
            No memories yet. Start creating beautiful memories!
          </p>
        </div>
      )}
    </div>
  );
};
