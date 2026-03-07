import { motion } from "framer-motion";
import { type WishData } from "@/lib/wishStore";

interface Props {
  wish: WishData;
}

/* compliment tone */

const styleMessages = {
  warm: "Her warmth makes people feel safe and valued.",
  fun: "Her presence brings laughter and joy wherever she goes.",
  elegant: "Her grace and composure leave a quiet but powerful impression.",
  powerful: "Her determination inspires everyone around her.",
};

/* relationship message */

const relationshipLines = {
  Friend: "A friend who stands beside others through every moment.",
  Sister: "A sister whose strength quietly holds the family together.",
  Mom: "A mother whose love becomes the foundation for everyone.",
  Colleague: "A colleague whose dedication inspires those around her.",
  "Special Person": "Someone whose presence makes life feel more meaningful.",
};

const getChapters = (wish: WishData) => {

  const displayName = wish.nickname || wish.name;

  return [
    {
      title: "Chapter 1",
      text: `Every strong woman begins with a quiet belief
that her dreams deserve a place in this world.`,
    },

    {
      title: "Chapter 2",
      text: `Between expectations and ambitions,
she learns to walk her own path with patience and courage.`,
    },

    {
      title: "Chapter 3",
      text: `${relationshipLines[wish.relationship]}

${styleMessages[wish.complimentStyle]}`,
    },

    {
      title: "Chapter 4",
      text: `Confidence grows when she trusts her voice
and chooses her dreams with courage.`,
    },

    {
      title: "Final Chapter",
      text: `And somewhere along the journey,
${displayName} becomes someone who inspires others.

Happy Women's Day 🌸`,
    },
  ];
};

const StoryMode = ({ wish }: Props) => {

  const chapters = getChapters(wish);

  return (
    <section className="py-24 px-6">

      {/* Section Title */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >

        <h2 className="text-[34px] md:text-[44px] font-display font-semibold tracking-tight text-gradient">
          Journey of a Strong Woman
        </h2>

        <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-40 mx-auto mt-5"></div>

      </motion.div>

      {/* Chapters */}

      <div className="max-w-xl mx-auto space-y-20">

        {chapters.map((ch, i) => (

          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7 }}
            className="relative text-center"
          >

            {/* Chapter Card */}

            <div className="bg-white/70 backdrop-blur-xl rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] px-7 py-10 md:px-10 md:py-12">

              {/* Emoji */}

              <div className="text-5xl mb-5">
              </div>

              {/* Chapter Title */}

              <h3 className="text-xs tracking-[0.25em] uppercase text-primary font-body font-semibold mb-5">
                {ch.title}
              </h3>

              {/* Chapter Text */}

              <p className="text-[18px] md:text-[20px] leading-[1.75] font-display text-foreground whitespace-pre-line max-w-[420px] mx-auto">
                {ch.text}
              </p>

            </div>

          </motion.div>

        ))}

      </div>

    </section>
  );
};

export default StoryMode;