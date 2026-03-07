import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type WishData } from "@/lib/wishStore";

interface Props {
  wish: WishData;
  onTitleClick: () => void;
}

/* Relationship based intro */

const relationshipIntro = {
  Friend: "A small journey celebrating the amazing friend you are 🌸",
  Sister: "A journey celebrating the wonderful sister you are 💖",
  Mom: "A journey celebrating the incredible mother you are 👑",
  Colleague: "A journey celebrating an inspiring colleague ✨",
  "Special Person": "A journey celebrating someone truly special 💫",
};

/* Tone based closing */

const styleClosing = {
  warm: "The world becomes brighter because you are in it.",
  fun: "Being around you automatically makes everything more fun.",
  elegant: "Your grace and strength leave a lasting impression.",
  powerful: "Your strength inspires everyone around you.",
};

const getStoryCards = (
  displayName: string,
  relationship: WishData["relationship"],
  complimentStyle: WishData["complimentStyle"]
) => [
  {
    title: "🌱 A New Chapter",
    text: `Life slowly unfolds with dreams, responsibilities, and hopes for the future.

With every step forward,
she begins to shape a life that truly belongs to her.`,
  },
  {
    title: "🌧 Strength Through Challenges",
    text: `There are expectations, questions, and moments of doubt.

But through every challenge,
she discovers a strength she didn't know she had.`,
  },
  {
    title: "🌸 Kindness",
    text: `Her strength is not only in what she achieves.

It is in the way she cares for people,
supports her loved ones,
and spreads warmth wherever she goes.`,
  },
  {
    title: "🔥 Confidence",
    text: `Little by little, confidence grows.

She learns to trust her voice,
follow her ambitions,
and stand firmly for what she believes in.`,
  },
  {
    title: "✨ Her Journey",
    text: `A woman's journey is never just about reaching goals.

It is about growing,
learning,
and becoming stronger with every experience.`,
  },
  {
    title: "👑 Celebration",
    text: `Today we celebrate ${displayName}.

${styleClosing[complimentStyle]}

Happy Women's Day 🌸`,
  },
];

const HeroSection = ({ wish, onTitleClick }: Props) => {

  const displayName = wish.nickname || wish.name;

  const storyCards = getStoryCards(
    displayName,
    wish.relationship,
    wish.complimentStyle
  );

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);

  const nextCard = () => {
    if (index < storyCards.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 gap-20 text-center">

      {/* INTRO */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl"
      >

        {wish.photo && (
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.05, 1], opacity: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              scale: { repeat: Infinity, duration: 4 },
            }}
            src={wish.photo}
            alt={displayName}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover mx-auto mb-8 border-4 border-primary/30 shadow-glow"
          />
        )}

        {/* Title */}

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -4, 0] }}
          transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
          onClick={onTitleClick}
          className="text-[36px] md:text-[64px] leading-[1.1] tracking-tight font-display font-semibold text-gradient"
        >
          Happy Women's Day 🌸
        </motion.h1>

        {/* Name */}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[24px] md:text-[34px] font-display font-medium tracking-wide text-foreground mt-3"
        >
          {displayName}
        </motion.p>

        {/* Intro text */}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="font-body text-[15px] md:text-[18px] leading-relaxed text-muted-foreground max-w-[340px] mx-auto mt-4"
        >
          {relationshipIntro[wish.relationship]}
        </motion.p>

        {/* Divider */}

        <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-40 mx-auto my-6"></div>

        {/* Start button */}

        {!started && (
          <motion.button
            onClick={() => setStarted(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full bg-primary text-white font-body font-medium tracking-wide shadow-lg"
          >
            Start Journey ✨
          </motion.button>
        )}

      </motion.div>

      {/* STORY */}

      {started && (
        <div className="w-full max-w-xl">

          <AnimatePresence mode="wait">

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 backdrop-blur-xl rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] px-6 py-8 md:px-10 md:py-10"
            >

              <h2 className="text-[22px] md:text-[26px] font-display font-semibold mb-4 text-gradient">
                {storyCards[index].title}
              </h2>

              <p className="text-[16px] md:text-[18px] leading-[1.7] font-body text-foreground whitespace-pre-line">
                {storyCards[index].text}
              </p>

              {index < storyCards.length - 1 && (
                <motion.button
                  onClick={nextCard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 px-7 py-2.5 bg-primary text-white rounded-full font-body font-medium shadow"
                >
                  Next →
                </motion.button>
              )}

            </motion.div>

          </AnimatePresence>

          {/* Progress dots */}

          <div className="flex justify-center gap-2 mt-6">

            {storyCards.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === index
                    ? "bg-primary scale-110"
                    : "bg-gray-300"
                }`}
              />
            ))}

          </div>

        </div>
      )}

    </section>
  );
};

export default HeroSection;