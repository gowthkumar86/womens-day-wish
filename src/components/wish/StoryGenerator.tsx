import { useRef, useState } from "react"
import { motion } from "framer-motion"
import html2canvas from "html2canvas"

interface Props {
  name?: string
}

const themes = {
  floral: {
    gradient: "linear-gradient(135deg,#ffdde1,#ee9ca7,#fbc2eb)",
    text: "#ffffff",
  },
  elegant: {
    gradient: "linear-gradient(135deg,#1f1c2c,#928dab)",
    text: "#ffffff",
  },
  minimal: {
    gradient: "linear-gradient(135deg,#fdfbfb,#ebedee)",
    text: "#333333",
  },
  bold: {
    gradient: "linear-gradient(135deg,#ff512f,#dd2476)",
    text: "#ffffff",
  },
}

const fonts = {
  elegant: "serif",
  modern: "sans-serif",
  playful: "cursive",
}

const icons = [
  { label: "None", value: "" },
  { label: "Flower", value: "🌸" },
  { label: "Rose", value: "🌹" },
  { label: "Tulip", value: "🌷" },
  { label: "Hibiscus", value: "🌺" },
  { label: "Bouquet", value: "💐" },
  { label: "Sunflower", value: "🌻" },
  { label: "Crown", value: "👑" },
  { label: "Sparkle", value: "✨" },
  { label: "Heart", value: "💖" },
]

const StoryGenerator = ({ name }: Props) => {

  const storyRef = useRef<HTMLDivElement>(null)

  const [message, setMessage] = useState(
    "Celebrating strength, kindness and courage today."
  )

  const [theme, setTheme] = useState<keyof typeof themes>("floral")
  const [font, setFont] = useState<keyof typeof fonts>("modern")
  const [icon, setIcon] = useState("🌸")
  const [image, setImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const downloadStory = async () => {
    if (!storyRef.current) return

    const canvas = await html2canvas(storyRef.current, {
      scale: 3,
      useCORS: true,
    })

    const link = document.createElement("a")
    link.download = "story.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const currentTheme = themes[theme]

  return (
    <section className="py-32 px-6 text-center">

      {/* Heading */}

      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-10"
      >
        Create Your Own Story ✨
      </motion.h2>

      <p className="text-sm text-muted-foreground mb-10">
        Write a message, choose a style, and download it to share on Instagram.
      </p>

      {/* Controls */}

      <div className="max-w-md mx-auto mb-12 space-y-5 backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/20 rounded-2xl p-6 shadow-xl">

        <textarea
          value={message}
          maxLength={120}
          rows={3}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
          className="w-full p-3 rounded-xl border border-border bg-background text-sm"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full text-sm"
        />

        <select
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full p-2 rounded-xl border border-border bg-background text-sm"
        >
          {icons.map((i) => (
            <option key={i.label} value={i.value}>
              {i.label} {i.value}
            </option>
          ))}
        </select>

        {/* Theme buttons */}

        <div className="flex gap-2 justify-center flex-wrap">
          {Object.keys(themes).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t as keyof typeof themes)}
              className={`px-4 py-1 rounded-full text-xs ${
                theme === t
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Font buttons */}

        <div className="flex gap-2 justify-center flex-wrap">
          {Object.keys(fonts).map((f) => (
            <button
              key={f}
              onClick={() => setFont(f as keyof typeof fonts)}
              className={`px-4 py-1 rounded-full text-xs ${
                font === f
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

      </div>

      {/* Story Preview */}

      <div className="flex justify-center">

        <motion.div
          ref={storyRef}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="relative w-[320px] h-[570px] rounded-[34px] overflow-hidden shadow-2xl"
          style={{
            color: currentTheme.text,
            fontFamily: fonts[font],
          }}
        >

          {image && (
            <img
              src={image}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div
            className="absolute inset-0"
            style={{
              background: image
                ? "linear-gradient(180deg,rgba(0,0,0,0.4),rgba(0,0,0,0.7))"
                : currentTheme.gradient,
            }}
          />

          <div className="relative h-full flex flex-col justify-center items-center text-center px-10">

            {icon && <div className="text-5xl mb-6">{icon}</div>}

            <p className="uppercase tracking-[3px] text-xs mb-3 opacity-80">
              Celebrate
            </p>

            <h3 className="text-2xl font-bold mb-6">
              Women's Day
            </h3>

            <p className="text-sm leading-relaxed italic mb-8">
              "{message}"
            </p>


            <div className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md text-sm">
              ✨ Share the appreciation
            </div>

          </div>

        </motion.div>

      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={downloadStory}
        className="mt-12 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold shadow-xl"
      >
        Download Story 📸
      </motion.button>

      <p className="text-sm text-muted-foreground mt-3">
        Save and share on Instagram Stories
      </p>

    </section>
  )
}

export default StoryGenerator