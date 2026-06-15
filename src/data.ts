import { MenuItem, Testimonial, GalleryPhoto } from "./types";

export const menuItems: MenuItem[] = [
  {
    id: "croissant",
    name: "Artisanal Croissant",
    price: 350.00,
    description: "Traditional 24-layer flaky pastry made with premium French Charentes-Poitou AOC butter. Crispy exterior, airy honeycomb interior.",
    category: "pastry",
    imageUrl: "/src/assets/images/artisanal_croissants_1781508659092.jpg",
    tags: ["Classic", "Butter"],
    calories: 280,
    allergen: ["Wheat", "Milk", "Eggs"]
  },
  {
    id: "macarons",
    name: "Parisian Macarons",
    price: 1200.00,
    description: "An elegant box of 6 delicate, crispy almond shells sandwiched with refined chocolate ganache, pistachio cream, raspberry confit, and salted caramel.",
    category: "macaron",
    imageUrl: "/src/assets/images/parisian_macarons_1781508618236.jpg",
    tags: ["Gluten-Free", "Assorted"],
    calories: 450,
    allergen: ["Tree Nuts", "Eggs", "Milk"]
  },
  {
    id: "dark-truffle-cake",
    name: "Dark Truffle Cake",
    price: 4500.00,
    description: "Premium 64% Belgian dark chocolate sponge cake layered with silky espresso-infused ganache, glazed with chocolate mirror shine and gold leaf accents.",
    category: "cake",
    imageUrl: "/src/assets/images/dark_truffle_cake_1781508678788.jpg",
    tags: ["Best Seller", "Signature", "Chocolate"],
    calories: 520,
    allergen: ["Wheat", "Milk", "Eggs", "Soy"]
  },
  {
    id: "artisan-bread",
    name: "Artisanal Sourdough",
    price: 600.00,
    description: "36-hour long-fermented rustic sourdough bread made from stone-ground organic wheat flour. Double-baked for a dark, blistered, deeply crunchy crust.",
    category: "bread",
    imageUrl: "/src/assets/images/artisan_sourdough_1781508695994.jpg",
    tags: ["Vegan", "Fermented"],
    calories: 190,
    allergen: ["Wheat"]
  },
  {
    id: "red-velvet",
    name: "Royal Red Velvet",
    price: 450.00,
    description: "Moist chocolate-infused velvety cake layer, filled and topped with a luxurious whipped cream cheese frosting and a sprinkle of organic cocoa.",
    category: "cake",
    imageUrl: "/src/assets/images/red_velvet_1781508757829.jpg",
    tags: ["Royal", "Sweet"],
    calories: 360,
    allergen: ["Wheat", "Milk", "Eggs"]
  },
  {
    id: "pistachio-tart",
    name: "Raspberry Pistachio Tart",
    price: 750.00,
    description: "Crispy sweet crust filled with premium Bronte pistachio frangipane cream, topped with fresh field raspberries and delicate edible gold leaf.",
    category: "pastry",
    imageUrl: "/src/assets/images/pistachio_tart_1781508715426.jpg",
    tags: ["Summer Special", "Fruity"],
    calories: 320,
    allergen: ["Wheat", "Milk", "Eggs", "Tree Nuts"]
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sophie L.",
    rating: 5,
    comment: "The croissants are just as good as the ones I had in Paris. Truly authentic, beautifully laminated, and made with so much care. A real gem in our city central!",
    tag: "Verified Connoisseur"
  },
  {
    id: "t2",
    name: "Marcus T.",
    rating: 5,
    comment: "They crafted our multi-tier custom wedding cake and it was the highlight of the evening. Majestic to look at and even better to eat. Absolute gold star service!",
    tag: "Groom & Client"
  },
  {
    id: "t3",
    name: "Elena G.",
    rating: 5,
    comment: "The attention to detail in their custom macarons is unmatched. Every flavor is a glorious discovery of textures and aromas. Best boutique bakery in the state.",
    tag: "Regular Local Patron"
  }
];

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "g1",
    title: "Crumb Detail of Artisan Sourdough",
    imageUrl: "/src/assets/images/artisan_sourdough_1781508695994.jpg",
    category: "Kitchen"
  },
  {
    id: "g2",
    title: "Our Master Baker Laminated Dough",
    imageUrl: "/src/assets/images/artisanal_croissants_1781508659092.jpg",
    category: "Kitchen"
  },
  {
    id: "g3",
    title: "Vibrant Handcrafted Fresh Fruit Tarts",
    imageUrl: "/src/assets/images/pistachio_tart_1781508715426.jpg",
    category: "Boutique"
  },
  {
    id: "g4",
    title: "Cozy Rustic Luxury Inside Our Café",
    imageUrl: "/src/assets/images/cozy_cafe_interior_1781508779347.jpg",
    category: "Boutique"
  }
];
