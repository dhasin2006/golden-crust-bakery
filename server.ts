import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Simple JSON Database File Configuration
const DB_FILE = path.join(process.cwd(), "gourmet-db.json");

interface DBStructure {
  orders: any[];
  consultations: any[];
  messages: any[];
}

// Ensure the local database file exists and is populated
async function readDB(): Promise<DBStructure> {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    const initial: DBStructure = {
      orders: [
        {
          orderId: "GC-719320",
          customerName: "Audrey Hepburn",
          email: "audrey@hollywood.com",
          items: [{ id: "p1", name: "Artisanal Croissant", qty: 4 }, { id: "p2", name: "Silky Parisian Macarons (6x)", qty: 2 }],
          total: 3800,
          notes: "Complimentary champagne pairing requested.",
          paymentMethod: "card",
          status: "Order Secured & Sealed",
          createdAt: new Date(Date.now() - 30 * 1000).toISOString(),
        },
        {
          orderId: "GC-125690",
          customerName: "Jean-Luc Godard",
          email: "godard@cinema.fr",
          items: [{ id: "s1", name: "Artisan Sourdough Loaf", qty: 2 }],
          total: 1200,
          notes: "Please pack inside the gold-flecked luxury box.",
          paymentMethod: "upi",
          status: "Heated in Stone Hearth",
          createdAt: new Date(Date.now() - 150 * 1000).toISOString(),
        }
      ],
      consultations: [
        {
          consultationId: "CONS-4921",
          fullName: "Charlotte Gainsbourg",
          email: "charlotte@gainsbourg.fr",
          date: "2026-06-25",
          cakeType: "Wedding Cake",
          guests: "50-100 guests",
          notes: "Looking for a rich Madagascar bourbon vanilla with gold-drape piping.",
          createdAt: new Date().toISOString()
        }
      ],
      messages: [
        {
          name: "Marcello Mastroianni",
          email: "marcello@cinecitta.it",
          subject: "Adoration of Macarons",
          message: "The pistachio macarons are a celestial dream. Absolute perfection, Maitre Antoine!",
          createdAt: new Date().toISOString()
        }
      ]
    };
    await fs.writeFile(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

async function writeDB(data: DBStructure) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}


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

  // ============================================
  // DATABASE AND BACKEND ENDPOINTS (Gourmet DB File-based Storage)
  // ============================================

  // Admin Console Endpoint - Retrieve full database view & server diagnostics
  app.get("/api/admin/db", async (req, res) => {
    try {
      const db = await readDB();
      const uptime = process.uptime();
      res.json({
        success: true,
        stats: {
          uptimeLabel: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
          dbSizeKB: Math.round(JSON.stringify(db).length / 10.24) / 100, // DB size on disk approximation
          totalOrders: db.orders.length,
          totalConsultations: db.consultations.length,
          totalMessages: db.messages.length
        },
        collections: db
      });
    } catch (err: any) {
      res.status(500).json({ error: "Could not read Golden Crust persistent records: " + err.message });
    }
  });

  // Admin Console Endpoint - Update an order's prep status or tracking step
  app.post("/api/admin/orders/update-status", async (req, res) => {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ error: "Missing orderId or updated status parameter." });
    }

    try {
      const db = await readDB();
      const targetId = orderId.toUpperCase().trim();
      const orderIndex = db.orders.findIndex(o => o.orderId === targetId);

      if (orderIndex === -1) {
        return res.status(404).json({ error: "Specified order signature not found in database." });
      }

      db.orders[orderIndex].status = status;
      await writeDB(db);
      console.log(`[Order State Shifted] ${targetId} -> "${status}"`);
      res.json({ success: true, message: `Order ${targetId} successfully shifted to "${status}" in database logs.` });
    } catch (err: any) {
      res.status(500).json({ error: "Database state modification failed: " + err.message });
    }
  });

  // Admin Console Endpoint - Reset entire file DB back to seeded templates
  app.post("/api/admin/db/reset", async (req, res) => {
    try {
      await fs.unlink(DB_FILE).catch(() => {});
      const db = await readDB();
      console.log("[Database Reset Active] Records cleared and seed templates updated.");
      res.json({ success: true, message: "Hearth records safely refreshed to pristine default templates.", collections: db });
    } catch (err: any) {
      res.status(500).json({ error: "Failed resetting database files: " + err.message });
    }
  });

  // Orders Submission API
  app.post("/api/orders", async (req, res) => {
    const { items, total, customerName, email, notes, encryptedSignature, paymentMethod, upiId } = req.body;
    if (!items || !total) {
      return res.status(400).json({ error: "Invalid order details" });
    }

    try {
      const db = await readDB();
      const orderId = `GC-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder = {
        orderId,
        customerName: customerName || "Boutique Guest",
        email: email || "guest@goldencrust.com",
        items,
        total,
        notes: notes || "",
        paymentMethod,
        upiId,
        encryptedSignature: encryptedSignature || "",
        status: "Order Secured & Sealed", // Initial milestone
        createdAt: new Date().toISOString(),
      };

      db.orders.unshift(newOrder); // Newest at the top
      await writeDB(db);

      console.log(`[Order Logged inside DB] ${orderId}:`, newOrder);
      res.json({ 
        success: true, 
        orderId, 
        message: "Our master bakers have received your request and started preparations with absolute devotion!" 
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to persist order in database: " + err.message });
    }
  });

  // Get active order details for tracking (Searches inside gourmet JSON Database)
  app.get("/api/orders/:orderId", async (req, res) => {
    const orderId = req.params.orderId.trim().toUpperCase();
    try {
      const db = await readDB();
      const order = db.orders.find(o => o.orderId === orderId);
      if (!order) {
        return res.status(404).json({ error: "Artisanal order not found in our hearth logs. Crucial: check your Order ID spelling!" });
      }
      res.json({
        success: true,
        order
      });
    } catch (err: any) {
      res.status(500).json({ error: "Database look-up failure: " + err.message });
    }
  });

  // Custom Consultation submissions
  app.post("/api/consultations", async (req, res) => {
    const { fullName, email, date, cakeType, guests, notes } = req.body;
    const consultationId = `CONS-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const db = await readDB();
      const newConsultation = {
        consultationId,
        fullName: fullName || "Anonymous Patron",
        email: email || "guest@goldencrust.com",
        date: date || new Date().toISOString().split("T")[0],
        cakeType: cakeType || "Celebration Cake",
        guests,
        notes: notes || "",
        createdAt: new Date().toISOString()
      };

      db.consultations.unshift(newConsultation);
      await writeDB(db);

      console.log(`[Consultation Saved to DB] ${consultationId}:`, newConsultation);
      res.json({
        success: true,
        consultationId,
        message: "Your luxury dessert consultation has been requested. Maitre Antoine is preparing the design palette!"
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to save consultation request: " + err.message });
    }
  });

  // Contact Message submission
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
      const db = await readDB();
      const newMessage = {
        name,
        email,
        subject,
        message,
        createdAt: new Date().toISOString()
      };

      db.messages.unshift(newMessage);
      await writeDB(db);

      console.log(`[Contact message saved to DB]`, newMessage);
      res.json({
        success: true,
        message: "Bonjour! Your elegant message has been safely received. We will respond within a fleeting moment."
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to submit customer message: " + err.message });
    }
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
