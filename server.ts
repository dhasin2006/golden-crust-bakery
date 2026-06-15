import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize server-side Gemini API client with required User-Agent
let ai: GoogleGenAI | null = null;
try {
  const key = process.env.GEMINI_API_KEY;
  if (key) {
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY environment variable is not defined.");
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI client:", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse body content
  app.use(express.json());

  // API endpoints FIRST

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Bespoke Cake Consultant and Food Pairing Chatbot using Gemini API
  app.post("/api/gemini/consultation", async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid payload: 'messages' array is required." });
    }

    if (!ai) {
      return res.status(503).json({ 
        error: "Gemini AI service is currently unavailable. No API key configured." 
      });
    }

    try {
      // Build conversation structures appropriate for GoogleGenAI SDK
      // We translate the request messages into contents format
      const genAiMessages = messages.map((m: any) => {
        return {
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        };
      });

      const systemInstruction = `You are "Maitre Antoine", the premier master Pâtissier and Bespoke Cake Designer at Golden Crust Boutique (a high-end, luxury Parisian bakery). 
Your demeanor is warm, excessively polite, sophisticated, and deeply passionate about baking, flour varieties, fine European butter (AOC), chocolate cocoa percentages, and culinary artistry. 
Use subtle baker metaphors and elegant terminology, e.g., "Ah, a splendid selection!", "such delicate layers", "perfectly fermented crumb".

Primary Tasks:
1. Guide guests through customization of luxury tier cakes. Suggest rich fillings, designs, and gold leaf additions based on guest count and favorite flavors.
2. Formulate pairing recommendations. (For example, recommend which warm coffee, Champagne, or specialty tea goes beautifully with a specific pastry like a 24-layer buttery Croissant or a box of almond Macarons).
3. Frame recommendations around our products:
   - Croissants (₹350.00)
   - Macarons (₹1,200.00 - box of 6)
   - Dark Truffle Cake (₹4,500.00 - 64% Belgian chocolate layered with silky ganache and gold leaf)
   - Artisan Sourdough Bread (₹600.00)
   - Royal Red Velvet (₹450.00)
   - Wedding Cakes (Bespoke - multi-tiered elegance starting from ₹28,000)
   - Celebration & Birthday Cakes (custom starting from ₹9,500)
4. For custom tier cakes: Give a polite approximate quote back:
   - 1-tier cake (serves 15-20): ~₹9,500+
   - 2-tier cake (serves 30-40): ~₹18,000+
   - 3-tier cake (serves 60-80): ~₹32,000+
   - Flavour options: Dark Cocoa Truffle, Madagascar Bourbon Vanilla, Raspberry Pistachio Ribbon, Lemon Elderflower, Toasted Hazelnut Praliné.

Respond in well-structured, scannable paragraphs with elegant bullet points if necessary. Keep responses friendly, upscale, concise, and focused on custom boutique bakery hospitality. Let's make every response feel like a luxury experience. Every quote should be framed strictly in Indian Rupees (₹).`;

      // Since we want to use chats/generateContent, we will use ai.models.generateContent
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: genAiMessages,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || "I apologize, cher ami, but my creative oven timed out. Let us try again!";
      res.json({ content: text });
    } catch (error: any) {
      console.error("Gemini AI API Error:", error);
      res.status(500).json({ 
        error: "Our artisanal AI generator is feeling slightly overly-baked. Specifically: " + (error?.message || "Internal GenAI error") 
      });
    }
  });

  // Mock Orders API
  app.post("/api/orders", (req, res) => {
    const { items, total, customerName, email, notes, encryptedSignature } = req.body;
    if (!items || !total) {
      return res.status(400).json({ error: "Invalid order details" });
    }
    const orderId = `GC-${Math.floor(100000 + Math.random() * 900000)}`;
    console.log(`[Order Received] ${orderId}:`, { customerName, email, items, total, notes, encryptedSignature });
    res.json({ 
      success: true, 
      orderId, 
      message: "Our master bakers have received your request and started preparations with absolute devotion!" 
    });
  });

  // Custom Consultation submissions
  app.post("/api/consultations", (req, res) => {
    const { fullName, email, date, cakeType, guests, notes } = req.body;
    const consultationId = `CONS-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log(`[Consultation Request] ${consultationId}:`, { fullName, email, date, cakeType, guests, notes });
    res.json({
      success: true,
      consultationId,
      message: "Your luxury dessert consultation has been requested. Maitre Antoine is preparing the design palette!"
    });
  });

  // Contact Message submission
  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log(`[Message Sent]`, { name, email, subject, message });
    res.json({
      success: true,
      message: "Bonjour! Your elegant message has been safely received. We will respond within a fleeting moment."
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
