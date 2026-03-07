import { useMemo } from 'react';

interface FloatingPetalsProps {
  count?: number;
}

const FloatingPetals = ({ count = 20 }: FloatingPetalsProps) => {
  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 6 + Math.random() * 8,
      size: 10 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.5,
      emoji: ['🌸', '🌺', '✿', '❀', '🌷'][Math.floor(Math.random() * 5)],
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute animate-fall-petal"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            '--fall-duration': `${p.duration}s`,
            '--fall-delay': `${p.delay}s`,
          } as React.CSSProperties}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingPetals;
