import { motion } from "framer-motion"

interface Props {
  message: string
  name: string
}

const PersonalMessage = ({ message, name }: Props) => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="max-w-2xl mx-auto text-center backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/30 rounded-3xl p-14 shadow-2xl relative"
      >

        {/* Header */}

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
        >
          A message for {name} 💖
        </motion.h2>

        {/* Envelope icon */}

        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
          animate={{
            boxShadow: [
              "0 0 0px rgba(255,120,200,0.3)",
              "0 0 40px rgba(255,120,200,0.7)",
              "0 0 0px rgba(255,120,200,0.3)"
            ]
          }}
          className="text-6xl mb-8 w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white mx-auto shadow-xl"
        >
          💌
        </motion.div>

        {/* Message */}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-foreground leading-relaxed italic mb-10 tracking-wide"
        >
          “{message}”
        </motion.p>

        {/* Divider */}

        <div className="w-16 h-[2px] bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-8 rounded-full" />

        {/* Signature */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-muted-foreground"
        >
          <p className="text-sm tracking-wide uppercase opacity-70 mb-1">
            With appreciation
          </p>

          <p className="text-lg font-semibold text-foreground tracking-wide">
            🌸
          </p>
        </motion.div>

      </motion.div>

    </section>
  )
}

export default PersonalMessage