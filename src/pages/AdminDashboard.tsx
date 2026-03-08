import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  isAuthenticated, logout, getWishes, saveWish, deleteWish, generateId,
  type WishData,
} from '@/lib/wishStore';
import { Plus, Trash2, Copy, Share2, QrCode, LogOut, Edit, X, Sparkles, Eye } from 'lucide-react';
import { toast } from 'sonner';
import FloatingPetals from '@/components/FloatingPetals';
import { uploadImage } from "@/lib/uploadImage"

const RELATIONSHIPS = ['Friend', 'Sister', 'Mom' ,'Colleague', 'Special Person'] as const;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [wishes, setWishes] = useState<WishData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [qrWish, setQrWish] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [senderName,setSenderName] = useState("")
  const [photo, setPhoto] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [complimentStyle, setComplimentStyle] = useState<WishData['complimentStyle']>('warm');
  const [relationship, setRelationship] = useState<WishData['relationship']>('Friend');
  const [appreciationImages, setAppreciationImages] = useState<string[]>([])

  useEffect(() => {
    const loadWishes = async () => {
      if (!isAuthenticated()) {
        navigate("/login")
        return
      }
      try {
        const data = await getWishes()
        setWishes(data)
      } catch (err) {
        console.error("Failed to load wishes:", err)
      }
    }
    loadWishes()
  }, [navigate])

  const resetForm = () => {
    setName(''); setNickname(''); setPhoto(null); setMessage('');
    setComplimentStyle('warm'); setRelationship('Friend');setAppreciationImages([]);
    setEditingId(null); setShowForm(false);
  };


  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadImage(file)
      setPhoto(url)
    } catch (err) {
      toast.error("Image upload failed")
    }

  }

  const handleAppreciationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Each image must be under 2MB")
        continue
      }
      const url = await uploadImage(file)
      uploaded.push(url)
    }
    setAppreciationImages(prev => [...prev, ...uploaded])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const id = editingId || generateId(name)
      const wish: WishData = {
        id,
        name,
        nickname,
        senderName,
        photo,
        message,
        complimentStyle,
        relationship,
        appreciationImages,
        createdAt: Date.now()
      }

      await saveWish(wish)
      const updated = await getWishes()
      setWishes(updated)
      resetForm()
      toast.success(editingId ? "Wish updated!" : "Wish created!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to save wish")
    }
  }

  const handleEdit = (w: WishData) => {
    setName(w.name); setNickname(w.nickname);setSenderName(w.senderName); setPhoto(w.photo);
    setMessage(w.message); setComplimentStyle(w.complimentStyle);
    setRelationship(w.relationship);setAppreciationImages(w.appreciationImages || []); setEditingId(w.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWish(id)
      const updated = await getWishes()
      setWishes(updated)
      toast.success("Wish deleted")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete wish")
    }
  }

  const getLink = (id: string) => `${window.location.origin}/wish?id=${id}`;

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(getLink(id));
    toast.success('Link copied!');
  };

  const shareWhatsApp = (w: WishData) => {
    const text = `Hey ${w.nickname || w.name}! 🌸 I have something special for you this Women's Day: ${getLink(w.id)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen gradient-soft relative">
      <FloatingPetals count={8} />

      {/* Header */}
      <header className="glass sticky top-0 z-20 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">✨ Admin Dashboard</h1>
          <div className="flex gap-2">
            <button onClick={() => { setShowForm(true); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2 gradient-primary text-primary-foreground rounded-xl font-body text-sm font-semibold hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> New Wish
            </button>
            <button onClick={() => { logout(); navigate('/login'); }} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-30 flex items-start sm:items-center justify-center p-4 pt-24 sm:pt-4 overflow-y-auto"
              onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="glass rounded-2xl p-6 w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto mt-4 sm:mt-0"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Create'} Wish</h2>
                  <button onClick={resetForm} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 font-body">Name *</label>
                    <input required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 font-body">Nickname</label>
                    <input value={nickname} onChange={e => setNickname(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 font-body">
                    Sender Name
                    </label>
                    <input
                    value={senderName}
                    onChange={(e)=>setSenderName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 font-body">Photo</label>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-sm font-body file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:gradient-primary file:text-primary-foreground file:font-semibold file:cursor-pointer" />
                    {photo && <img src={photo} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover border-2 border-primary/30" />}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 font-body">Personal Message *</label>
                    <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 font-body">Compliment Style</label>
                    <select value={complimentStyle} onChange={e => setComplimentStyle(e.target.value as WishData['complimentStyle'])} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none font-body">
                      <option value="warm">Warm & Heartfelt</option>
                      <option value="fun">Fun & Playful</option>
                      <option value="elegant">Elegant & Graceful</option>
                      <option value="powerful">Powerful & Empowering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 font-body">Relationship</label>
                    <div className="flex flex-wrap gap-2">
                      {RELATIONSHIPS.map(r => (
                        <button key={r} type="button" onClick={() => setRelationship(r)}
                          className={`px-4 py-2 rounded-xl text-sm font-body font-medium transition-all ${relationship === r ? 'gradient-primary text-primary-foreground shadow-glow' : 'bg-muted hover:bg-accent'}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 font-body">
                      Appreciation Images
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload up to 6 appreciation cards
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAppreciationUpload}
                      className="w-full text-sm font-body
                        file:mr-3 file:py-2 file:px-4
                        file:rounded-xl file:border-0
                        file:gradient-primary
                        file:text-primary-foreground
                        file:font-semibold
                        file:cursor-pointer"
                    />

                    {appreciationImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {appreciationImages.map((img, i) => (
                          <div key={i} className="relative">
                            <img
                              src={img}
                              className="w-16 h-16 object-cover rounded-lg border"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setAppreciationImages(prev =>
                                  prev.filter((_, index) => index !== i)
                                )
                              }
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                  <button type="submit" className="w-full py-3 gradient-primary text-primary-foreground rounded-xl font-semibold font-body hover:opacity-90 transition-opacity shadow-glow flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" /> {editingId ? 'Update' : 'Generate'} Wish
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Modal */}
        <AnimatePresence>
          {qrWish && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-30 flex items-center justify-center p-4"
              onClick={() => setQrWish(null)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="glass rounded-2xl p-8 text-center" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">Scan QR Code</h3>
                <QRCodeSVG value={getLink(qrWish)} size={200} fgColor="hsl(280, 20%, 20%)" bgColor="transparent" />
                <p className="text-sm text-muted-foreground mt-4 font-body">Share this QR code</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishes List */}
        {wishes.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-6xl mb-4">🌸</p>
            <p className="text-xl text-muted-foreground font-body">No wishes yet. Create your first one!</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {wishes.map((w, i) => (
              <motion.div key={w.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 shadow-card hover:shadow-glow transition-shadow">
                <div className="flex items-start gap-3">
                  {w.photo ? (
                    <img src={w.photo} alt={w.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
                  ) : (
                    <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                      {w.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{w.name}</h3>
                    {w.nickname && <p className="text-sm text-muted-foreground font-body">"{w.nickname}"</p>}
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-body">{w.relationship}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2 font-body">{w.message}</p>
                <div className="flex items-center gap-1.5 mt-4 flex-wrap">
                  <a href={`/wish?id=${w.id}&preview=true`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-body font-medium transition-opacity hover:opacity-90">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </a>
                  <button onClick={() => copyLink(w.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted hover:bg-accent text-xs font-body font-medium transition-colors">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                  <button onClick={() => setQrWish(w.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted hover:bg-accent text-xs font-body font-medium transition-colors">
                    <QrCode className="w-3.5 h-3.5" /> QR
                  </button>
                  <button onClick={() => shareWhatsApp(w)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted hover:bg-accent text-xs font-body font-medium transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> WhatsApp
                  </button>
                  <button onClick={() => handleEdit(w)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted hover:bg-accent text-xs font-body font-medium transition-colors">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(w.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-body font-medium transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
