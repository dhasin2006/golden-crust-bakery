import React, { useState } from "react";
import { 
  Mail, 
  User, 
  CalendarDays, 
  Lock, 
  ShieldCheck, 
  UtensilsCrossed, 
  ArrowRight,
  Gift,
  HelpCircle
} from "lucide-react";
import { motion } from "motion/react";

interface LoginPageProps {
  onLogin: (profile: { name: string; email: string; dob: string }) => void;
  isDarkMode: boolean;
}

export default function LoginPage({ onLogin, isDarkMode }: LoginPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Please state your elegant name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Kindly provide a valid Gmail address.");
      return;
    }
    if (!dob) {
      setFormError("Please select your exquisite Date of Birth.");
      return;
    }
    setFormError("");
    onLogin({ name: name.trim(), email: email.trim().toLowerCase(), dob });
  };

  // Extract month and day to display custom gourmet gift tier based on birth sign/season
  const getBirthdayAnalysis = () => {
    if (!dob) return null;
    try {
      const birthDate = new Date(dob);
      const months = [
        "Châteaubriand Winter Cocoa", "Sourdough Harvest Amber", "Pistachio Primavera Seed", 
        "Grand Cru Raspberry Sun", "Lemon Elderflower Bloom", "Moka d'Or Roast Breeze",
        "Salted Caramel Equinox", "Bourbon Vanilla Autumn Leaf", "Golden Pumpkin Spice Spice",
        "Spiced Gingerbread Glow", "Chestnut Noel Frost", "Champagne Jubilee Shimmer"
      ];
      const monthIndex = birthDate.getMonth();
      const day = birthDate.getDate();
      
      const gourmetScent = months[monthIndex] || "Madagascar Vanilla Bean";
      return { scent: gourmetScent, day, month: birthDate.toLocaleString("default", { month: "long" }) };
    } catch {
      return null;
    }
  };

  const bio = getBirthdayAnalysis();

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-tr from-[#12100e] via-[#1c1815] to-[#2a221d] overflow-hidden text-[#f4ede5]">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[60vw] h-[60vw] bg-amber-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -inset-0 bg-[radial-gradient(#ffe088_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.02] pointer-events-none" />

      {/* Main card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg bg-[#1a1715]/95 border border-secondary/25 shadow-2xl rounded-[32px] p-6 md:p-10 relative overflow-hidden backdrop-blur-xl z-10"
      >
        {/* Top Gold Border Decor */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-[#ffe088] to-amber-600" />
        
        {/* Brand identity */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#ffe088]/10 border border-[#ffe088]/30 text-[#ffe088] mb-4 shadow-[0_0_15px_rgba(255,224,136,0.1)]"
          >
            <UtensilsCrossed className="w-6 h-6" />
          </motion.div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Golden Crust Boutique
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-[#ffe088] font-bold mt-1">
            Digital Sanctuary Authentication
          </p>
          <p className="text-xs text-zinc-400 mt-3 font-light leading-relaxed max-w-sm mx-auto">
            Welcome to Maitre Antoine's online bakery hall. Connect to customized recipe paring suggestions, secure payments, and special birthday rewards.
          </p>
        </div>

        {formError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-red-950/40 border border-red-500/35 text-red-300 rounded-xl text-xs flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-red-400 shrink-0" />
            <span>{formError}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-300">
              Your Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <User className="w-4 h-4 text-secondary" />
              </span>
              <input
                type="text"
                placeholder="Monsieur / Madame Laurent"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#12100e] border border-zinc-800 focus:border-[#ffe088] text-white text-xs px-10 py-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#ffe088]/40 transition-all font-sans"
              />
            </div>
          </div>

          {/* Email / Gmail to connect */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-300">
              Gmail Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Mail className="w-4 h-4 text-secondary" />
              </span>
              <input
                type="email"
                placeholder="patron@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#12100e] border border-zinc-800 focus:border-[#ffe088] text-white text-xs px-10 py-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#ffe088]/40 transition-all font-mono"
              />
            </div>
            <p className="text-[10px] text-zinc-500 font-light pl-1">
              Verify your Gmail identity to claim standard membership benefits.
            </p>
          </div>

          {/* Date of birth */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-300">
              Date of Birth
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <CalendarDays className="w-4 h-4 text-secondary" />
              </span>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-[#12100e] border border-zinc-800 focus:border-[#ffe088] text-white text-xs px-10 py-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#ffe088]/40 transition-all font-mono"
              />
            </div>
          </div>

          {/* Birthday analysis box */}
          {bio && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3.5 bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-2.5"
            >
              <Gift className="w-4 h-4 text-[#ffe088] shrink-0 mt-0.5 animate-pulse" />
              <div className="text-[11px] leading-relaxed">
                <p className="font-bold text-[#ffe088] uppercase tracking-wide">Maitre Antoine's Celestial Note</p>
                <p className="text-zinc-300 font-light">
                  Your birthday falls under the luxurious <span className="font-semibold text-white">{bio.scent}</span> season! A complimentary box of Parisian Macarons has been locked for you on <span className="font-mono text-white">{bio.month} {bio.day}</span>.
                </p>
              </div>
            </motion.div>
          )}

          {/* Action button */}
          <button
            type="submit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full relative overflow-hidden bg-gradient-to-r from-[#6f4627] to-[#80502e] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-[0_4px_20px_rgba(111,70,39,0.25)]"
          >
            <span>Enter Digital Boutique Vault</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isHovered ? "translate-x-1.5" : ""}`} />
          </button>
        </form>

        {/* Footer badges */}
        <div className="pt-6 mt-6 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> AES-256 Trusted Gate
          </span>
          <span>Version 1.0.4 Premium</span>
        </div>
      </motion.div>
    </div>
  );
}
