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

    const move = (e: MouseEvent | TouchEvent) => {

      if (!isDrawing.current) return

      if ("touches" in e) {
        e.preventDefault()
      }

      const pos = getCursor(e)
      scratch(pos.x, pos.y)
    }

    canvas.addEventListener("mousedown", start)
    canvas.addEventListener("touchstart", start)

    canvas.addEventListener("mouseup", end)
    canvas.addEventListener("touchend", end)

    canvas.addEventListener("mousemove", move)
    canvas.addEventListener("touchmove", move, { passive: false })

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

  const closeModal = () => {
    setOpen(false)

    setTimeout(() => {
      setShowEnvelope(true)
      setCurrentIndex(0)
      setGallery([])
      setRevealedImage(null)
    }, 300)
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white/80 dark:bg-black/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div
                onClick={closeModal}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-lg font-semibold cursor-pointer"
              >
                ✕
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                Hidden Appreciations 💌
              </h2>

              <p className="text-sm text-muted-foreground mb-6">
                Scratch to reveal the appreciation messages waiting for you.
              </p>


              {/* Scratch Area */}

              {images.length === 0 ? (

                <div className="text-center py-12">

                  <p className="text-xl font-semibold">
                    No hidden appreciations yet 💌
                  </p>

                  <p className="text-sm text-muted-foreground mt-2">
                    This section was meant to reveal appreciation cards,
                    but none were added.
                  </p>

                </div>

              ) : (

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

              )}
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
                      className="w-24 h-20 object-cover rounded-xl shadow-lg cursor-pointer border border-white/20"
                    />

                  ))}

                </div>

              )}


            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Fullscreen Viewer */}

      <AnimatePresence>

        {revealedImage && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onClick={() => setRevealedImage(null)}
          >

            <motion.img
              src={revealedImage}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="max-h-[95vh] max-w-[95vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute top-5 right-5 text-white text-3xl">
              ✕
            </div>

          </motion.div>

        )}

      </AnimatePresence>        
    </section>

  )

}

export default HiddenAppreciation