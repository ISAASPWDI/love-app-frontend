
import { useEffect, useState } from 'react';

interface FloatingHeartsProps {
  show: boolean;
}

interface Heart {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
}

export const FloatingHearts = ({ show }: FloatingHeartsProps) => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (show) {
      const newHearts: Heart[] = [];
      for (let i = 0; i < 12; i++) {
        newHearts.push({
          id: Date.now() + i,
          left: Math.random() * 100,
          animationDuration: 2 + Math.random() * 2,
          size: 20 + Math.random() * 20,
        });
      }
      setHearts(newHearts);

      // Clean up hearts after animation
      const timer = setTimeout(() => {
        setHearts([]);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || hearts.length === 0) return null;

  return (
    <>
      <style>
        {`
          @keyframes float-up {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}
      </style>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute animate-bounce-gentle opacity-80"
            style={{
              left: `${heart.left}%`,
              bottom: '-50px',
              fontSize: `${heart.size}px`,
              animationDuration: `${heart.animationDuration}s`,
              animationTimingFunction: 'ease-out',
              animation: `float-up ${heart.animationDuration}s ease-out forwards`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>
    </>
  );
};
