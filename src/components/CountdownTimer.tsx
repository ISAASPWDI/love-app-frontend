
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  birthDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ birthDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const birth = new Date(birthDate);
      const now = new Date();

      // Set this year's birthday
      const thisYearBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());

      // If this year's birthday has passed, calculate for next year
      let targetDate = thisYearBirthday;
      if (now > thisYearBirthday) {
        targetDate = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
      }

      const difference = targetDate.getTime() - now.getTime();

      // Check if today is the birthday
      const today = new Date();
      const todayStr = `${today.getMonth()}-${today.getDate()}`;
      const birthStr = `${birth.getMonth()}-${birth.getDate()}`;
      setIsBirthdayToday(todayStr === birthStr);

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
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
        <h2 className="text-3xl font-bold text-birthday-purple mb-4">
          Ya es tu cumpleaños !!
        </h2>
        <p className="text-lg text-birthday-gray-medium">
          Hoy es tu día especial !! que la pases muy bien con tu familia, ya luego invitas el pastel xd 🎈
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up">
      <div className="flex items-center justify-center mb-6">
        <Clock className="w-8 h-8 text-birthday-purple mr-3" />
        <h2 className="text-2xl font-bold text-birthday-purple">
          Cuenta regresiva para tu cumple
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="flex justify-center">
          <div className="bg-birthday-purple/10 rounded-2xl p-4 w-28 md:w-full shadow-lg">
            <div className="text-3xl font-bold text-birthday-purple">{timeLeft.days}</div>
            <div className="text-sm text-birthday-gray-medium uppercase tracking-wide">Días</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-birthday-purple/10 rounded-2xl p-4 w-28 md:w-full shadow-lg">
            <div className="text-3xl font-bold text-birthday-purple">{timeLeft.hours}</div>
            <div className="text-sm text-birthday-gray-medium uppercase tracking-wide">Horas</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-birthday-purple/10 rounded-2xl p-4 w-28 md:w-full shadow-lg">
            <div className="text-3xl font-bold text-birthday-purple">{timeLeft.minutes}</div>
            <div className="text-sm text-birthday-gray-medium uppercase tracking-wide">Minutos</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-birthday-purple/10 rounded-2xl p-4 w-28 md:w-full shadow-lg">
            <div className="text-3xl font-bold text-birthday-purple">{timeLeft.seconds}</div>
            <div className="text-sm text-birthday-gray-medium uppercase tracking-wide">Segundos</div>
          </div>
        </div>



      </div>
    </div>
  );
};
