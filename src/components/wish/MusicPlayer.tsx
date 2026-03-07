import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Music, VolumeX } from "lucide-react"

const MUSIC_URL = "/assets/bombinsound-international-womens-day-490545.mp3"

const MusicPlayer = () => {

  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {

    const audio = new Audio(MUSIC_URL)
    audio.loop = true
    audio.volume = 0.35

    audioRef.current = audio

    // autoplay on first interaction
    const startMusic = () => {

      audio.play()
        .then(() => setPlaying(true))
        .catch(() => {})

      window.removeEventListener("click", startMusic)
      window.removeEventListener("touchstart", startMusic)

    }

    window.addEventListener("click", startMusic)
    window.addEventListener("touchstart", startMusic)

    return () => {
      audio.pause()
      window.removeEventListener("click", startMusic)
      window.removeEventListener("touchstart", startMusic)
    }

  }, [])

  const toggle = () => {

    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(()=>{})
      setPlaying(true)
    }

  }

  return (

    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 glass rounded-full p-4 shadow-card hover:shadow-glow transition-shadow flex items-center gap-2"
    >

      {playing ? (
        <>
          <div className="flex items-end gap-0.5 h-4">
            {[1,2,3,4].map(i => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full music-bar"
                style={{
                  "--bar-height": `${8 + i * 4}px`,
                  "--bar-speed": `${0.3 + i * 0.1}s`
                } as React.CSSProperties}
              />
            ))}
          </div>

          <VolumeX className="w-5 h-5 text-muted-foreground" />
        </>
      ) : (
        <>
          <Music className="w-5 h-5 text-primary" />
          <span className="text-sm font-body font-medium text-foreground">
            Music 🎵
          </span>
        </>
      )}

    </motion.button>

  )
}

export default MusicPlayer