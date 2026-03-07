import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

const getDirection = (direction: string) => {
  switch (direction) {
    case "left":
      return { x: -60 };
    case "right":
      return { x: 60 };
    case "down":
      return { y: -60 };
    default:
      return { y: 60 };
  }
};

const ScrollReveal = ({
  children,
  delay = 0,
  direction = "up",
}: Props) => {
  const offset = getDirection(direction);

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...offset,
        scale: 0.96,
        filter: "blur(6px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1], // Apple easing curve
      }}
      style={{
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;