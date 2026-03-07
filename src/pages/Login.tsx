import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '@/lib/wishStore';
import { Lock, Sparkles } from 'lucide-react';
import FloatingPetals from '@/components/FloatingPetals';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-soft relative overflow-hidden">
      <FloatingPetals count={15} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`glass rounded-2xl p-8 w-full max-w-md mx-4 shadow-card relative z-10 ${shaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow"
          >
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Women's Day</h1>
          <p className="text-muted-foreground font-body">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body"
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-destructive text-sm font-body"
            >
              Incorrect password. Try again.
            </motion.p>
          )}
          <button
            type="submit"
            className="w-full py-3 gradient-primary text-primary-foreground rounded-xl font-semibold font-body hover:opacity-90 transition-opacity shadow-glow"
          >
            Enter Dashboard
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
