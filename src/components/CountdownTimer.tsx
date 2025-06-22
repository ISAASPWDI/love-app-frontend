
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface BirthdayData {
  name: string;
  birthDate: string;
  wishes: string[];
  isSetup: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Componente CountdownTimer
export const CountdownTimer = ({ birthDate }: { birthDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Detectar el formato de fecha y parsear correctamente
      let birthYear, birthMonth, birthDay;
      
      if (birthDate.includes('/')) {
        // Formato DD/MM/YYYY
        const birthDateParts = birthDate.split('/');
        birthDay = parseInt(birthDateParts[0]);
        birthMonth = parseInt(birthDateParts[1]) - 1; // Los meses van de 0-11
        birthYear = parseInt(birthDateParts[2]);
      } else {
        // Formato YYYY-MM-DD (input date estándar)
        const birthDateParts = birthDate.split('-');
        birthYear = parseInt(birthDateParts[0]);
        birthMonth = parseInt(birthDateParts[1]) - 1; // Los meses van de 0-11
        birthDay = parseInt(birthDateParts[2]);
      }
      
      const now = new Date();
      
      // Crear la fecha objetivo para este año en zona horaria local
      const thisYearBirthday = new Date(now.getFullYear(), birthMonth, birthDay, 0, 0, 0, 0);
      
      // Si el cumpleaños de este año ya pasó, usar el del próximo año
      let targetDate = thisYearBirthday;
      if (now > thisYearBirthday) {
        targetDate = new Date(now.getFullYear() + 1, birthMonth, birthDay, 0, 0, 0, 0);
      }

      // Verificar si hoy es el cumpleaños
      const today = new Date();
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();
      setIsBirthdayToday(todayMonth === birthMonth && todayDay === birthDay);

      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Si la diferencia es 0 o negativa, significa que es el día del cumpleaños
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [birthDate]);

  if (isBirthdayToday) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-fade-in-up">
        <div className="text-6xl mb-4 animate-bounce-gentle">🎂🎉</div>
        <h2 className="text-3xl font-bold text-purple-600 mb-4">
          Ya es tu cumpleaños !!
        </h2>
        <p className="text-lg text-gray-600">
          Hoy es tu día especial !! que la pases muy bien con tu familia, ya luego invitas el pastel xd 🎈
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up">
      <div className="flex items-center justify-center mb-6">
        <Clock className="w-8 h-8 text-purple-600 mr-3" />
        <h2 className="text-2xl font-bold text-purple-600">
          Cuenta regresiva para tu cumple
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="flex justify-center">
          <div className="bg-purple-100 rounded-2xl p-4 w-28 md:w-full shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{timeLeft.days}</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Días</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-purple-100 rounded-2xl p-4 w-28 md:w-full shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{timeLeft.hours}</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Horas</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-purple-100 rounded-2xl p-4 w-28 md:w-full shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{timeLeft.minutes}</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Minutos</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-purple-100 rounded-2xl p-4 w-28 md:w-full shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{timeLeft.seconds}</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Segundos</div>
          </div>
        </div>
      </div>
    </div>
  );
};