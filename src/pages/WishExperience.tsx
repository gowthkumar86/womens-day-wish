import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getWishById, type WishData } from '@/lib/wishStore';
import FloatingGradient from "@/components/ui/FloatingGradient"
import ScrollReveal from "@/components/ScrollReveal";
import ParallaxPetals from "@/components/ParallaxPetals"
import FloatingPetals from '@/components/FloatingPetals';
import LandingSequence from '@/components/wish/LandingSequence';
import HeroSection from '@/components/wish/HeroSection';
import StoryMode from '@/components/wish/StoryMode';
import RatingGame from '@/components/wish/RatingGame';
import FunPersonalityWheel from '@/components/wish/FunPersonalityWheel';
import MiniGames from '@/components/wish/MiniGames';
import HiddenAppreciation from '@/components/wish/HiddenAppreciation';
import StoryGenerator from '@/components/wish/StoryGenerator';
import PersonalMessage from '@/components/wish/PersonalMessage';
import ReflectOnSender from "@/components/wish/ReflectOnSender"
import MusicPlayer from '@/components/wish/MusicPlayer';
import confetti from 'canvas-confetti';

const WishExperience = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const isPreview = searchParams.get('preview') === 'true';
  const [wish, setWish] = useState<WishData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [titleClicks, setTitleClicks] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);

  useEffect(() => {
    const loadWish = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        const data = await getWishById(id)
        console.log("Loaded wish data:", data)
        setWish(data)
      } catch (err) {
        console.error("Error loading wish:", err)
      } finally {
        setLoading(false)
      }
    }
    loadWish()
  }, [id])

  useEffect(() => {
    if (showContent) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#e88bab', '#b794d6', '#f5b895', '#d4a843'] });
    }
  }, [showContent]);

  const handleTitleClick = () => {
    const clicks = titleClicks + 1;
    setTitleClicks(clicks);
    if (clicks >= 5 && !easterEgg) {
      setEasterEgg(true);
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
    }
  };

  if (loading) return <div className="min-h-screen gradient-soft flex items-center justify-center"><p className="text-xl text-muted-foreground">Loading...</p></div>;

  if (!wish) return (
    <div className="min-h-screen gradient-soft flex items-center justify-center">
      <div className="text-center glass rounded-2xl p-8 mx-4">
        <p className="text-6xl mb-4">🌸</p>
        <h1 className="text-2xl font-bold mb-2">Wish Not Found</h1>
        <p className="text-muted-foreground font-body">This link may be invalid or expired.</p>
      </div>
    </div>
  );
  
  if (!showContent) {
    return (
      <LandingSequence
        name={wish.nickname || wish.name}
        relationship={wish.relationship}
        complimentStyle={wish.complimentStyle}
        onComplete={() => setShowContent(true)}
      />
    );
  }

  return (
    <div className="min-h-screen gradient-soft relative overflow-x-hidden">
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-500/90 backdrop-blur-sm text-amber-950 text-center py-2 px-4 text-sm font-semibold font-body">
          👁️ Preview Mode — Only visible to admin
        </div>
      )}
      <FloatingGradient />
      <ParallaxPetals count={20} />
      <FloatingPetals count={18} />
      <MusicPlayer />

      {/* Easter egg */}
      {easterEgg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 gradient-gold text-primary-foreground px-6 py-3 rounded-full font-body font-semibold shadow-glow animate-scale-in">
          🏆 Legendary Woman Energy 👑
        </div>
      )}

      <div className="relative z-10">

        <ScrollReveal>
          <HeroSection wish={wish} onTitleClick={handleTitleClick} />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <StoryMode wish={wish} />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <RatingGame wish={wish} />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <FunPersonalityWheel wish={wish} />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <MiniGames />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <HiddenAppreciation wish={wish} />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <PersonalMessage
            message={wish.message}
            name={wish.nickname || wish.name}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ReflectOnSender 
            senderName={wish.senderName}
            relationship={wish.relationship}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <StoryGenerator name={wish.nickname || wish.name} />
        </ScrollReveal>

      </div>
    </div>
  );
};

export default WishExperience;
