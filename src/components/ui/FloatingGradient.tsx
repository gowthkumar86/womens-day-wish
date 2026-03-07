import { motion } from "framer-motion"

const FloatingGradient = () => {

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      <motion.div
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -60, 120, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[600px] h-[600px] bg-pink-300/30 blur-[140px] rounded-full top-[-100px] left-[-100px]"
      />

      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 80, -100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[600px] h-[600px] bg-purple-300/30 blur-[140px] rounded-full bottom-[-100px] right-[-100px]"
      />

    </div>
  )
}

export default FloatingGradient