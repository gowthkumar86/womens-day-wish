import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import confetti from "canvas-confetti";
import { type WishData } from "@/lib/wishStore";

interface Props {
  wish: WishData;
}

const getCategories = (name: string) => [
  {
    key: "strength",
    label: "Inner Strength",
    question: `How strong do you feel when facing challenges, ${name}?`,
  },
  {
    key: "kindness",
    label: "Kindness",
    question: "How kind and caring are you toward others?",
  },
  {
    key: "confidence",
    label: "Confidence",
    question: "How confident are you in your abilities?",
  },
  {
    key: "dreams",
    label: "Dream Chaser",
    question: "How boldly do you pursue your dreams?",
  },
  {
    key: "positivity",
    label: "Positive Energy",
    question: "How much positivity do you bring to people around you?",
  },
];

const styleLines = {
  warm: "Your warmth and kindness make people feel safe and valued.",
  fun: "Your energy and positivity make life brighter for everyone around you.",
  elegant: "Your grace and presence leave a beautiful impression wherever you go.",
  powerful: "Your determination and strength inspire people more than you realize.",
};

function getReward(
  score: number,
  allFive: boolean,
  name: string,
  style: keyof typeof styleLines
) {
  if (allFive) {
    return {
      title: "Too Perfect? 😄",
      message: `${name}, all 5 stars?

Either you're truly extraordinary or being a little generous with yourself.

Try rating again honestly 😉`,
      tease: true,
      confetti: false,
    };
  }

  if (score >= 22) {
    return {
      title: "Inspiring Soul 🌟",
      message: `${name}, ${styleLines[style]}

The world genuinely becomes brighter because of people like you.`,
      confetti: true,
      tease: false,
    };
  }

  if (score >= 17) {
    return {
      title: "Bright Energy ✨",
      message: `${name}, you bring warmth and positivity wherever you go.

Never underestimate the impact you have on others.`,
      confetti: false,
      tease: false,
    };
  }

  if (score >= 12) {
    return {
      title: "Growing Strong 🌱",
      message: `${name}, every day you are learning and growing.

Strength isn't perfection — it's progress.`,
      confetti: false,
      tease: false,
    };
  }

  return {
    title: "Beautiful Potential 🌸",
    message: `${name}, even if you rated yourself low, remember this —

You are stronger and more capable than you realize.`,
    confetti: false,
    tease: false,
  };
}

const RatingGame = ({ wish }: Props) => {
  const displayName = wish.nickname || wish.name;

  const categories = getCategories(displayName);

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hovering, setHovering] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalScore = Object.values(ratings).reduce((a, b) => a + b, 0);

  const allFive =
    Object.values(ratings).length === categories.length &&
    Object.values(ratings).every((v) => v === 5);

  const allRated = categories.every((c) => ratings[c.key]);

  const reward = getReward(
    totalScore,
    allFive,
    displayName,
    wish.complimentStyle as keyof typeof styleLines
  );

  const handleSubmit = () => {
    setSubmitted(true);

    if (reward.confetti) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#e88bab", "#b794d6", "#f5b895", "#d4a843"],
      });
    }
  };

  const resetRatings = () => {
    setRatings({});
    setSubmitted(false);
  };

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient mb-4">
          Rate Yourself ✨
        </h2>

        <p className="text-center text-muted-foreground font-body mb-12">
          Be honest — this reflection is just for you, {displayName}.
        </p>

        <div className="space-y-8">
          {categories.map((cat) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-5 shadow-card"
            >
              <h3 className="font-bold text-lg mb-1">{cat.label}</h3>

              <p className="text-sm text-muted-foreground font-body mb-3">
                {cat.question}
              </p>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled =
                    star <= (hovering[cat.key] || ratings[cat.key] || 0);

                  return (
                    <button
                      key={star}
                      disabled={submitted}
                      onMouseEnter={() =>
                        setHovering((h) => ({ ...h, [cat.key]: star }))
                      }
                      onMouseLeave={() =>
                        setHovering((h) => ({ ...h, [cat.key]: undefined }))
                      }
                      onClick={() =>
                        setRatings((r) => ({ ...r, [cat.key]: star }))
                      }
                      className="p-1 transition-transform hover:scale-110 disabled:opacity-60"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          filled ? "fill-gold text-gold" : "text-border"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {!submitted && allRated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <button
              onClick={handleSubmit}
              className="px-8 py-3 gradient-primary text-primary-foreground rounded-xl font-body font-semibold shadow-glow hover:opacity-90 transition-opacity"
            >
              Reveal Message ✨
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="mt-8 glass rounded-2xl p-8 text-center shadow-glow animate-glow-pulse"
            >
              <p className="text-sm font-body text-muted-foreground mb-2">
                Reflection Result ✨
              </p>

              <h3 className="text-3xl font-bold mb-2">{reward.title}</h3>

              <p className="font-body text-foreground whitespace-pre-line">
                {reward.message}
              </p>

              <p className="text-sm text-muted-foreground font-body mt-3">
                Score: {totalScore}/25
              </p>

              {reward.tease && (
                <button
                  onClick={resetRatings}
                  className="mt-6 px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow"
                >
                  Rate Again 😄
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default RatingGame;