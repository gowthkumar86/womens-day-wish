import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { type WishData } from "@/lib/wishStore"

interface Props {
  wish: WishData
}

/* ---------------- Scratch Card ---------------- */

const ScratchCard = ({
  image,
  onReveal,
}: {
  image: string
  onReveal: () => void
}) => {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const revealed = useRef(false)

  useEffect(() => {

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#e5e7eb"
    ctx.fillRect(0, 0, width, height)

    ctx.globalCompositeOperation = "destination-out"

    const scratch = (x: number, y: number) => {
      ctx.beginPath()
      ctx.arc(x, y, 28, 0, Math.PI * 2)
      ctx.fill()
    }

    const getCursor = (e: MouseEvent | TouchEvent) => {

      const rect = canvas.getBoundingClientRect()

      if ("touches" in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        }
      }

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    const start = () => {
      isDrawing.current = true
    }

    const end = () => {
      isDrawing.current = false
      checkReveal()
    }

    const move = (e: MouseEvent | TouchEvent) => {

      if (!isDrawing.current) return

      const pos = getCursor(e)
      scratch(pos.x, pos.y)
    }

    const checkReveal = () => {

      if (revealed.current) return

      const pixels = ctx.getImageData(0,0,width,height).data
      let transparent = 0

      for (let i=3;i<pixels.length;i+=4) {
        if (pixels[i] === 0) transparent++
      }

      const percent = transparent / (width*height)

      if (percent > 0.45) {
        revealed.current = true
        onReveal()
      }
    }

    canvas.addEventListener("mousedown", start)
    canvas.addEventListener("touchstart", start)

    canvas.addEventListener("mouseup", end)
    canvas.addEventListener("touchend", end)

    canvas.addEventListener("mousemove", move)
    canvas.addEventListener("touchmove", move)

    return () => {
      canvas.removeEventListener("mousedown", start)
      canvas.removeEventListener("touchstart", start)
      canvas.removeEventListener("mouseup", end)
      canvas.removeEventListener("touchend", end)
      canvas.removeEventListener("mousemove", move)
      canvas.removeEventListener("touchmove", move)
    }

  }, [onReveal])

  return (
    <div className="relative w-48 h-36 sm:w-64 sm:h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/20">

      <img
        src={image}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
      />

    </div>
  )
}

/* ---------------- Main Component ---------------- */

const HiddenAppreciation = ({ wish }: Props) => {

  const images = wish.appreciationImages || []
  const displayName = wish.nickname || wish.name

  const [open,setOpen] = useState(false)
  const [showEnvelope,setShowEnvelope] = useState(true)

  const [currentIndex,setCurrentIndex] = useState(0)
  const [gallery,setGallery] = useState<string[]>([])

  const [revealedImage,setRevealedImage] = useState<string | null>(null)
  const [showPetals,setShowPetals] = useState(false)

  const openSecret = () => {

    setTimeout(()=>{
      setShowEnvelope(false)
      setOpen(true)
    },300)

  }

  const reveal = (img:string) => {

    if (!gallery.includes(img)) {
      setGallery(prev => [...prev,img])
    }

    setShowPetals(true)

    confetti({
      particleCount:120,
      spread:70,
      origin:{y:0.6}
    })

    setTimeout(()=>{
      setShowPetals(false)
      setCurrentIndex(prev => prev + 1)
    },900)

  }

  const closeReveal = () => {
    setRevealedImage(null)
  }

  return (

    <section className="py-24 px-6 text-center relative overflow-hidden">

      {showPetals}

      {/* Envelope */}

      {showEnvelope && (

        <motion.div
          className="flex flex-col items-center gap-5 cursor-pointer"
          onClick={openSecret}
        >

          <motion.div
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: [1, 1.08, 1],
              boxShadow: [
                "0 0 0px rgba(255,120,200,0.3)",
                "0 0 45px rgba(255,120,200,0.8)",
                "0 0 0px rgba(255,120,200,0.3)"
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5
            }}
            className="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-6xl shadow-2xl"
          >

            💌

          </motion.div>

          <p className="text-sm sm:text-base text-muted-foreground font-medium tracking-wide">
            Tap to reveal something special for{" "}
            <span className="font-semibold text-foreground">
              {displayName}
            </span>
          </p>

        </motion.div>

      )}

      {/* Popup */}

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >

            <motion.div
              initial={{scale:0.9}}
              animate={{scale:1}}
              exit={{scale:0.9}}
              className="bg-white/80 dark:bg-black/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            >

              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                Hidden Appreciations 💌
              </h2>

              <p className="text-sm text-muted-foreground mb-6">
                Scratch to reveal the appreciation messages waiting for you.
              </p>

              {images.length > 0 && (
                <p className="text-xs text-muted-foreground mb-4">
                  Card {Math.min(currentIndex + 1, images.length)} of {images.length}
                </p>
              )}

              {/* Scratch Area */}

              <div className="flex justify-center min-h-[220px]">

                <AnimatePresence mode="wait">

                  {currentIndex < images.length && (

                    <motion.div
                      key={currentIndex}
                      initial={{x:300,opacity:0}}
                      animate={{x:0,opacity:1}}
                      exit={{x:-300,opacity:0}}
                      transition={{duration:0.6}}
                    >

                      <ScratchCard
                        image={images[currentIndex]}
                        onReveal={() => reveal(images[currentIndex])}
                      />

                    </motion.div>

                  )}

                </AnimatePresence>

                {currentIndex === images.length && (

                  <motion.div
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    className="text-center"
                  >

                    <p className="text-xl font-semibold">
                      All appreciations revealed 💖
                    </p>

                    <p className="text-sm text-muted-foreground mt-2">
                      Hope this made your day a little brighter.
                    </p>

                  </motion.div>

                )}

              </div>

              {/* Gallery */}

              {gallery.length > 0 && (

                <div className="mt-8 flex gap-3 overflow-x-auto justify-center">

                  {gallery.map((img,i) => (

                    <motion.img
                      key={i}
                      src={img}
                      initial={{scale:0}}
                      animate={{scale:1}}
                      whileHover={{ scale: 1.1 }}
                      transition={{type:"spring"}}
                      onClick={() => setRevealedImage(img)}
                      className="w-24 h-18 object-cover rounded-xl shadow-lg cursor-pointer border border-white/20"
                    />

                  ))}

                </div>

              )}

              <button
                onClick={() => {
                  setOpen(false)
                  setShowEnvelope(true)
                }}
                className="mt-8 px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-lg hover:opacity-90"
              >
                Close
              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

      {/* Fullscreen Viewer */}

      <AnimatePresence>

        {revealedImage && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]"
            onClick={closeReveal}
          >

            <motion.div
              className="absolute top-6 right-6 text-white text-3xl cursor-pointer"
              onClick={closeReveal}
            >
              ✕
            </motion.div>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >

              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={5}
                doubleClick={{ mode: "zoomIn" }}
              >

                <TransformComponent>

                  <img
                    src={revealedImage}
                    className="max-h-[85vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
                  />

                </TransformComponent>

              </TransformWrapper>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </section>

  )

}

export default HiddenAppreciation