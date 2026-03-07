import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  count?: number;
}

const emojis = ["🌸", "🌺", "🌷", "💮"];

const ParallaxPetals = ({ count = 15 }: Props) => {

  const { scrollY } = useScroll()

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

      {Array.from({ length: count }).map((_, i) => {

        const speed = Math.random() * 0.4 + 0.2

        const y = useTransform(scrollY, [0, 2000], [0, -2000 * speed])

        const x = Math.random() * window.innerWidth

        const size = 18 + Math.random() * 24

        const rotate = useTransform(scrollY, [0, 2000], [0, 360 * speed])

        const emoji = emojis[Math.floor(Math.random() * emojis.length)]

        return (
          <motion.div
            key={i}
            style={{
              y,
              rotate,
              left: x,
              fontSize: size,
            }}
            className="absolute top-[110%] opacity-40 blur-[1px]"
          >
            {emoji}
          </motion.div>
        )

      })}
    </div>
  )
}

export default ParallaxPetals