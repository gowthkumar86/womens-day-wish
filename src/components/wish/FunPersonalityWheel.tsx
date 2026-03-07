import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { type WishData } from "@/lib/wishStore";

interface Props {
  wish: WishData;
}

const baseSegments = [
  {
    key: "queen",
    label: "Queen Energy 👑",
    desc: "Natural leader vibes. People listen when you speak — and they probably should.",
    color: "#d4a843",
  },
  {
    key: "heart",
    label: "Golden Heart ❤️",
    desc: "You care deeply about people. The type who remembers birthdays and checks if everyone ate.",
    color: "#e88bab",
  },
  {
    key: "mind",
    label: "Brilliant Mind 🧠",
    desc: "Smart, sharp, and probably the one solving everyone's problems.",
    color: "#b794d6",
  },
  {
    key: "leader",
    label: "Fearless Leader 🔥",
    desc: "When things get difficult, you're the one stepping forward instead of stepping back.",
    color: "#f59e0b",
  },
  {
    key: "drama",
    label: "Drama Queen 🎭",
    desc: "Okay maybe just a little dramatic sometimes... but honestly it makes life more entertaining 😄",
    color: "#f87171",
  },
  {
    key: "overthinker",
    label: "Professional Overthinker 🤯",
    desc: "You think about things from every possible angle... sometimes even the impossible ones.",
    color: "#6366f1",
  },
];

const styleExtras: Record<string, string> = {
  warm: "And honestly, that warmth makes people feel lucky to know you.",
  fun: "And let's be honest — life would be boring without that energy.",
  elegant: "And you carry that quality with quiet confidence.",
  powerful: "And that strength inspires people around you.",
};

const FunPersonalityWheel = ({ wish }: Props) => {
  const displayName = wish.nickname || wish.name;

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ label: string; desc: string } | null>(
    null
  );
  const [rotation, setRotation] = useState(0);

  const segments = baseSegments;
  const segAngle = 360 / segments.length;

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const segAngle = 360 / segments.length;
    const winIdx = Math.floor(Math.random() * segments.length);

    const extraSpins = 5 * 360;

    const currentAngle = rotation % 360;

    const target =
      extraSpins +
      (360 - winIdx * segAngle - segAngle / 2) -
      currentAngle;

    const newRotation = rotation + target;

    setRotation(newRotation);

    setTimeout(() => {
      const segment = segments[winIdx];

      setResult({
        label: segment.label,
        desc: `${displayName}, ${segment.desc} ${
          styleExtras[wish.complimentStyle]
        }`,
      });

      setSpinning(false);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#e88bab", "#b794d6", "#f5b895", "#d4a843"],
      });
    }, 2200);
  };

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-lg mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-12">
          🎡 Personality Surprise
        </h2>

        <p className="text-muted-foreground font-body mb-8">
          Let's see which personality trait shines the brightest today.
        </p>

        <div className="relative w-72 h-72 mx-auto mb-8">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 text-3xl">
            ▼
          </div>

          {/* Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-border overflow-hidden relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 2.2s cubic-bezier(0.25, 0.8, 0.25, 1)"
                : "none",
            }}
          >
            {segments.map((seg, i) => (
              <div
                key={i}
                className="absolute w-full h-full"
                style={{ transform: `rotate(${i * segAngle}deg)` }}
              >
                <div
                  className="absolute top-0 left-1/2 origin-bottom h-1/2 w-full -translate-x-1/2"
                  style={{
                    background: seg.color,
                    clipPath: `polygon(50% 100%, ${
                      50 - 50 * Math.tan((Math.PI * segAngle) / 360)
                    }% 0%, ${
                      50 + 50 * Math.tan((Math.PI * segAngle) / 360)
                    }% 0%)`,
                  }}
                >
                  <span
                    className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-body font-bold text-primary-foreground whitespace-nowrap"
                    style={{ fontSize: "9px" }}
                  >
                    {seg.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning}
          className="px-8 py-3 gradient-primary text-primary-foreground rounded-xl font-body font-semibold shadow-glow hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {spinning ? "Spinning..." : "Spin the Wheel 🎡"}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 glass rounded-2xl p-6 shadow-glow animate-glow-pulse"
            >
              <p className="text-sm font-body text-muted-foreground mb-1">
                Today's personality highlight
              </p>

              <h3 className="text-2xl font-bold mb-2">{result.label}</h3>

              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {result.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default FunPersonalityWheel;