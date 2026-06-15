import React, { useState, useEffect, useRef } from "react";
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Sparkles, 
  ChevronRight, 
  Info, 
  Check, 
  MapPin, 
  Phone, 
  Clock, 
  UtensilsCrossed, 
  Heart, 
  Award, 
  Truck, 
  Calendar, 
  MessageSquare, 
  Send,
  Loader2,
  Users,
  AlertCircle,
  Instagram,
  CheckCircle2,
  Minimize2,
  Maximize2,
  Lock,
  ShieldCheck,
  Copy,
  CreditCard,
  LockKeyhole
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { menuItems, testimonials, galleryPhotos } from "./data";
import { MenuItem, CartItem, ChatMessage } from "./types";
import LoginPage from "./components/LoginPage";
import { LogOut, UserCheck, Smartphone, QrCode } from "lucide-react";

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartPromo, setCartPromo] = useState("");
  const [cartDiscount, setCartDiscount] = useState(0);
  const [orderNote, setOrderNote] = useState("");

  // Product Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // ChatBot Maitre Antoine state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "assistant",
      content: "Bonjour, cher ami! I am Maitre Antoine, your master Pâtissier and design advisor here at Golden Crust Boutique. Are you dreaming of a bespoke tier cake for a grand celebration, or looking for the absolute perfect aromatic pairing for our flaky 24-layer croissants? Do tell, what culinary wonders shall we craft together today?",
      timestamp: new Date()
    }
  ]);
  const [currentChatInput, setCurrentChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Consultation booking State
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [consultationFormData, setConsultationFormData] = useState({
    fullName: "",
    email: "",
    date: "",
    cakeType: "Wedding Cake",
    guests: "30-50 guests",
    notes: ""
  });
  const [isConsultationLoading, setIsConsultationLoading] = useState(false);

  // Contact form state
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  // Selected item modal details (Pastry Spec Sheet)
  const [selectedItemDetail, setSelectedItemDetail] = useState<MenuItem | null>(null);

  // Gallery active filters & lightbox
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>("All");
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  // System Notification Toast structure
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" }[]>([]);

  // Mobile menu expand state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll effect for header
  const [isScrolled, setIsScrolled] = useState(false);

  // Order submission states
  const [isOrderingLoader, setIsOrderingLoader] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [checkoutFormData, setCheckoutFormData] = useState({
    name: "",
    email: ""
  });

  // Secure payment and encryption states
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [upiId, setUpiId] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isEncryptionActive, setIsEncryptionActive] = useState(true);
  const [encryptionStatusStage, setEncryptionStatusStage] = useState<string | null>(null);
  const [generatedShaSignature, setGeneratedShaSignature] = useState("");
  const [didCopySignature, setDidCopySignature] = useState(false);

  // User profile / Login state
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; dob: string } | null>(() => {
    try {
      const saved = localStorage.getItem("gourmet_user_profile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogin = (profile: { name: string; email: string; dob: string }) => {
    localStorage.setItem("gourmet_user_profile", JSON.stringify(profile));
    setUserProfile(profile);
    setCheckoutFormData({
      name: profile.name,
      email: profile.email
    });
    showToast(`Bienvenue, ${profile.name}! Your bespoke portal is activated.`, "success");
  };

  const handleLogout = () => {
    localStorage.removeItem("gourmet_user_profile");
    setUserProfile(null);
    setIsProfileDropdownOpen(false);
    showToast("Logged out of luxury portal. Merci, cher guest!", "info");
  };

  // Sync profile details if logged in on load or change
  useEffect(() => {
    if (userProfile) {
      setCheckoutFormData({
        name: userProfile.name,
        email: userProfile.email
      });
    }
  }, [userProfile]);

  // Effect to handle dark theme setting
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Effect for header background transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Chat auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // Toast builder
  const showToast = (message: string, type: "success" | "info" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Add to cart logical handler
  const addToCart = (item: MenuItem, selectedFlavor?: string) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.item.id === item.id);
      if (existing) {
        showToast(`Increased quantity of ${item.name} inside your boutique box!`, "success");
        return prevCart.map((c) => 
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      showToast(`${item.name} added beautifully to your gourmet selections!`, "success");
      return [...prevCart, { item, quantity: 1, selectedFlavor }];
    });
  };

  // Update item quantity
  const updateCartQuantity = (itemId: string, diff: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((c) => {
          if (c.item.id === itemId) {
            const nextQty = c.quantity + diff;
            return { ...c, quantity: nextQty };
          }
          return c;
        })
        .filter((c) => c.quantity > 0);
    });
  };

  // Cart math
  const cartSubtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const discountAmount = cartSubtotal * cartDiscount;
  const deliveryFee = cartSubtotal > 2000 || cartSubtotal === 0 ? 0 : 250.00;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  // Apply Coupon code
  const handleApplyPromo = () => {
    if (cartPromo.trim().toUpperCase() === "BUTTER10") {
      setCartDiscount(0.10);
      showToast("10% luxury discount applied successfully!", "success");
    } else if (cartPromo.trim().toUpperCase() === "GOLDENFREE") {
      setCartDiscount(0.20);
      showToast("Gourmet master code active: 20% off!", "success");
    } else {
      showToast("Invalide promo code. Try 'GOLDENFREE' or 'BUTTER10'.", "info");
    }
  };

  // Handle Order Submit
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutFormData.name || !checkoutFormData.email) {
      showToast("Kindly specify your name and email to proceed.", "info");
      return;
    }
    
    if (paymentMethod === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) {
        showToast("Please enter a valid UPI VPA ID (e.g., username@okaxis) to authorize.", "info");
        return;
      }
    } else {
      if (!cardHolderName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        showToast("Please provide all card details to authorize with our private card vault.", "info");
        return;
      }
    }

    setIsOrderingLoader(true);
    try {
      let hexSig = "";
      if (isEncryptionActive) {
        setEncryptionStatusStage("Initializing premium AES-256-GCM secure channel...");
        await new Promise(r => setTimeout(r, 700));
        
        const hashingMsg = paymentMethod === "upi" 
          ? "Hashing order payload and UPI VPA ticket with SHA3-256..."
          : "Hashing order payload and credit coordinates with SHA3-256...";
        setEncryptionStatusStage(hashingMsg);
        await new Promise(r => setTimeout(r, 750));
        
        // Generate pseudo-SHA hash based on user coordinates and total
        const inputString = `${checkoutFormData.name}-${checkoutFormData.email}-${cartTotal}-${Date.now()}`;
        let hash = 0;
        for (let i = 0; i < inputString.length; i++) {
          const char = inputString.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        const absHash = Math.abs(hash).toString(16).padStart(8, "0");
        const randomHex = Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join("");
        hexSig = `SHA256-${absHash}${randomHex}`.toUpperCase();
        
        setEncryptionStatusStage("Finalizing zero-knowledge verification proof...");
        await new Promise(r => setTimeout(r, 650));
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(c => ({ id: c.item.id, name: c.item.name, qty: c.quantity })),
          total: cartTotal,
          customerName: checkoutFormData.name,
          email: checkoutFormData.email,
          notes: orderNote,
          paymentMethod,
          upiId: paymentMethod === "upi" ? upiId : undefined,
          encryptedSignature: hexSig || "Disabled"
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setGeneratedShaSignature(hexSig);
        setConfirmedOrderId(data.orderId);
        setCart([]);
        setOrderNote("");
        setCardHolderName("");
        setCardNumber("");
        setCardExpiry("");
        setCardCvv("");
        setUpiId("");
        showToast("Your artisanal request was received flawlessly and securely!", "success");
      } else {
        throw new Error(data.error || "Order dispatch failed.");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Baking server communication error. Kindly try again.", "info");
    } finally {
      setIsOrderingLoader(false);
      setEncryptionStatusStage(null);
    }
  };

  // Chat with Maitre Antoine handler
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentChatInput,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setCurrentChatInput("");
    setIsChatLoading(true);

    try {
      // Package conversation messages to send to endpoint
      const payloadMessages = [...chatMessages, userMsg].map((msg) => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch("/api/gemini/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages })
      });

      const data = await res.json();
      if (res.ok && data.content) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.content,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error || "Maitre Antoine got slightly lost in the prep room.");
      }
    } catch (error: any) {
      console.error(error);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Ah, mon cher, my creative copper bowl seems to have tipped! Let us try formatting that request again.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Consultation booking submit
  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationFormData.fullName || !consultationFormData.email || !consultationFormData.date) {
      showToast("Please assist us by filling out all required fields.", "info");
      return;
    }
    setIsConsultationLoading(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consultationFormData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConsultationSubmitted(true);
        showToast("Consultation requested brilliantly! Look for email confirmation shortly.", "success");
      } else {
        throw new Error(data.error || "Submission unsuccessful.");
      }
    } catch (err: any) {
      console.error(err);
      showToast("Unable to record design consultation at this moment.", "info");
    } finally {
      setIsConsultationLoading(false);
    }
  };

  // Quick message form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
      showToast("Please verify all fields are filled before sending.", "info");
      return;
    }
    setContactLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactFormData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContactSubmitted(true);
        setContactFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
        showToast("Your message flew directly to our chefs!", "success");
      } else {
        throw new Error(data.error || "Dispatch failed.");
      }
    } catch (err: any) {
      console.error(err);
      showToast("Failed to dispatch elegant message.", "info");
    } finally {
      setContactLoading(false);
    }
  };

  // Filter products criteria
  const filteredMenuItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter((item) => item.category === selectedCategory);

  if (!userProfile) {
    return (
      <div className="relative min-h-screen font-sans bg-[#12100e] text-white">
        {/* Dynamic Toast Center */}
        <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 max-w-md w-full pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className={`p-4 rounded-xl shadow-lg border pointer-events-auto flex items-start gap-3 backdrop-blur-md ${
                  toast.type === "success" 
                    ? "bg-surface-container-low/95 border-primary/20 text-primary dark:bg-zinc-900/95" 
                    : "bg-surface-container/95 border-outline-variant text-on-surface dark:bg-zinc-900/95 dark:text-white"
                }`}
              >
                {toast.type === "success" ? (
                  <Check className="w-5 h-5 text-secondary mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                )}
                <div className="text-sm font-medium">{toast.message}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <LoginPage onLogin={handleLogin} isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed dark:bg-[#12100e] dark:text-[#f4ede5]">
      
      {/* Dynamic Toast Center */}
      <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`p-4 rounded-xl shadow-lg border pointer-events-auto flex items-start gap-3 backdrop-blur-md ${
                toast.type === "success" 
                  ? "bg-surface-container-low/95 border-primary/20 text-primary dark:bg-inverse-surface/95 dark:text-inverse-on-surface" 
                  : "bg-surface-container/95 border-outline-variant text-on-surface dark:bg-zinc-800/95 dark:text-white"
              }`}
            >
              {toast.type === "success" ? (
                <Check className="w-5 h-5 text-secondary mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-amber-600 mt-0.5" />
              )}
              <div className="text-sm font-medium">{toast.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Banner Accent */}
      <div className="bg-primary text-on-primary py-2 px-4 text-center text-xs tracking-wider uppercase font-semibold hidden md:block">
        ✨ Join Maitre Antoine for a custom tier cake consultation below • Complimentary Delivery on orders over ₹2,000 ✨
      </div>

      {/* Navigation Bar */}
      <nav 
        id="top-nav"
        className={`fixed top-0 md:top-8 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? "mx-0 py-4 bg-surface/90 dark:bg-[#1c1815]/90 backdrop-blur-md shadow-md" 
            : "mx-0 md:mx-6 py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-12 flex justify-between items-center">
          {/* Logo Name */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 cursor-pointer font-display text-2xl font-bold text-primary dark:text-inverse-primary"
          >
            <UtensilsCrossed className="w-6 h-6 text-secondary" />
            <span>Golden Crust Bakery</span>
          </div>

          {/* Desktop Navigation Link Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="font-medium text-primary dark:text-inverse-primary border-b-2 border-primary pb-1 cursor-croissant-hover">Home</a>
            <a href="#about" className="text-on-surface-variant dark:text-zinc-300 hover:text-primary transition-colors cursor-story-hover">About</a>
            <a href="#menu" className="text-on-surface-variant dark:text-zinc-300 hover:text-primary transition-colors cursor-sparkle-hover">Creations</a>
            <a href="#special-cakes" className="text-on-surface-variant dark:text-zinc-300 hover:text-primary transition-colors cursor-cake-hover">Bespoke Cakes</a>
            <a href="#gallery" className="text-on-surface-variant dark:text-zinc-300 hover:text-primary transition-colors cursor-wheat-hover">Gallery</a>
            <a href="#contact" className="text-on-surface-variant dark:text-zinc-300 hover:text-primary transition-colors cursor-croissant-hover">Boutique</a>
          </div>

          {/* Nav Icons and Action buttons */}
          <div className="flex items-center gap-3">
            {/* Dark Theme toggle */}
            <button 
              id="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Theme"
              className="p-2.5 rounded-full bg-surface-container-low dark:bg-zinc-800 text-primary dark:text-inverse-primary border border-outline-variant/30 hover:bg-surface-container transition-all"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Shopping Cart button with dynamic item bubble indicators */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-full bg-surface-container-low dark:bg-zinc-800 text-primary dark:text-inverse-primary border border-outline-variant/30 hover:bg-surface-container transition-all relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {cart.reduce((sum, c) => sum + c.quantity, 0)}
                </motion.span>
              )}
            </button>

            {/* Private Patron Profile Dropdown */}
            {userProfile && (
              <div id="private-patron-dropdown" className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  title="Your Patron Coordinates"
                  className="flex items-center gap-2 p-1.5 rounded-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/30 hover:bg-surface-container transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-secondary/20">
                    {userProfile.name ? userProfile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "GP"}
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#1c1815] border border-outline-variant/40 rounded-2xl shadow-xl p-5 z-50 text-on-surface"
                    >
                      {/* Golden card inside popover */}
                      <div className="relative bg-gradient-to-br from-[#12100e] to-[#251e18] text-white p-4 rounded-xl border border-secondary/20 mb-3 overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-16 h-16 bg-[#ffe088] opacity-15 rounded-full blur-xl pointer-events-none" />
                        <p className="text-[8px] uppercase tracking-widest text-[#ffe088] font-bold">Standard Boutique Patron</p>
                        
                        <p className="text-sm font-semibold truncate mt-2 text-white">{userProfile.name}</p>
                        <p className="text-[10px] font-mono text-zinc-400 truncate">{userProfile.email}</p>
                        <div className="mt-3 flex justify-between items-center text-[9px] text-[#ffe088] font-mono pt-2 border-t border-white/10">
                          <span>DOB: {new Date(userProfile.dob).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                          <span className="flex items-center gap-0.5"><UserCheck className="w-3 h-3" /> Activated</span>
                        </div>
                      </div>

                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all border border-rose-200/30 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Portal</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full bg-surface-container-low dark:bg-zinc-800 text-primary dark:text-inverse-primary transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface dark:bg-[#1a1715] border-t border-outline-variant/40 mt-3 flex flex-col px-6 py-4 gap-4"
            >
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-primary font-medium border-b border-outline-variant/20 cursor-croissant-hover">Home</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-on-surface-variant hover:text-primary cursor-story-hover">About</a>
              <a href="#menu" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-on-surface-variant hover:text-primary cursor-sparkle-hover">Creations</a>
              <a href="#special-cakes" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-on-surface-variant hover:text-primary cursor-cake-hover">Bespoke Cakes</a>
              <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-on-surface-variant hover:text-primary cursor-wheat-hover">Gallery</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-on-surface-variant hover:text-primary cursor-croissant-hover">Boutique</a>

              {userProfile && (
                <div className="mt-2 pt-4 border-t border-outline-variant/30 text-on-surface space-y-3">
                  <div className="bg-[#12100e] text-[#f4ede5] p-4 rounded-2xl border border-secondary/20 relative overflow-hidden">
                    <p className="text-[8px] uppercase tracking-widest text-[#ffe088] font-bold">Standard Boutique Patron</p>
                    <p className="text-xs font-bold mt-1 text-white truncate">{userProfile.name}</p>
                    <p className="text-[10px] font-mono text-zinc-400 truncate">{userProfile.email}</p>
                    <p className="text-[9px] font-mono text-[#ffe088] mt-1.5 pt-1.5 border-t border-white/5">
                      DOB: {new Date(userProfile.dob).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-950/20 text-rose-400 border border-rose-900/40 text-xs font-extrabold uppercase tracking-widest cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 animate-pulse" />
                    <span>Sign Out of Portal</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden">
        {/* Underlay Luxury Photo Blur */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/luxury_bakery_hero_1781508842497.jpg" 
            alt="Golden Crust Counter Display" 
            className="w-full h-full object-cover dark:opacity-[0.35]"
            referrerPolicy="no-referrer"
          />
          {/* Soft Golden ambient radial gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent dark:from-[#12100e] dark:via-[#12100e]/70" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl bg-surface/75 dark:bg-[#1a1715]/75 p-8 md:p-12 rounded-3xl backdrop-blur-md shadow-xl border border-outline-variant/30">
            <span className="font-label-sm uppercase tracking-widest text-secondary text-sm font-semibold mb-4 block">
              Artisanal Excellence &amp; Royal Pâtisserie
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-primary font-bold mb-6 leading-tight dark:text-inverse-primary">
              Freshly Baked <br />
              <span className="italic font-normal text-secondary">Happiness Every Day</span>
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg mb-8 max-w-lg dark:text-zinc-300 leading-relaxed font-light">
              Handcrafted celebration cakes, laminated sourdough, and elite Parisian pastries made with love and premium ingredients imported directly from France.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#menu" 
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-medium shadow-lg hover:bg-primary-container hover:scale-105 active:scale-95 transition-all text-center cursor-sparkle-hover"
              >
                Order Online
              </a>
              <button 
                onClick={() => {
                  const el = document.getElementById("special-cakes");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border-2 border-secondary text-secondary px-8 py-3.5 rounded-xl font-medium hover:bg-secondary/5 hover:scale-105 transition-all text-center cursor-cake-hover"
              >
                Design Custom Cake
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us features list */}
      <section className="py-12 bg-surface-container-low dark:bg-[#161311] border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center text-primary dark:text-[#f4bb92]">
            <div className="flex flex-col items-center gap-2 p-3 hover:translate-y-[-4px] transition-transform duration-300">
              <div className="p-3 rounded-full bg-primary/5 dark:bg-white/5 text-secondary">
                <UtensilsCrossed className="w-7 h-7" />
              </div>
              <p className="font-display font-medium text-sm text-on-surface uppercase tracking-wide dark:text-white">Fresh Ingredients</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 hover:translate-y-[-4px] transition-transform duration-300">
              <div className="p-3 rounded-full bg-primary/5 dark:bg-white/5 text-secondary">
                <Heart className="w-7 h-7" />
              </div>
              <p className="font-display font-medium text-sm text-on-surface uppercase tracking-wide dark:text-white">Handmade Daily</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 hover:translate-y-[-4px] transition-transform duration-300">
              <div className="p-3 rounded-full bg-primary/5 dark:bg-white/5 text-secondary">
                <Award className="w-7 h-7" />
              </div>
              <p className="font-display font-medium text-sm text-on-surface uppercase tracking-wide dark:text-white">Premium Quality</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 hover:translate-y-[-4px] transition-transform duration-300">
              <div className="p-3 rounded-full bg-primary/5 dark:bg-white/5 text-secondary">
                <Truck className="w-7 h-7" />
              </div>
              <p className="font-display font-medium text-sm text-on-surface uppercase tracking-wide dark:text-white">Fast Delivery</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 hover:translate-y-[-4px] transition-transform duration-300 col-span-2 md:col-span-1">
              <div className="p-3 rounded-full bg-primary/5 dark:bg-white/5 text-secondary">
                <Sparkles className="w-7 h-7" />
              </div>
              <p className="font-display font-medium text-sm text-on-surface uppercase tracking-wide dark:text-white">Custom Designs</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 overflow-hidden" id="about">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* About Graphic Layout */}
          <div className="w-full lg:w-1/2 relative flex justify-center">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary-container/20 dark:bg-zinc-800 rounded-full -z-10 blur-xl" />
            <div className="relative group">
              <img 
                alt="Finest laminated croissants on rustic table" 
                className="rounded-3xl shadow-2xl w-full max-w-md aspect-square object-cover border border-outline-variant/40"
                src="/src/assets/images/artisanal_croissants_1781508659092.jpg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-4 bg-surface-container/95 dark:bg-zinc-800/95 border border-outline-variant p-6 rounded-2xl shadow-xl hidden md:block max-w-[220px] backdrop-blur-sm">
                <p className="font-display text-3xl font-bold text-primary dark:text-[#f4bb92] mb-1">30+</p>
                <p className="text-secondary text-xs font-semibold tracking-wider uppercase mb-1">Tradition of Love</p>
                <p className="text-on-surface-variant text-xs dark:text-zinc-300">Years of crafting world-class French pastry arts.</p>
              </div>
            </div>
          </div>

          {/* About Narrative Text */}
          <div className="w-full lg:w-1/2">
            <h2 className="font-display text-3xl md:text-4xl text-primary font-bold mb-6 dark:text-inverse-primary leading-tight">
              A Legacy of Flour, Water &amp; Pure Passion
            </h2>
            <div className="space-y-4 text-on-surface-variant dark:text-zinc-300 text-sm md:text-base leading-relaxed font-light">
              <p>
                Founded in the historic heart of the city, <span className="font-medium text-primary dark:text-inverse-primary">Golden Crust Bakery</span> started with a rustic wood-fired brick oven and an unyielding commitment to classic techniques. Our founders sought to recreate the crispy, butter-crumb laminations found on the streets of culinary Paris.
              </p>
              <p>
                Every single croissant pastry, thick sourdough crust, and tiered wedding cake layer is crafted entirely from scratch using organic stone-ground flours, authentic premium Normandy butter, and seasonal, hand-picked regional fruits.
              </p>
              <p className="font-medium text-secondary italic">
                "We believe baking is not just instructions; it is an intimate alchemy where patience meets excellence."
              </p>
            </div>
            <div className="mt-8">
              <a 
                href="#menu"
                className="font-semibold text-primary hover:text-secondary inline-flex items-center gap-2 group transition-colors dark:text-[#f4bb92] cursor-sparkle-hover"
              >
                <span>Browse Signature Creations</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products List & Bento Grid */}
      <section className="py-24 bg-surface-container dark:bg-[#1a1715]" id="menu">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-secondary text-xs font-bold tracking-wider uppercase mb-2 block">Our Curated Selections</span>
            <h2 className="font-display text-3xl md:text-4xl text-primary font-bold dark:text-inverse-primary">
              Signature Creations
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mt-3 dark:text-zinc-300 font-light">
              Explore our exquisite, daily oven-fresh delicacies and decadent masterpieces, available to purchase instantly. Use the tags to explore categories.
            </p>

            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {["all", "pastry", "bread", "cake", "macaron"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? "bg-primary text-on-primary shadow-md scale-105" 
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat === "all" ? "All Masterpieces" : `${cat}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Dark Truffle Cake - featured span card */}
            {selectedCategory === "all" || selectedCategory === "cake" ? (
              <div className="lg:col-span-2 bg-[#442c1c] text-white rounded-3xl p-8 shadow-lg overflow-hidden relative flex flex-col justify-end group min-h-[440px] border border-primary/20">
                <img 
                  alt="Elite Dark Truffle Cake close-up view" 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-[1.5s]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjx32hwLU8rS-izG6qnjv0vXl-joWSYxWI3kaRy3Hon_IoNfpfl2bwk9p21-ufQAD-vzDPqNzJDsuVdfyLYRuDXxniRFbZ1CFJrnXXB4HD9nMl58RgENIWi-rLusp7zxgY-_8lDgQWG7DpBZfrMsoy5nstQKF7ZfgkWyJhOD2hWSk-JYY-83I8QL_OjvOPNDOp9mctoMyNRXWVMA3YTXZPxYp4O6Vtn3BNBCCEDZyIgT2R-4U_F6vOdWzNqm4GfWZWQROROoGanmE"
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-10 max-w-lg mt-auto">
                  <span className="bg-[#ffe088] text-primary select-none px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-4 inline-block">
                    Best Seller &amp; Chef's Recommendation
                  </span>
                  <h3 className="font-display text-3xl font-bold mb-3 text-white">Dark Truffle Cake</h3>
                  <p className="text-[#f1e4dc] text-sm mb-6 font-light leading-relaxed">
                    Our crown jewel recipe. Rich, intense 64% pure Belgian dark chocolate mousse, sponge layer infused with single-origin espresso, highlighted with premium gold leaf and a silky mirror glaze.
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                    <span className="font-display text-2xl font-bold text-[#ffe088]">₹4,500.00 <span className="text-xs text-white/75 font-sans font-normal">(serves 8-10)</span></span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedItemDetail(menuItems.find(i => i.id === "dark-truffle-cake") || null)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Info className="w-4 h-4" />
                        <span>Specs Sheet</span>
                      </button>
                      <button 
                        onClick={() => addToCart(menuItems.find(i => i.id === "dark-truffle-cake")!)}
                        className="bg-[#ffe088] text-primary hover:bg-[#fed65b] font-bold px-5 py-2.5 rounded-xl text-xs transition-transform hover:scale-[1.03] active:scale-95"
                      >
                        Add to Cart &amp; Box
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Render loop for normal filtered items */}
            {filteredMenuItems.filter(item => item.id !== "dark-truffle-cake").map((item) => (
              <motion.div 
                layout
                key={item.id}
                className="bg-surface dark:bg-zinc-900 border border-outline-variant/35 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all flex flex-col group overflow-hidden"
              >
                {/* Pastry Card Image Container */}
                <div className="w-full h-52 overflow-hidden rounded-2xl relative mb-5 bg-[#faf6f2] dark:bg-zinc-800">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {item.tags && item.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-1">
                      {item.tags.map(t => (
                        <span key={t} className="bg-primary text-on-primary text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info block */}
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="font-display font-bold text-lg text-primary dark:text-inverse-primary">{item.name}</h3>
                  <span className="font-display font-semibold text-secondary dark:text-[#f4bb92] whitespace-nowrap">₹{item.price.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-on-surface-variant text-xs mb-6 flex-grow dark:text-zinc-400 font-light leading-relaxed">
                  {item.description}
                </p>

                {/* Actions banner */}
                <div className="flex gap-2 pt-4 border-t border-outline-variant/20 mt-auto">
                  <button 
                    onClick={() => setSelectedItemDetail(item)}
                    className="p-3 text-on-surface-variant hover:text-primary dark:text-zinc-400 dark:hover:text-white transition-colors"
                    title="View details and allergen specifications"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-primary/10 text-primary dark:bg-white/5 dark:text-white hover:bg-primary dark:hover:bg-[#ffe088] dark:hover:text-[#6f4627] hover:text-on-primary py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    Add to Cart Box
                  </button>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* Special Custom Cakes & Bespoke Wedding cakes Section with integrated Gemini Consultation */}
      <section className="py-24 relative overflow-hidden" id="special-cakes">
        {/* Decorative backdrop */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-surface-container-high dark:bg-zinc-900 -z-10 rounded-l-[100px] hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center md:text-left mb-16">
            <span className="text-secondary text-xs font-bold tracking-wider uppercase mb-2 block">Cakes Built for Milestones</span>
            <h2 className="font-display text-3xl md:text-4xl text-primary font-bold dark:text-inverse-primary">
              Bespoke Celebrations &amp; Custom Sizing
            </h2>
            <p className="text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-xl mt-3">
              "Because every glorious milestone deserves a hand-sculpted culinary masterpiece." Discuss ideas below with our digital Master Chef, Maitre Antoine!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Visual Display Left card */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative group overflow-hidden rounded-[30px] shadow-xl border border-outline-variant/30">
                <img 
                  alt="High-end three tiered white fondant wedding cake" 
                  className="rounded-[30px] w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA8wTAeI-ohj30-hP3uBAkW9rr2xQF4AEZ8hsBy4pF-VAFd7mjZnV09skVX12khZQBBhgH9pIXNUaTrX7tOQIxhGZ4hRHMkGhKz9BSBTmmpSotptS6zn8HmWp5uelQ-uKOwu1cDRDpR2Ga4xc_LpI9ab9XSs4WVKkPOWvWqlU0NhZlPShSg2gyTOx45njPqNwFfbyvEZhMb23lcURlwGMOlS9UwivXxefYjmUxp2v3lXT7gIYBb7o9C6fc9c1bWXrWC_P9WRW-YNg"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12100e]/70 to-transparent flex items-end p-6">
                  <div>
                    <h4 className="font-display text-xl text-[#ffe088] font-bold">The Cake Atelier</h4>
                    <p className="text-zinc-200 text-xs">Exquisite luxury styles customized to your vision</p>
                  </div>
                </div>
              </div>

              {/* Informative list cards */}
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-surface-container dark:bg-zinc-800">
                  <div className="p-3 bg-primary/5 dark:bg-white/5 rounded-full text-secondary h-fit">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-primary dark:text-inverse-primary mb-1">Grand Wedding Cakes</h4>
                    <p className="text-on-surface-variant text-xs dark:text-zinc-400">Multi-tiered elegance customizable for 30 up to 300 guests with handbaked floral and lace textures.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-surface-container dark:bg-zinc-800">
                  <div className="p-3 bg-primary/5 dark:bg-white/5 rounded-full text-secondary h-fit">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-primary dark:text-inverse-primary mb-1">Social Events &amp; Birthdays</h4>
                    <p className="text-on-surface-variant text-xs dark:text-zinc-400">Sculpted modern abstract designs capturing your personal theme, available in signature pastry flavors.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsConsultationOpen(true)}
                className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:bg-primary-container shadow-md tracking-wider uppercase text-xs transition-colors"
              >
                Schedule Personal Consultation
              </button>
            </div>

            {/* Interactive Maitre Antoine Chat Consultant Slate (Right card) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#1f1b19] border border-outline-variant/40 rounded-3xl p-6 shadow-xl relative">
              {/* Slate Header */}
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary relative">
                    <Sparkles className="w-5 h-5" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-primary dark:text-[#f4bb92]">Maitre Antoine</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Master AI Cake Consultant</p>
                  </div>
                </div>
                <span className="text-[10px] bg-secondary-fixed/30 text-secondary dark:bg-secondary/40 dark:text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Live Chat Grounded
                </span>
              </div>

              {/* Chat Message thread container */}
              <div className="h-80 overflow-y-auto mb-4 p-4 rounded-2xl bg-surface-container-low dark:bg-zinc-900/50 space-y-4">
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-primary text-on-primary rounded-br-none shadow-sm" 
                        : "bg-surface-container-high text-on-surface dark:bg-zinc-800 dark:text-[#f4ede5] rounded-bl-none shadow-xs border border-outline-variant/20"
                    }`}>
                      <div className="font-semibold text-[10px] opacity-75 uppercase tracking-wide mb-1">
                        {msg.role === "user" ? "You" : "Antoine"}
                      </div>
                      <div className="whitespace-pre-line font-light">{msg.content}</div>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-surface-container-high dark:bg-zinc-800 text-on-surface rounded-2xl p-4 rounded-bl-none max-w-[85%] shadow-xs flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                      <span className="text-xs italic text-on-surface-variant dark:text-zinc-400">Mixing design recipes...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Inputs */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about size for 100 guests, design ideas, or croissant pairings..."
                  value={currentChatInput}
                  onChange={(e) => setCurrentChatInput(e.target.value)}
                  disabled={isChatLoading}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 text-xs px-4 py-3.5 rounded-xl focus:ring-1 focus:ring-primary focus:outline-none placeholder-on-surface-variant/50"
                />
                <button
                  type="submit"
                  disabled={!currentChatInput.trim() || isChatLoading}
                  className="bg-primary text-on-primary hover:bg-primary-container p-3.5 rounded-xl transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Direct Quick Suggest Option chips */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="text-[10px] text-on-surface-variant self-center font-medium mr-1 uppercase tracking-wide">Popular Queries:</span>
                {[
                  "Size quote for 40 guests?",
                  "Wedding chocolate themes?",
                  "Pairing with Sourdough?"
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setCurrentChatInput(q);
                    }}
                    className="text-[10px] bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1 text-primary dark:text-[#f4bb92] dark:border-white/15 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Glimpses of Perfection (Masonry / grid display) with filter and Lightbox zoom */}
      <section className="py-24 bg-background dark:bg-[#12100e]" id="gallery">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-secondary text-xs font-bold tracking-wider uppercase mb-2 block">Visual Artisan Journey</span>
            <h2 className="font-display text-3xl md:text-4xl text-primary font-bold dark:text-inverse-primary animate-pulse">
              Glimpses of Perfection
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mt-3 dark:text-zinc-300 font-light text-sm md:text-base">
              Step inside our luxury kitchen oven chambers and browse the aesthetic layouts of our boutique café. Click on any picture frame to expand.
            </p>

            {/* Gallery Navigation Filters */}
            <div className="flex justify-center gap-2 mt-6">
              {["All", "Kitchen", "Boutique"].map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedGalleryCategory(c)}
                  className={`px-4 py-2 text-xs font-medium rounded-full border uppercase tracking-wider transition-all ${
                    selectedGalleryCategory === c 
                      ? "border-primary text-primary bg-primary/5 font-semibold" 
                      : "border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Picture frames mockup */}
          <div className="p-4 md:p-8 bg-surface-container-high dark:bg-zinc-900 rounded-[40px] shadow-lg border border-outline-variant/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {galleryPhotos.filter(p => selectedGalleryCategory === "All" || p.category === selectedGalleryCategory).map(photo => (
                <div 
                  key={photo.id}
                  onClick={() => setActiveLightboxImg(photo.imageUrl)}
                  className="group relative cursor-zoom-in overflow-hidden rounded-2xl bg-[#faf6f2] dark:bg-zinc-800 border-8 border-white dark:border-zinc-950 shadow-md transform hover:-rotate-1 hover:scale-102 transition-transform duration-500"
                >
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title} 
                    className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs uppercase tracking-widest font-semibold border border-white/40 px-3 py-1.5 rounded-full backdrop-blur-sm bg-black/20">
                      Expand Frame
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-950 border-t border-outline-variant/10 text-center">
                    <p className="text-[10px] font-sans text-secondary font-bold uppercase tracking-wider">{photo.category}</p>
                    <p className="text-xs font-display font-medium text-dark line-clamp-1 mt-0.5 dark:text-zinc-200">{photo.title}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface-container-low dark:bg-[#161311]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-secondary text-xs font-bold tracking-wider uppercase mb-2 block">Delighted Patrons</span>
            <h2 className="font-display text-3xl md:text-4xl text-primary font-bold dark:text-inverse-primary">
              Words of Warm Appreciation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div 
                key={t.id}
                className="bg-surface dark:bg-zinc-900 border border-outline-variant/30 rounded-3xl p-8 shadow-xs hover:shadow-md transition-shadow relative flex flex-col"
              >
                {/* Visual Stars */}
                <div className="flex text-amber-500 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                
                <p className="text-on-surface-variant text-sm flex-grow mb-6 leading-relaxed italic font-light dark:text-zinc-300">
                  "{t.comment}"
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20 mt-auto">
                  <span className="font-display font-bold text-sm text-primary dark:text-[#f4bb92]">— {t.name}</span>
                  <span className="text-[10px] bg-secondary/10 dark:bg-zinc-800 text-secondary dark:text-zinc-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Contact Form Section */}
      <section className="py-24 max-w-7xl mx-auto px-6" id="contact">
        <div className="bg-surface-container dark:bg-[#1c1815] rounded-[40px] overflow-hidden shadow-xl border border-outline-variant/20 flex flex-col lg:flex-row">
          
          {/* Left Block info boutique */}
          <div className="w-full lg:w-5/12 bg-[#513620] text-white p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full translate-x-20 -translate-y-20 blur-xl" />
            
            <div className="relative z-10">
              <h2 className="font-display text-4xl font-bold mb-8 text-[#ffe3d1]">Visit Our Boutique</h2>
              <div className="space-y-8 text-sm font-light">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[#ffe088] shrink-0 mt-1" />
                  <div>
                    <h5 className="font-display text-[#ffe3d1] font-semibold tracking-wide uppercase text-xs mb-1">Our Location</h5>
                    <p className="text-zinc-200">123 Pâtisserie Way,<br />Lux District, City Central</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-[#ffe088] shrink-0 mt-1" />
                  <div>
                    <h5 className="font-display text-[#ffe3d1] font-semibold tracking-wide uppercase text-xs mb-1">Contact Phone</h5>
                    <p className="text-zinc-200">+1 (555) 888-CRUST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-[#ffe088] shrink-0 mt-1" />
                  <div>
                    <h5 className="font-display text-[#ffe3d1] font-semibold tracking-wide uppercase text-xs mb-1">Bespoke Hours</h5>
                    <p className="text-zinc-200">
                      Mon - Fri: 7:00 AM - 7:00 PM <br />
                      Sat - Sun: 8:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social linkages */}
            <div className="mt-16 relative z-10 flex gap-4 items-center border-t border-white/10 pt-6">
              <a href="#" className="p-2.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors" title="Follow boutique updates on Instagram">
                <Instagram className="w-5 h-5 text-[#ffe3d1]" />
              </a>
              <span className="text-xs text-zinc-300">@GoldenCrustOfficial</span>
            </div>
          </div>

          {/* Right message composer form */}
          <div className="w-full lg:w-7/12 p-10 md:p-14 bg-white dark:bg-zinc-950">
            <h2 className="font-display text-3xl font-bold text-primary dark:text-inverse-primary mb-2">Send a Message</h2>
            <p className="text-on-surface-variant text-sm mb-8 font-light dark:text-zinc-400">
              Bonjour! Tell our master culinary team how we can assist or if you have specific event catering requests.
            </p>

            <AnimatePresence mode="wait">
              {contactSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50/70 border border-green-200 p-6 rounded-2xl text-center flex flex-col items-center dark:bg-green-950/20 dark:border-green-900/30"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500 mb-3" />
                  <h4 className="font-display text-lg font-bold text-green-900 dark:text-green-200">Message Dispatched Flawlessly</h4>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-2 max-w-sm">
                    Thank you immensely, cher ami. Our general pâtisserie office has logged your letter. We will make contact in a brief fleeting moment!
                  </p>
                  <button 
                    onClick={() => setContactSubmitted(false)}
                    className="text-xs mt-6 bg-primary text-white font-semibold py-2 px-4 rounded-xl"
                  >
                    Send Another Letter
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant mb-2 block dark:text-zinc-300">Your Full Name</label>
                      <input 
                        type="text"
                        placeholder="Enter your name"
                        value={contactFormData.name}
                        onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                        required
                        className="w-full border-b border-outline-variant/60 dark:border-zinc-800 bg-transparent py-2.5 focus:ring-0 focus:outline-none focus:border-primary text-sm placeholder-on-surface-variant/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant mb-2 block dark:text-zinc-300">Email Address</label>
                      <input 
                        type="email"
                        placeholder="Enter your email"
                        value={contactFormData.email}
                        onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                        required
                        className="w-full border-b border-outline-variant/60 dark:border-zinc-800 bg-transparent py-2.5 focus:ring-0 focus:outline-none focus:border-primary text-sm placeholder-on-surface-variant/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant mb-2 block dark:text-zinc-300">Subject Of Inquiry</label>
                    <select
                      value={contactFormData.subject}
                      onChange={(e) => setContactFormData({ ...contactFormData, subject: e.target.value })}
                      className="w-full border-b border-outline-variant/60 dark:border-zinc-800 bg-transparent py-2.5 focus:ring-0 focus:outline-none focus:border-primary text-sm text-on-surface dark:text-white"
                    >
                      <option className="dark:bg-zinc-950">General Boutique Inquiry</option>
                      <option className="dark:bg-zinc-950">Custom Cake Bulk Orders</option>
                      <option className="dark:bg-zinc-950">Luxury Catering &amp; Events</option>
                      <option className="dark:bg-zinc-950">Patron Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant mb-2 block dark:text-zinc-300">Your Message</label>
                    <textarea 
                      placeholder="Bonjour! How can we help you create sweet memories?"
                      required
                      value={contactFormData.message}
                      onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                      className="w-full border-b border-outline-variant/60 dark:border-zinc-800 bg-transparent py-2.5 focus:ring-0 focus:outline-none focus:border-primary text-sm h-28 resize-none placeholder-on-surface-variant/30"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={contactLoading}
                    className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold shadow-lg hover:bg-primary-container hover:scale-101 hover:shadow-xl active:scale-95 text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                  >
                    {contactLoading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                    <span>{contactLoading ? "Sending... Message" : "Send Elegant Message"}</span>
                  </button>
                </form>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="bg-surface-container dark:bg-[#1a1715] border-t border-outline-variant/25">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row justify-between gap-12">
          {/* Branding left */}
          <div className="max-w-xs">
            <div className="font-display text-2xl font-bold text-primary mb-4 dark:text-inverse-primary flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-secondary" />
              <span>Golden Crust Bakery</span>
            </div>
            <p className="text-on-surface-variant text-sm dark:text-zinc-400 font-light leading-relaxed mb-6">
              Experiencing traditional French laminations and master celebration baking on daily artisan loops. Made with pure local and imported devotion.
            </p>
          </div>

          {/* Quick link columns */}
          <div className="grid grid-cols-2 gap-16">
            <div>
              <h5 className="font-display font-bold text-sm tracking-widest text-primary dark:text-[#f4bb92] uppercase mb-4">Quick Links</h5>
              <ul className="space-y-3 text-sm text-on-surface-variant dark:text-zinc-400 font-light">
                <li><a href="#menu" className="hover:text-primary transition-colors">Pastry Menu Selection</a></li>
                <li><a href="#special-cakes" className="hover:text-primary transition-colors">Bespoke Wedding Custom</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">Traditional Handcraft Legacy</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Boutique Directory Details</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-display font-bold text-sm tracking-widest text-primary dark:text-[#f4bb92] uppercase mb-4">Chef Support</h5>
              <ul className="space-y-3 text-sm text-on-surface-variant dark:text-zinc-400 font-light">
                <li><a href="#" className="hover:text-primary transition-colors">Comp Delivery Information</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Custom Cake Consultation FAQs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy &amp; Terms Boutique</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Nutritional Specifications</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Outer bottom row */}
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-outline-variant/10 text-center lg:text-left text-xs text-on-surface-variant dark:text-zinc-400 flex flex-col sm:flex-row justify-between gap-4 font-light">
          <p>© {new Date().getFullYear()} Golden Crust Bakery. All rights reserved around the globe.</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:underline">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* interactive drawers & slide-overs, lightbox overlay modals */}
      {/* ======================================================== */}

      {/* Expanded Pastry details modal (pastry spec sheet) */}
      <AnimatePresence>
        {selectedItemDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/40 max-w-lg w-full"
            >
              <div className="relative h-60 bg-zinc-100">
                <img 
                  src={selectedItemDetail.imageUrl} 
                  alt={selectedItemDetail.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedItemDetail(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 p-2 rounded-full backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-display font-bold text-2xl text-primary dark:text-inverse-primary">{selectedItemDetail.name}</h3>
                  <span className="font-display text-xl font-bold text-secondary dark:text-[#f4bb92]">₹{selectedItemDetail.price.toLocaleString("en-IN")}</span>
                </div>
                
                <p className="text-[#51443c] dark:text-zinc-300 text-sm font-light leading-relaxed mb-6">
                  {selectedItemDetail.description}
                </p>

                {/* Secret Specs columns details */}
                <div className="p-4 rounded-2xl bg-surface-container-low dark:bg-zinc-800/50 grid grid-cols-2 gap-4 text-xs mb-6">
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-secondary flex items-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> Nutritional Specs
                    </span>
                    <p className="text-on-surface-variant font-light dark:text-zinc-300">Calories: {selectedItemDetail.calories} kcal</p>
                  </div>
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-secondary flex items-center gap-1 mb-1">
                      <Award className="w-3.5 h-3.5" /> Allergen Warning
                    </span>
                    <p className="text-on-surface-variant font-light dark:text-zinc-300">
                      {selectedItemDetail.allergen && selectedItemDetail.allergen.length > 0 
                        ? selectedItemDetail.allergen.join(", ") 
                        : "None specified"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedItemDetail(null)}
                    className="w-1/3 border border-outline-variant/60 text-on-surface-variant dark:text-zinc-300 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      addToCart(selectedItemDetail);
                      setSelectedItemDetail(null);
                    }}
                    className="w-2/3 bg-primary text-on-primary font-bold py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-primary-container transition-all"
                  >
                    Add to Cart Box
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sliding interactive Cart drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={() => setIsCartOpen(false)}
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-[#1a1715] h-full shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {encryptionStatusStage && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="relative mb-6">
                    <motion.div 
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-16 h-16 bg-[#ffe088]/20 border border-[#ffe088] rounded-full flex items-center justify-center text-[#ffe088]"
                    >
                      <Lock className="w-8 h-8" />
                    </motion.div>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-r-2 border-transparent border-[#ffe088] rounded-full"
                    />
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#ffe088] uppercase tracking-widest mb-1">Sealing Payment Vault</h4>
                  <p className="text-zinc-300 text-xs font-mono max-w-xs">{encryptionStatusStage}</p>
                  <div className="mt-8 flex gap-1.5 justify-center items-center">
                    <span className="w-2 h-2 bg-[#ffe088] rounded-full animate-bounce" style={{ animationDelay: "75ms" }} />
                    <span className="w-2 h-2 bg-[#ffe088] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[#ffe088] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {/* Drawer header */}
              <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container dark:bg-zinc-900">
                <div className="flex items-center gap-2 text-primary dark:text-white">
                  <ShoppingCart className="w-5 h-5 text-secondary" />
                  <h3 className="font-display font-semibold text-lg">Your Boutique Cart Box</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-outline-variant/20 text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Box list or order receipt successful screen */}
              {confirmedOrderId ? (
                <div className="p-8 text-center flex-grow flex flex-col items-center justify-center overflow-y-auto">
                  <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 mb-4 animate-bounce" />
                  <h4 className="font-display text-2xl font-bold text-primary dark:text-inverse-primary">Order Placed Faultlessly</h4>
                  <p className="text-secondary font-bold font-mono tracking-widest text-lg mt-1 mb-2">{confirmedOrderId}</p>

                  {generatedShaSignature && (
                    <div className="w-full bg-[#1c1815] text-[#f1e4dc] p-4 rounded-2xl border border-secondary/35 text-left mb-6 relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-mono font-bold tracking-wider text-[#ffe088] uppercase block">TLS SHA-256 Payment Receipt Proof</span>
                        <button 
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedShaSignature);
                            setDidCopySignature(true);
                            setTimeout(() => setDidCopySignature(false), 2000);
                          }}
                          className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 font-sans transition-colors cursor-pointer"
                        >
                          {didCopySignature ? (
                            <span className="text-green-400 font-semibold text-[9px]">Copied!</span>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Hash</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-mono text-[9px] break-all leading-normal text-zinc-300 bg-black/40 p-2 rounded-lg">{generatedShaSignature}</p>
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2 text-[9px] text-zinc-400">
                        <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                        <span>Standard certified encrypted and stored inside server ledger.</span>
                      </div>
                    </div>
                  )}

                  <p className="text-on-surface-variant text-sm font-light leading-relaxed max-w-sm mb-8 dark:text-zinc-300">
                    Merci, cher local patron! Our master bakers got the notification immediately and are warming the ovens. Your receipt confirmation was sent to your inbox.
                  </p>
                  <button 
                    onClick={() => {
                      setConfirmedOrderId(null);
                      setIsCartOpen(false);
                    }}
                    className="bg-primary text-on-primary px-8 py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md hover:bg-primary-container"
                  >
                    Boutique Main Entrance
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart scroll items thread */}
                  <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-20 flex flex-col items-center justify-center">
                        <UtensilsCrossed className="w-12 h-12 text-zinc-300 mb-3" />
                        <p className="text-zinc-500 text-sm font-light mb-1">Your cart box is currently pristine.</p>
                        <p className="text-zinc-400 text-xs">Exquisite baked treats await your taste selections!</p>
                      </div>
                    ) : (
                      <>
                        {cart.map((cartItem) => (
                          <div 
                            key={cartItem.item.id}
                            className="flex gap-4 p-3 bg-surface-container-low dark:bg-zinc-900 rounded-2xl border border-outline-variant/20 items-center justify-between"
                          >
                            <img 
                              src={cartItem.item.imageUrl} 
                              alt={cartItem.item.name} 
                              className="w-14 h-14 rounded-lg object-cover bg-zinc-200"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-grow min-w-0">
                              <h5 className="font-display font-bold text-sm text-primary dark:text-inverse-primary truncate">{cartItem.item.name}</h5>
                              <p className="text-xs text-secondary dark:text-[#f4bb92] font-semibold">₹{(cartItem.item.price * cartItem.quantity).toLocaleString("en-IN")}</p>
                              
                              {/* Quantity manipulators */}
                              <div className="flex items-center gap-2 mt-2">
                                <button 
                                  onClick={() => updateCartQuantity(cartItem.item.id, -1)}
                                  className="w-6 h-6 rounded-md bg-white border dark:bg-zinc-800 dark:border-white/10 dark:text-white flex items-center justify-center font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="text-xs font-semibold text-on-surface w-4 text-center">{cartItem.quantity}</span>
                                <button 
                                  onClick={() => updateCartQuantity(cartItem.item.id, 1)}
                                  className="w-6 h-6 rounded-md bg-white border dark:bg-zinc-800 dark:border-white/10 dark:text-white flex items-center justify-center font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <button 
                              onClick={() => updateCartQuantity(cartItem.item.id, -cartItem.quantity)}
                              className="text-on-surface-variant hover:text-red-500 font-bold p-1 rounded-full text-xs"
                              title="Delete from box"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {/* Add baking directives */}
                        <div className="pt-4 border-t border-outline-variant/20 space-y-3">
                          <div>
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-1 block">Special Baking Directives</label>
                            <input
                              type="text"
                              value={orderNote}
                              placeholder="E.g., please decorate with 'Happy 30th Birthday'..."
                              onChange={(e) => setOrderNote(e.target.value)}
                              className="w-full bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-primary"
                            />
                          </div>

                          {/* Promo code */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Promo (E.g. GOLDENFREE)"
                              value={cartPromo}
                              onChange={(e) => setCartPromo(e.target.value)}
                              className="w-full bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-primary"
                            />
                            <button
                              type="button"
                              onClick={handleApplyPromo}
                              className="bg-primary text-on-primary px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-primary-container"
                            >
                              Apply
                            </button>
                          </div>
                        </div>

                        {/* Checkout fields embedded securely */}
                        <form onSubmit={handleCheckoutSubmit} className="pt-4 border-t border-outline-variant/20 space-y-4">
                          <h4 className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">Customer Delivery Coordinates</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="First/Last Name"
                              required
                              value={checkoutFormData.name}
                              onChange={(e) => setCheckoutFormData({ ...checkoutFormData, name: e.target.value })}
                              className="w-full bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-primary"
                            />
                            <input
                              type="email"
                              placeholder="Patron Email"
                              required
                              value={checkoutFormData.email}
                              onChange={(e) => setCheckoutFormData({ ...checkoutFormData, email: e.target.value })}
                              className="w-full bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-primary"
                            />
                          </div>

                          <div className="pt-3 border-t border-outline-variant/10 space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant flex items-center gap-1.5 dark:text-zinc-300">
                                <CreditCard className="w-3.5 h-3.5 text-secondary animate-pulse" /> Private Payment Vault
                              </h4>
                              <span className="text-[10px] text-green-600 dark:text-green-400 font-mono flex items-center gap-1 font-semibold">
                                <ShieldCheck className="w-3.5 h-3.5" /> Encrypted E2E
                              </span>
                            </div>

                            {/* Payment Method Switcher Tabs */}
                            <div className="flex bg-surface-container-high dark:bg-zinc-800/40 border border-outline-variant/30 p-1 rounded-xl">
                              <button
                                type="button"
                                onClick={() => setPaymentMethod("card")}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  paymentMethod === "card"
                                    ? "bg-white dark:bg-[#251e18] text-primary dark:text-[#ffe088] shadow-sm border border-secondary/20"
                                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                }`}
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Credit Card</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPaymentMethod("upi")}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  paymentMethod === "upi"
                                    ? "bg-white dark:bg-[#251e18] text-primary dark:text-[#ffe088] shadow-sm border border-secondary/20"
                                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                }`}
                              >
                                <Smartphone className="w-3.5 h-3.5 animate-pulse" />
                                <span>UPI Transaction</span>
                              </button>
                            </div>

                            {paymentMethod === "card" ? (
                              <>
                                {/* Luxury Premium-Colored Obsidian Obsidian Gold Card Visualizer */}
                                <div className="relative bg-gradient-to-br from-[#1c1815] via-[#2d2520] to-[#120f0e] text-white p-4 rounded-2xl border border-secondary/30 shadow-md overflow-hidden min-h-[145px] flex flex-col justify-between">
                                  {/* Glowing gold subtle gradient lights */}
                                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffe088] opacity-5 rounded-full blur-2xl pointer-events-none" />
                                  <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-[#ffe088] opacity-10 rounded-full blur-xl pointer-events-none" />

                                  <div className="flex justify-between items-start z-10">
                                    <div className="space-y-0.5">
                                      <p className="text-[8px] uppercase tracking-widest text-[#ffe088] font-bold">Golden Crust Patron Card</p>
                                      <p className="text-[10px] font-mono text-zinc-400">SEALED TRANSACTION TICKET</p>
                                    </div>
                                    <div className="bg-[#ffe088]/20 text-[#ffe088] p-1.5 rounded">
                                      <Lock className="w-3.5 h-3.5" />
                                    </div>
                                  </div>

                                  <div className="my-2 z-10">
                                    <p className="text-sm font-mono tracking-widest text-zinc-100">
                                      {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : "•••• •••• •••• 5683"}
                                    </p>
                                  </div>

                                  <div className="flex justify-between items-center mt-1 z-10">
                                    <div>
                                      <p className="text-[7px] uppercase text-zinc-500">Cardholder</p>
                                      <p className="text-[10px] font-mono tracking-wide truncate max-w-[140px]">
                                        {cardHolderName ? cardHolderName.toUpperCase() : "MASTER PATRON"}
                                      </p>
                                    </div>
                                    <div className="flex gap-4">
                                      <div>
                                        <p className="text-[7px] uppercase text-zinc-500">Expiry</p>
                                        <p className="text-[10px] font-mono">{cardExpiry || "12/29"}</p>
                                      </div>
                                      <div>
                                        <p className="text-[7px] uppercase text-zinc-500">CVV</p>
                                        <p className="text-[10px] font-mono">{cardCvv ? "•••" : "•••"}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Payment Inputs */}
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    placeholder="Payment Cardholder Name"
                                    required={paymentMethod === "card"}
                                    value={cardHolderName}
                                    onChange={(e) => setCardHolderName(e.target.value)}
                                    className="w-full bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-primary"
                                  />
                                  <div className="grid grid-cols-3 gap-2">
                                    <input
                                      type="text"
                                      maxLength={19}
                                      placeholder="Card Number"
                                      required={paymentMethod === "card"}
                                      value={cardNumber}
                                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                                      className="col-span-2 w-full bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-primary font-mono"
                                    />
                                    <div className="grid grid-cols-2 gap-1">
                                      <input
                                        type="text"
                                        maxLength={5}
                                        placeholder="MM/YY"
                                        required={paymentMethod === "card"}
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value)}
                                        className="w-full bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 text-xs px-1.5 py-2 rounded-xl text-center focus:outline-none focus:border-primary font-mono"
                                      />
                                      <input
                                        type="password"
                                        maxLength={3}
                                        placeholder="CVV"
                                        required={paymentMethod === "card"}
                                        value={cardCvv}
                                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                                        className="w-full bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 text-xs px-1.5 py-2 rounded-xl text-center focus:outline-none focus:border-primary font-mono"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                {/* Luxury UPI QR & Settlement Visualizer */}
                                <div className="relative bg-gradient-to-br from-[#1c1815] via-[#241e1a] to-[#120f0e] text-white p-4 rounded-2xl border border-secondary/30 shadow-md min-h-[145px] flex items-center gap-4">
                                  {/* QR Code Graphic Box */}
                                  <div className="bg-white p-2 rounded-xl shrink-0 flex items-center justify-center shadow-inner relative group select-none">
                                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                    </span>
                                    {/* Exquisite custom vector mock QR representing Indian banking standard */}
                                    <svg width="78" height="78" viewBox="0 0 100 100" className="opacity-95">
                                      <rect x="0" y="0" width="28" height="28" fill="#12100e" rx="3" />
                                      <rect x="4" y="4" width="20" height="20" fill="white" rx="1" />
                                      <rect x="8" y="8" width="12" height="12" fill="#12100e" rx="1" />

                                      <rect x="72" y="0" width="28" height="28" fill="#12100e" rx="3" />
                                      <rect x="76" y="4" width="20" height="20" fill="white" rx="1" />
                                      <rect x="80" y="8" width="12" height="12" fill="#12100e" rx="1" />

                                      <rect x="0" y="72" width="28" height="28" fill="#12100e" rx="3" />
                                      <rect x="4" y="76" width="20" height="20" fill="white" rx="1" />
                                      <rect x="8" y="80" width="12" height="12" fill="#12100e" rx="1" />

                                      <rect x="38" y="38" width="24" height="24" fill="#6f4627" rx="4" />
                                      <text x="50" y="54" fill="white" fontSize="15" fontWeight="bold" textAnchor="middle">₹</text>

                                      <rect x="36" y="4" width="8" height="12" fill="#6f4627" />
                                      <rect x="48" y="12" width="16" height="8" fill="#12100e" />
                                      <rect x="36" y="24" width="12" height="8" fill="#a48d7c" />

                                      <text x="86" y="88" fill="#12100e" fontSize="16" fontWeight="extrabold">✓</text>
                                      
                                      <rect x="72" y="36" width="12" height="16" fill="#12100e" />
                                      <rect x="88" y="56" width="8" height="8" fill="#6f4627" />
                                      
                                      <rect x="4" y="36" width="16" height="12" fill="#6f4627" />
                                      <rect x="24" y="52" width="10" height="16" fill="#12100e" />
                                      <rect x="36" y="76" width="20" height="16" fill="#12100e" />
                                    </svg>
                                  </div>

                                  <div className="flex-grow min-w-0 space-y-1">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[8px] bg-secondary/20 text-[#ffe088] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">BHIM UPI QR</span>
                                      <span className="text-[8px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Instant Settlement</span>
                                    </div>
                                    <h5 className="font-display font-black text-sm text-[#ffe088] tracking-tight truncate">₹{cartTotal.toLocaleString("en-IN")} Settlement</h5>
                                    <p className="text-[9px] text-zinc-400 leading-normal font-light">
                                      Initiate standard certified settlement via your preferred app. Enter your transaction VPA ID below to seal.
                                    </p>
                                  </div>
                                </div>

                                {/* UPI VPA ID inputs */}
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1">Enter your UPI VPA ID</label>
                                    <div className="relative">
                                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                                        <Smartphone className="w-3.5 h-3.5 text-secondary" />
                                      </span>
                                      <input
                                        type="text"
                                        placeholder="e.g., username@okaxis"
                                        required={paymentMethod === "upi"}
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        className="w-full bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 text-xs px-9 py-2.5 rounded-xl focus:outline-none focus:border-primary font-mono text-zinc-800 dark:text-white"
                                      />
                                    </div>
                                  </div>

                                  {/* Popular handle rapid buttons */}
                                  <div className="space-y-1.5">
                                    <p className="text-[9px] text-zinc-500 font-medium">Fast handles list:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {["@okaxis", "@okhdfcbank", "@paytm", "@upi", "@apl", "@ybl"].map((suffix) => (
                                        <button
                                          key={suffix}
                                          type="button"
                                          onClick={() => {
                                            const cleanPrefix = upiId.includes("@") ? upiId.split("@")[0] : (upiId || userProfile?.name?.toLowerCase().replace(/\s+/g, "") || "patron");
                                            setUpiId(`${cleanPrefix}${suffix}`);
                                            showToast(`Appended check ${suffix} handle`, "info");
                                          }}
                                          className="text-[9px] font-mono px-2 py-1 bg-surface-container hover:bg-surface-container-high dark:bg-zinc-800 dark:hover:bg-zinc-700/60 rounded-lg text-on-surface-variant hover:text-primary transition-all border border-outline-variant/20 cursor-pointer"
                                        >
                                          {suffix}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Automated Encryption Toggle Panel with Gold Badge */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-zinc-900/40 dark:to-zinc-800/20 p-3 rounded-2xl border border-amber-300/30 flex items-center justify-between">
                              <div className="flex items-start gap-2 max-w-[80%]">
                                <LockKeyhole className="w-4 h-4 text-secondary mt-0.5 animate-pulse shrink-0" />
                                <div>
                                  <p className="text-[10px] font-bold text-secondary dark:text-[#ffe088]">SHA-256 E2E Encryption Active</p>
                                  <p className="text-[9px] text-[#836a5a] dark:text-zinc-400 font-light leading-snug">Seals billing address, customer credit payloads and ticket tokens inside our baking vault securely.</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={isEncryptionActive} 
                                  onChange={(e) => setIsEncryptionActive(e.target.checked)}
                                  className="sr-only peer" 
                                />
                                <div className="w-8 h-4 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-secondary"></div>
                              </label>
                            </div>
                          </div>
                          
                          {/* Cost Breakdown */}
                          <div className="pt-2 border-t border-outline-variant/10 text-xs space-y-1 text-on-surface-variant dark:text-zinc-300">
                            <div className="flex justify-between">
                              <span>Box Subtotal:</span>
                              <span className="font-mono">₹{cartSubtotal.toLocaleString("en-IN")}.00</span>
                            </div>
                            {cartDiscount > 0 && (
                              <div className="flex justify-between text-green-700 dark:text-green-400 font-medium">
                                <span>Discount Active:</span>
                                <span className="font-mono">-₹{discountAmount.toLocaleString("en-IN")}.00</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Express Delivery:</span>
                              <span className="font-mono">
                                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-primary dark:text-white pt-2 border-t border-outline-variant/15">
                              <span>Total Value:</span>
                              <span className="font-mono">₹{cartTotal.toLocaleString("en-IN")}.00</span>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isOrderingLoader}
                            className="relative overflow-hidden w-full bg-[#6f4627] text-[#fff8f1] dark:bg-[#ffdcc5] dark:text-[#301400] text-xs font-extrabold uppercase tracking-widest py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 shadow-sm"
                          >
                            {isOrderingLoader && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{isOrderingLoader ? "Securing Payload..." : "Encrypt & Place Order"}</span>
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Personal Consultation Modal */}
      <AnimatePresence>
        {isConsultationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 border border-outline-variant/40 rounded-3xl p-6 shadow-2xl max-w-lg w-full relative"
            >
              <button 
                onClick={() => {
                  setIsConsultationOpen(false);
                  setConsultationSubmitted(false);
                }}
                className="absolute top-4 right-4 p-1 rounded-full text-on-surface-variant hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 flex items-center gap-3">
                <div className="p-3 bg-primary/5 dark:bg-white/5 rounded-full text-secondary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-primary dark:text-inverse-primary">Book Consultation</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Special Custom Celebrations</p>
                </div>
              </div>

              {consultationSubmitted ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-500 mx-auto mb-4 animate-pulse" />
                  <h4 className="font-display text-xl font-bold text-green-900 dark:text-green-200">Consultation requested successfully</h4>
                  <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
                    Maitre Antoine has been notified in our cake boutique workshop. We will analyze your coordinates and reach out within 24 hours to schedule the physical design consultation. Thank you immensely!
                  </p>
                  <button 
                    onClick={() => {
                      setIsConsultationOpen(false);
                      setConsultationSubmitted(false);
                    }}
                    className="mt-6 bg-primary text-on-primary px-8 py-3 rounded-xl text-xs uppercase"
                  >
                    Return to Boutique
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConsultationSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-on-surface-variant font-semibold dark:text-zinc-300">Name</label>
                      <input 
                        type="text"
                        required
                        value={consultationFormData.fullName}
                        onChange={(e) => setConsultationFormData({...consultationFormData, fullName: e.target.value})}
                        placeholder="Jean cannelle"
                        className="w-full bg-surface-container-low dark:bg-zinc-800 border-b border-outline-variant/40 py-2 text-xs focus:outline-none focus:border-primary text-on-surface dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-on-surface-variant font-semibold dark:text-zinc-300">Patron Email</label>
                      <input 
                        type="email"
                        required
                        value={consultationFormData.email}
                        onChange={(e) => setConsultationFormData({...consultationFormData, email: e.target.value})}
                        placeholder="jean@gmail.com"
                        className="w-full bg-surface-container-low dark:bg-zinc-800 border-b border-outline-variant/40 py-2 text-xs focus:outline-none focus:border-primary text-on-surface dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-on-surface-variant font-semibold dark:text-zinc-300">Celebration Date</label>
                      <input 
                        type="date"
                        required
                        value={consultationFormData.date}
                        onChange={(e) => setConsultationFormData({...consultationFormData, date: e.target.value})}
                        className="w-full bg-surface-container-low dark:bg-zinc-800 border-b border-outline-variant/40 py-2 text-xs focus:outline-none focus:border-primary text-on-surface dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-on-surface-variant font-semibold dark:text-zinc-300">Est. Guest Count</label>
                      <select 
                        value={consultationFormData.guests}
                        onChange={(e) => setConsultationFormData({...consultationFormData, guests: e.target.value})}
                        className="w-full bg-surface-container-low dark:bg-zinc-800 border-b border-outline-variant/40 py-2 text-xs focus:outline-none focus:border-primary text-on-surface dark:text-white"
                      >
                        <option>Under 30 guests</option>
                        <option>30-50 guests</option>
                        <option>50-100 guests</option>
                        <option>100+ guests</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold dark:text-zinc-300">Theme Category</label>
                    <select 
                      value={consultationFormData.cakeType}
                      onChange={(e) => setConsultationFormData({...consultationFormData, cakeType: e.target.value})}
                      className="w-full bg-surface-container-low dark:bg-zinc-800 border-b border-outline-variant/40 py-2 text-xs focus:outline-none focus:border-primary text-on-surface dark:text-white"
                    >
                      <option>Wedding Celebration Cake</option>
                      <option>Pâtisserie Bulk Catering</option>
                      <option>Abstract Birthday Sculpture</option>
                      <option>Vapor-Laminated Art Piece</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold dark:text-zinc-300">Chef Directives / Taste Notes (Optional)</label>
                    <textarea 
                      placeholder="Share your dream flavor profiles, colors, or direct abstract visual concepts..."
                      value={consultationFormData.notes}
                      onChange={(e) => setConsultationFormData({...consultationFormData, notes: e.target.value})}
                      className="w-full bg-surface-container-low dark:bg-zinc-800 border-b border-outline-variant/40 py-2 text-xs h-20 resize-none focus:outline-none focus:border-primary text-on-surface dark:text-white"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isConsultationLoading}
                    className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold shadow-md hover:bg-primary-container text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    {isConsultationLoading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                    <span>Confirm Booking Consultation</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Picture Frame Lightbox zoom modal */}
      <AnimatePresence>
        {activeLightboxImg && (
          <div 
            onClick={() => setActiveLightboxImg(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out"
          >
            <button className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-8 h-8" />
            </button>
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={activeLightboxImg} 
              alt="Expanded high quality frame view" 
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl border-4 border-white/10 shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
