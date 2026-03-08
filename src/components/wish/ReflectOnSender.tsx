
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import confetti from "canvas-confetti"

interface Props {
  senderName: string
  relationship: "Friend" | "Sister" | "Mom" | "Colleague" | "Special Person"
}

const QUESTION_BANK = {
  Friend: [
    "How reliable is {name} when you need help?",
    "How fun is it to spend time with {name}?",
    "How supportive is {name} when you're going through something difficult?",
    "How good is {name}'s sense of humour?",
    "How thoughtful is {name} as a friend?",
    "How trustworthy is {name}?",
    "How comfortable do you feel sharing things with {name}?",
    "How much effort does {name} put into friendships?",
    "How good is {name} at cheering people up?",
    "How much positivity does {name} bring into your life?"
  ],

  Sister: [
    "How caring is {name} towards family?",
    "How dependable is {name} during important moments?",
    "How protective is {name} towards loved ones?",
    "How thoughtful is {name} about family needs?",
    "How supportive is {name} when someone needs help?",
    "How responsible is {name} in family matters?",
    "How much positivity does {name} bring to the family?",
    "How patient is {name} with family members?",
    "How much effort does {name} make to stay connected?",
    "How comforting is {name}'s presence during difficult times?"
  ],

  Mom: [
    "How caring is {name} toward family?",
    "How responsible is {name} in life decisions?",
    "How respectful is {name} toward family values?",
    "How dependable is {name} when you need support?",
    "How thoughtful is {name} toward family members?",
    "How much pride does {name} bring to the family?",
    "How much effort does {name} put into improving themselves?",
    "How supportive is {name} during difficult situations?",
    "How much happiness does {name} bring to the family?",
    "How strong is {name}'s character?"
  ],

  Colleague: [
    "How reliable is {name} at work?",
    "How helpful is {name} when someone is stuck on a problem?",
    "How creative are {name}'s ideas?",
    "How calm is {name} during stressful situations?",
    "How easy is it to collaborate with {name}?",
    "How much effort does {name} put into solving problems?",
    "How positive is {name}'s attitude at work?",
    "How trustworthy is {name} in professional matters?",
    "How supportive is {name} toward teammates?",
    "How inspiring is {name}'s work ethic?"
  ],

  "Special Person": [
    "How thoughtful is {name} toward you?",
    "How emotionally supportive is {name}?",
    "How safe do you feel sharing things with {name}?",
    "How much does {name} make you smile?",
    "How meaningful is {name}'s presence in your life?",
    "How much effort does {name} put into understanding you?",
    "How patient is {name} when you need support?",
    "How comfortable do you feel around {name}?",
    "How much positivity does {name} bring into your life?",
    "How special does {name} make you feel?"
  ]
}

const RESULT_BANK = {
  Friend: {
    high: {
      title: "Legendary Friend",
      message: (name: string) => `${name} is the kind of friend people feel lucky to have.

Someone who shows up,
supports quietly,
and makes life a little brighter
just by being around.`
    },
    good: {
      title: "True Friend",
      message: (name: string) => `${name} values friendships deeply.

The small things they do —
checking in,
listening,
being present —
mean more than they realise.`
    },
    mid: {
      title: "Good Hearted Friend",
      message: (name: string) => `${name} has a kind heart.

Friendships grow stronger with time,
and people like ${name}
make that journey meaningful.`
    }
  },

  Sister: {
    high: {
      title: "Strong Family Pillar",
      message: (name: string) => `${name} brings warmth and strength to the family.

Someone who cares deeply
and makes others feel supported
even during difficult moments.`
    },
    good: {
      title: "Caring Family Member",
      message: (name: string) => `${name} values family bonds.

The care and effort they put into relationships
helps keep everyone connected.`
    },
    mid: {
      title: "Growing Family Support",
      message: (name: string) => `${name} continues to grow into someone
who makes family life better and stronger.`
    }
  },

  Mom: {
    high: {
      title: "Pride of the Family",
      message: (name: string) => `${name} is someone the family can truly be proud of.

Their character,
effort,
and care
shine through in everything they do.`
    },
    good: {
      title: "Responsible and Caring",
      message: (name: string) => `${name} carries strong values and responsibility.

Their presence brings comfort
and confidence to the family.`
    },
    mid: {
      title: "Growing with Strength",
      message: (name: string) => `${name} is on a journey of growth,
becoming stronger and wiser every day.`
    }
  },

  Colleague: {
    high: {
      title: "Incredible Teammate",
      message: (name: string) => `${name} is someone people enjoy working with.

Reliable,
thoughtful,
and supportive —
a teammate who makes collaboration easier.`
    },
    good: {
      title: "Great Colleague",
      message: (name: string) => `${name} brings positivity and effort into the workplace.

Their approach to work helps teams succeed together.`
    },
    mid: {
      title: "Promising Professional",
      message: (name: string) => `${name} continues to grow professionally
and shows strong potential in everything they do.`
    }
  },

"Special Person": {
  high: {
    title: "Someone Truly Rare",
    message: (name: string) => `${name} is someone whose presence
naturally brings comfort and warmth.

The way they listen,
care,
and show up for people
creates moments that quietly become unforgettable.

People like ${name} don't just pass through lives —
they leave a meaningful impact.`
  },

  good: {
    title: "Someone Who Matters",
    message: (name: string) => `${name} brings a thoughtful and positive presence
into the lives of people around them.

Small gestures,
simple conversations,
and moments of support
often mean more than they realise.`
  },

  mid: {
    title: "A Thoughtful Person",
    message: (name: string) => `${name} has a considerate and genuine nature.

Relationships grow through time and shared experiences,
and people like ${name}
bring warmth and sincerity into those connections.`
  }
}
}

function getResult(score: number, name: string, relationship: Props["relationship"]) {

const bank = RESULT_BANK[relationship]

if (score >= 40)
  return {
    title: bank.high.title,
    message: bank.high.message(name)
  }

if (score >= 25)
  return {
    title: bank.good.title,
    message: bank.good.message(name)
  }

return {
  title: bank.mid.title,
  message: bank.mid.message(name)
}

}

const ReflectOnSender = ({ senderName, relationship }: Props) => {


const questions = useMemo(() => {
  return [...QUESTION_BANK[relationship]]
    .sort(() => Math.random() - 0.5)
    .map(q => q.replace("{name}", senderName))
}, [relationship, senderName])

const [started,setStarted] = useState(false)
const [index,setIndex] = useState(0)
const [ratings,setRatings] = useState<number[]>([])
const [finished,setFinished] = useState(false)
const [hovered, setHovered] = useState<number | null>(null)

const handleRate = (star: number) => {

  setRatings(prev => {
    const updated = [...prev]
    updated[index] = star
    return updated
  })

  if (index < questions.length - 1) {
    setIndex(prev => prev + 1)
  } else {
    setFinished(true)
  }
}

const score = ratings.reduce((sum, r) => {
  if (typeof r !== "number") return sum
  return sum + r
}, 0)

const result = getResult(score, senderName, relationship)

const share = () => {

const text = `I just played the *Reflect on ${senderName}* game ✨

My result:
⭐ ${score}/50

Apparently ${senderName} is:
*${result.title}*

It was actually a thoughtful little experience.
`

window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
}

useEffect(() => {
if (finished) {
confetti({
particleCount: 120,
spread: 70,
origin: { y: 0.6 }
})
}
}, [finished])

return(

<section className="py-20 px-4">

<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  className="max-w-2xl mx-auto"
>

{!started && (

<div className="max-w-xl mx-auto">

<h2 className="text-3xl font-bold mb-4">
Reflect on {senderName}
</h2>

<p className="text-muted-foreground mb-8">

Before you start,
take a moment and think about
the good memories you share with {senderName}.

</p>

<button
onClick={()=>setStarted(true)}
className="px-6 py-3 rounded-xl bg-pink-500 text-white font-semibold"
>

Start Game ✨

</button>

</div>

)}

{started && !finished && (

<motion.div
key={questions[index]}
initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}
className="glass rounded-2xl p-6 shadow-card"
>

<p className="text-sm text-muted-foreground mb-2">
Question {index + 1} / {questions.length}
</p>

<div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
  <motion.div
    className="h-full bg-gradient-to-r from-pink-400 to-purple-400"
    initial={{ width: 0 }}
    animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
    transition={{ duration: 0.4 }}
  />
</div>

<h3 className="text-2xl font-semibold leading-relaxed text-gray-800 mb-8">
{questions[index]}
</h3>

<div className="flex justify-center gap-4">

{[1,2,3,4,5].map(star => {

const active = hovered !== null
  ? star <= hovered
  : star <= (ratings[index] ?? 0)

return (

<motion.button
key={star}
whileHover={{ scale: 1.2 }}
whileTap={{ scale: 0.9 }}
onMouseEnter={() => setHovered(star)}
onMouseLeave={() => setHovered(null)}
onClick={() => handleRate(star)}
className="transition"
>

<Star
className={`w-10 h-10 transition-all duration-200 ${
active
? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
: "text-gray-300"
}`}
/>

</motion.button>

)

})}

</div>

</motion.div>

)}

{finished && (

<motion.div
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ type: "spring", stiffness: 100 }}
className="mt-8 glass rounded-2xl p-8 text-center shadow-glow animate-glow-pulse"
>

<h3 className="text-3xl md:text-4xl font-bold mb-5 text-gray-800 tracking-tight">
{result.title}
</h3>

<p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line font-medium max-w-md mx-auto">
{result.message}
</p>

<p className="text-sm text-gray-500 mt-4">
Score • {score} / 50
</p>

<p className="text-sm text-gray-500 mt-8 leading-relaxed max-w-md mx-auto">

Thanks for taking a moment to reflect on {senderName}.

Sometimes people don't realise
how much they mean to someone.

Today,
you reminded them that they matter too. 🌸

</p>
<div className="h-px bg-border my-6"></div>
<button
onClick={share}
className="mt-8 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold shadow-lg hover:scale-105 transition"
>
Share on WhatsApp ➤
</button>

</motion.div>

)}
</motion.div>
</section>

)

}

export default ReflectOnSender