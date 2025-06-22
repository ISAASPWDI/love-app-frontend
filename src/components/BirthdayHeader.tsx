
import { Gift } from 'lucide-react';

interface BirthdayHeaderProps {
  name: string;
}

export const BirthdayHeader = ({ name }: BirthdayHeaderProps) => {
  return (
    <div className="text-center mb-12 animate-fade-in-up">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6 animate-bounce-gentle">
        <Gift className="w-10 h-10 text-birthday-purple" />
      </div>
      
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
        Feliz Cumpleaños 
        Janet 🎉
      </h1>
      
      <div className="flex justify-center items-center space-x-2 text-white mt-10">
        <span className="text-lg text-gray-300">Made</span>
        <span className="text-lg text-gray-300">just for you 😊</span>
      </div>
    </div>
  );
};
