
import { useState, useEffect } from 'react';
import { BirthdayHeader } from '@/components/BirthdayHeader';
import { CountdownTimer } from '@/components/CountdownTimer';
import { WishForm } from '@/components/WishForm';
import { FloatingHearts } from '@/components/FloatingHearts';

interface BirthdayData {
  name: string;
  birthDate: string;
  wishes: string[];
  isSetup: boolean;
}

const Index = () => {
  const [birthdayData, setBirthdayData] = useState<BirthdayData>({
    name: '',
    birthDate: '',
    wishes: [],
    isSetup: false
  });

  const [showHearts, setShowHearts] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('birthdayData');
    if (savedData) {
      setBirthdayData(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage whenever birthdayData changes
  useEffect(() => {
    localStorage.setItem('birthdayData', JSON.stringify(birthdayData));
  }, [birthdayData]);

  const handleSetup = (name: string, birthDate: string) => {
    setBirthdayData(prev => ({
      ...prev,
      name,
      birthDate,
      isSetup: true
    }));
  };

  const addWish = (wish: string) => {
    setBirthdayData(prev => ({
      ...prev,
      wishes: [...prev.wishes, wish]
    }));
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 3000);
  };

  if (!birthdayData.isSetup) {
    return (
      <div className="min-h-screen bg-birthday-purple flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce-gentle">🎂</div>
            <h1 className="text-3xl font-bold text-birthday-purple mb-2">
              Tu Cumpleaños
            </h1>
            <p className="text-birthday-gray-medium">
              Escribe tus datos sin confundirte xd
            </p>
          </div>
          
          <SetupForm onSetup={handleSetup} />
        </div>
        <FloatingHearts show={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-birthday-purple">
      <div className="container mx-auto px-4 py-8">
        <BirthdayHeader name={birthdayData.name} />
        
        <div className="grid gap-8 max-w-4xl mx-auto">
          <CountdownTimer birthDate={birthdayData.birthDate} />
          
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <WishForm onAddWish={addWish} wishes={birthdayData.wishes} />
            </div>
          </div>
        </div>
      </div>
      <FloatingHearts show={showHearts} />
    </div>
  );
};

const SetupForm = ({ onSetup }: { onSetup: (name: string, birthDate: string) => void }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = () => {
    if (name.trim() && birthDate) {
      onSetup(name.trim(), birthDate);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-purple-600 mb-2">
          Tu nombre
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          placeholder="Ingresa tu nombre"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-purple-600 mb-2">
          Tu fecha de nacimiento
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          required
        />
      </div>
      
      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
      >
        Crea tu cumple ✨
      </button>
    </div>
  );
};
export default Index;
