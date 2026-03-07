import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  name: string;
  relationship: "Friend" | "Sister" | "Mom" | "Colleague" | "Special Person";
  complimentStyle: "warm" | "fun" | "elegant" | "powerful";
  onComplete: () => void;
}

const relationshipMessages = {
  Friend: "Celebrating an amazing friend today 🌸",
  Sister: "To the sister who makes life brighter 💖",
  Mom: "To the strongest woman I know 👑",
  Colleague: "To an inspiring colleague ✨",
  "Special Person": "To someone truly special 💫",
};

const complimentChecks = {
  warm: [
    "✔ Kindness level: Heartwarming",
    "✔ Compassion level: Overflowing",
    "✔ Positivity detected ✨",
    "✔ Beautiful soul confirmed 🌸",
  ],

  fun: [
    "✔ Chaos level: Manageable 😄",
    "✔ Coolness level: Legendary 😎",
    "✔ Main character energy detected 🎬",
    "✔ Certified awesome human ✔",
  ],

  elegant: [
    "✔ Grace level: Exceptional",
    "✔ Poise verified ✨",
    "✔ Radiance detected 💎",
    "✔ Timeless elegance confirmed 👑",
  ],

  powerful: [
    "✔ Strength level: Unstoppable",
    "✔ Leadership energy detected 🔥",
    "✔ Confidence verified ⚡",
    "✔ Queen energy confirmed 👑",
  ],
};

const LandingSequence = ({
  name = "",
  relationship = "Friend",
  complimentStyle = "warm",
  onComplete,
}: Props) => {
  const [phase, setPhase] = useState(0);
  const [visibleChecks, setVisibleChecks] = useState(0);

  const checkItems = complimentChecks[complimentStyle] ?? complimentChecks.warm;

  // Phase 1 trigger
  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Reveal check items progressively
  useEffect(() => {
    if (phase !== 1) return;

    if (visibleChecks < checkItems.length) {
      const timer = setTimeout(() => {
        setVisibleChecks((v) => v + 1);
      }, 700);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => setPhase(2), 1000);
    return () => clearTimeout(timer);
  }, [phase, visibleChecks, checkItems.length]);

  // Complete sequence
  useEffect(() => {
    if (phase === 2) {
      const timer = setTimeout(onComplete, 2200);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const progress = checkItems.length
  ? (visibleChecks / checkItems.length) * 100
  : 0;

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center relative overflow-hidden">

      <div className="relative z-10 text-center px-4 max-w-xl w-full">
        <AnimatePresence mode="wait">

          {/* LOADING PHASE */}
          {phase === 0 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.12, 1],
                }}
                transition={{
                  rotate: { duration: 2.5, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity },
                }}
                className="text-5xl inline-block"
              >
                🌸
              </motion.div>

              <p className="text-xl text-muted-foreground font-body">
                Preparing something special for{" "}
                <span className="font-semibold">{name}</span>...
              </p>
            </motion.div>
          )}

          {/* CHECK PHASE */}
          {phase === 1 && (
            <motion.div
              key="checks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {checkItems.slice(0, visibleChecks).map((item, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-lg font-body font-medium text-foreground"
                >
                  {item}
                </motion.p>
              ))}

              {/* Progress bar */}
              <div className="mt-6 w-full bg-white/30 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-pink-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <p className="text-sm text-muted-foreground font-body mt-2">
                Preparing your celebration...
              </p>
            </motion.div>
          )}

          {/* FINAL REVEAL */}
          {phase === 2 && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 110 }}
              className="space-y-4"
            >
              <h1 className="font-display text-5xl">
                Happy Women's Day, {name} 🌸
              </h1>

              <p className="text-lg text-muted-foreground font-body">
                {relationshipMessages[relationship]}
              </p>

              <motion.p
                className="text-sm text-muted-foreground"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Your celebration is ready ✨
              </motion.p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingSequence;