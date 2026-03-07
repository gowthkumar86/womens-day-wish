import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

/* ===============================
GAME 1 — CATCH THE GOOD THINGS
================================ */

const CatchTheGoodThings = () => {

  const [items, setItems] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);
  const [timeLimit, setTimeLimit] = useState(20);

  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem("catch-good-highscore");
    return saved ? Number(saved) : 0;
  });

  const spawnRef = useRef<any>();
  const timerRef = useRef<any>();
  const speedRef = useRef(3);

  const goodItems = [
    "🌸","💪","🔥","✨","🌷","🧠","💖","🌻","🌟","💫",
    "😊","🌈","🌞","💐","🦋","🎯","🚀","📚","🏆","🌱"
  ];

  const badItems = [
    "😞","😟","😔","😓","😵","🗣️","📢","⏳","🧱","🚫","📱","☕","😴","🍟"
  ];

  const startGame = () => {

    setScore(0);
    setCombo(0);
    setItems([]);
    setGameOver(false);

    speedRef.current = 3;

    setTimeLeft(timeLimit);
    setPlaying(true);

    let id = 0;

    spawnRef.current = setInterval(() => {

      const bad = Math.random() < 0.35;

      setItems(prev => [
        ...prev.slice(-25),
        {
          id: id++,
          x: 5 + Math.random() * 85,
          y: -5,
          emoji: bad
            ? badItems[Math.floor(Math.random()*badItems.length)]
            : goodItems[Math.floor(Math.random()*goodItems.length)],
          bad
        }
      ]);

    }, 450);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => t - 1);
      speedRef.current += 0.05;
    }, 1000);

  };

  useEffect(() => {

    if (!playing) return;

    const move = setInterval(() => {

      setItems(prev =>
        prev
          .map(i => ({ ...i, y: i.y + speedRef.current }))
          .filter(i => i.y < 105)
      );

    }, 80);

    return () => clearInterval(move);

  }, [playing]);

  useEffect(() => {

    if (timeLeft <= 0 && playing) {

      setPlaying(false);
      setGameOver(true);

      clearInterval(spawnRef.current);
      clearInterval(timerRef.current);

      if (score > highScore) {

        setHighScore(score);
        localStorage.setItem("catch-good-highscore", score.toString());

        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
        }, 100);

      }

    }

  }, [timeLeft]);

  useEffect(() => {
    return () => {
      clearInterval(spawnRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  const catchItem = (item:any) => {

    setItems(prev => prev.filter(i => i.id !== item.id));

    if (item.bad) {

      setScore(s => Math.max(0, s - 3));
      setCombo(0);

    } else {

      setCombo(prevCombo => {

        const newCombo = prevCombo + 1;

        const comboBonus = newCombo >= 5 ? 2 : 0;

        setScore(s => s + 2 + comboBonus);

        return newCombo;

      });

    }

  };

  return (

    <div className="backdrop-blur-xl bg-white/60 dark:bg-black/40 border border-white/30 rounded-3xl p-8 shadow-2xl">

      <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
        🌸 Catch the Good Things
      </h3>

      {showInstructions && !playing && (

        <div className="bg-black/5 rounded-xl p-5 mb-4 text-sm leading-relaxed">

          <p className="font-semibold mb-2 text-base">How to Play</p>

          <ul className="list-disc ml-5 space-y-1">
            <li>Tap positive items 🌸💪✨</li>
            <li>Avoid negative items 😞🚫</li>
            <li>Build combos for bonus points</li>
          </ul>

          <div className="mt-4">

            <p className="font-semibold mb-2">Time Limit</p>

            <div className="flex gap-2">

              {[20,30,45].map(t => (

                <button
                  key={t}
                  onClick={() => setTimeLimit(t)}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    timeLimit === t
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : "bg-black/10"
                  }`}
                >
                  {t}s
                </button>

              ))}

            </div>

          </div>

          <button
            onClick={() => setShowInstructions(false)}
            className="mt-4 px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg"
          >
            Continue
          </button>

        </div>

      )}

      {!playing && !showInstructions && !gameOver && (

        <button
          onClick={startGame}
          className="px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
        >
          Start Game
        </button>

      )}

      {playing && (

        <div className="relative h-64 bg-black/5 rounded-xl overflow-hidden select-none">

          <div className="absolute left-3 top-2 text-sm font-semibold">
            Score: {score}
          </div>

          <div className="absolute right-3 top-2 text-sm">
            ⏱ {timeLeft}s
          </div>

          <div className="absolute left-3 bottom-2 text-xs opacity-70">
            Combo: {combo}
          </div>

          <div className="absolute right-3 bottom-2 text-xs opacity-70">
            High Score: {highScore}
          </div>

          {items.map(item => (

            <button
              key={item.id}
              onClick={() => catchItem(item)}
              className="absolute text-3xl active:scale-125 transition-transform"
              style={{ left:`${item.x}%`, top:`${item.y}%` }}
            >
              {item.emoji}
            </button>

          ))}

        </div>

      )}

      {gameOver && !showInstructions && (

        <div className="text-center mt-6 space-y-2">

          <p className="text-xl font-bold">
            Final Score: {score}
          </p>

          <p className="text-sm opacity-70">
            High Score: {highScore}
          </p>

          {score === highScore && (
            <p className="text-pink-500 font-semibold">
              🎉 New High Score!
            </p>
          )}

          <div className="flex justify-center gap-3 mt-4">

            <button
              onClick={startGame}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              Play Again
            </button>

            <button
              onClick={() => {
                setGameOver(false);
                setShowInstructions(true);
              }}
              className="px-5 py-2 rounded-full bg-black/10"
            >
              Settings
            </button>

          </div>

        </div>

      )}

    </div>

  );

};

/* ===============================
GAME 2 — DODGE THE DRAMA
================================ */

const DodgeTheDrama = () => {

  const [playerX, setPlayerX] = useState(50);
  const [items, setItems] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);
  const [timeLimit, setTimeLimit] = useState(20);

  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem("dodge-drama-highscore");
    return saved ? Number(saved) : 0;
  });

  const spawnRef = useRef<any>();
  const timerRef = useRef<any>();

  const drama = ["😒","📢","💍","📧","📊","🙄","🧾"];
  const good = ["💪","🌸","👯","☕","🎧"];

  const startGame = () => {

    setScore(0);
    setPlayerX(50);
    setItems([]);
    setGameOver(false);

    setTimeLeft(timeLimit);
    setPlaying(true);

    spawnRef.current = setInterval(() => {

      const bad = Math.random() < 0.6;

      setItems(prev => [

        ...prev.slice(-25),

        {
          id: Math.random(),
          x: Math.random() * 90,
          y: -5,
          emoji: bad
            ? drama[Math.floor(Math.random() * drama.length)]
            : good[Math.floor(Math.random() * good.length)],
          bad
        }

      ]);

    }, 650);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

  };

  const handleMove = (e:any) => {

    const rect = e.currentTarget.getBoundingClientRect();

    const clientX =
      e.touches?.[0]?.clientX ??
      e.changedTouches?.[0]?.clientX ??
      e.clientX;

    const clickX = clientX - rect.left;
    const percent = (clickX / rect.width) * 100;

    setPlayerX(Math.min(90, Math.max(0, percent)));

  };

  useEffect(() => {

    if (!playing) return;

    const move = setInterval(() => {

      setItems(prev =>
        prev
          .map(i => {

            const newY = i.y + 4;

            if (newY > 90 && Math.abs(i.x - playerX) < 6) {

              if (i.bad) setScore(s => Math.max(0, s - 2));
              else setScore(s => s + 3);

              return null;

            }

            return { ...i, y: newY };

          })
          .filter(Boolean)
      );

    }, 90);

    return () => clearInterval(move);

  }, [playing, playerX]);

  useEffect(() => {

    if (timeLeft <= 0 && playing) {

      setPlaying(false);
      setGameOver(true);

      clearInterval(spawnRef.current);
      clearInterval(timerRef.current);

      if (score > highScore) {

        setHighScore(score);
        localStorage.setItem("dodge-drama-highscore", score.toString());

        confetti({
          particleCount: 120,
          spread: 70
        });

      }

    }

  }, [timeLeft]);

  useEffect(() => {
    return () => {
      clearInterval(spawnRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  return (

    <div className="backdrop-blur-xl bg-white/60 dark:bg-black/40 border border-white/30 rounded-3xl p-8 shadow-2xl">

      <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4">
        🎭 Dodge the Drama
      </h3>


      {/* INSTRUCTIONS */}

      {showInstructions && !playing && (

        <div className="bg-muted/40 rounded-xl p-4 mb-4 text-sm">

          <p className="font-semibold mb-2">How to Play</p>

          <ul className="list-disc ml-5 space-y-1">
            <li>Tap anywhere on the screen to move</li>
            <li>Avoid drama 😒📢💍</li>
            <li>Collect support 💪☕🎧</li>
          </ul>

          <div className="mt-3">

            <p className="font-semibold mb-1">Time Limit</p>

            <div className="flex gap-2">

              {[20,30,45].map(t => (

                <button
                  key={t}
                  onClick={() => setTimeLimit(t)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    timeLimit === t ? "bg-purple-500 text-white" : "bg-muted"
                  }`}
                >
                  {t}s
                </button>

              ))}

            </div>

          </div>

          <button
            onClick={() => setShowInstructions(false)}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            Continue
          </button>

        </div>

      )}

      {!playing && !showInstructions && !gameOver && (

        <button
          onClick={startGame}
          className="px-6 py-2 bg-purple-500 text-white rounded-xl"
        >
          Start Game
        </button>

      )}

      {/* GAME AREA */}

      {playing && (

        <div
          onClick={handleMove}
          onTouchStart={handleMove}
          className="relative h-64 bg-black/5 rounded-xl overflow-hidden cursor-pointer select-none"
        >

          <div className="absolute top-2 left-3 text-sm font-semibold">
            Score: {score}
          </div>

          <div className="absolute top-2 right-3 text-sm">
            ⏱ {timeLeft}s
          </div>

          <div className="absolute bottom-2 right-3 text-xs opacity-70">
            High Score: {highScore}
          </div>

          {items.map(item => (

            <div
              key={item.id}
              className="absolute text-2xl pointer-events-none"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.emoji}
            </div>

          ))}

          <div
            className="absolute text-3xl transition-all duration-150 ease-out"
            style={{ bottom: 10, left: `${playerX}%` }}
          >
            🦸‍♀️
          </div>

        </div>

      )}

      {/* GAME OVER */}

      {gameOver && !showInstructions && (

        <div className="text-center mt-4 space-y-2">

          <p className="text-lg font-bold">
            Final Score: {score}
          </p>

          <p className="text-sm">
            High Score: {highScore}
          </p>

          {score === highScore && (
            <p className="text-purple-500 font-semibold">
              🎉 New High Score!
            </p>
          )}

          <div className="flex justify-center gap-3 mt-3">

            <button
              onClick={startGame}
              className="px-4 py-2 bg-purple-500 text-white rounded-xl"
            >
              Play Again
            </button>

            <button
              onClick={() => {
                setGameOver(false);
                setShowInstructions(true);
              }}
              className="px-4 py-2 bg-muted rounded-xl"
            >
              Settings / Manual
            </button>

          </div>

        </div>

      )}

    </div>

  );

};

/* ===============================
MAIN COMPONENT
================================ */

const MiniGames = () => {
  return (

    <section className="py-20 px-4">

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="max-w-2xl mx-auto space-y-8"
      >

        <h2 className="text-3xl font-bold text-center mb-10">
          🎮 Mini Games
        </h2>

        <CatchTheGoodThings />

        <DodgeTheDrama />

      </motion.div>

    </section>

  );
};

export default MiniGames;