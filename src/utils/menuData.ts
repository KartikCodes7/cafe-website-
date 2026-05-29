export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export const menuCategories = [
  "Pizzas",
  "Burgers",
  "Snacks & Sides",
  "Pasta",
  "Wraps",
  "Beverages",
  "Desserts"
];

export const menuData: MenuItem[] = [
  // ═══════════════════════════════════════════════
  // 🍕 PIZZAS
  // ═══════════════════════════════════════════════
  { id: "p1", name: "Inferno Volcano Pizza", description: "Spicy pepperoni, jalapeños, and hot honey drizzle on a wood-fired base.", price: 18, category: "Pizzas", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80" },
  { id: "p2", name: "Triple Cheese Burst", description: "Mozzarella, cheddar, and parmesan with a stuffed crust.", price: 16, category: "Pizzas", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80" },
  { id: "p3", name: "Smoky BBQ Paneer", description: "Chargrilled paneer, smoky BBQ glaze, and caramelized onions.", price: 17, category: "Pizzas", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500&q=80" },
  { id: "p4", name: "Fiery Pepperoni Supreme", description: "Double-layered pepperoni, chili flakes, and oregano butter.", price: 19, category: "Pizzas", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80" },
  { id: "p5", name: "Creamy Alfredo Pizza", description: "White alfredo sauce, grilled chicken, and fresh herbs.", price: 20, category: "Pizzas", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80" },
  { id: "p6", name: "Tandoori Blast Pizza", description: "Tandoori chicken, mint chutney drizzle, and pickled onions.", price: 18, category: "Pizzas", image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80" },

  // ═══════════════════════════════════════════════
  // 🍔 BURGERS
  // ═══════════════════════════════════════════════
  { id: "b1", name: "Double Smash Burger", description: "Two smashed beef patties, house sauce, on a toasted brioche bun.", price: 14, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
  { id: "b2", name: "Crispy Chicken Stack", description: "Buttermilk fried chicken, spicy slaw, and garlic aioli.", price: 13, category: "Burgers", image: "https://images.unsplash.com/photo-1615486171448-424f114c0429?w=500&q=80" },
  { id: "b3", name: "Truffle Veg Burger", description: "Portobello mushroom, truffle mayo, and arugula.", price: 15, category: "Burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80" },
  { id: "b4", name: "Spicy Jalapeño Melt", description: "Jalapeño-crusted patty, pepper jack cheese, chipotle sauce.", price: 14, category: "Burgers", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80" },
  { id: "b5", name: "Monster BBQ Burger", description: "Double patty, smoked bacon, onion rings, BBQ glaze.", price: 17, category: "Burgers", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80" },

  // ═══════════════════════════════════════════════
  // 🌮 SNACKS & SIDES
  // ═══════════════════════════════════════════════
  { id: "s1", name: "Loaded Nachos", description: "Tortilla chips, queso, pico de gallo, guacamole, and sour cream.", price: 11, category: "Snacks & Sides", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&q=80" },
  { id: "s2", name: "Peri Peri Fries", description: "Crispy shoestring fries tossed in signature spicy seasoning.", price: 7, category: "Snacks & Sides", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80" },
  { id: "s3", name: "Cheese Garlic Bread", description: "Oven-baked garlic bread loaded with mozzarella and herbs.", price: 8, category: "Snacks & Sides", image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&q=80" },
  { id: "s4", name: "Dynamite Corn Cups", description: "Spicy Korean-inspired corn with mayo, cheese, and chili flakes.", price: 6, category: "Snacks & Sides", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80" },
  { id: "s5", name: "Crispy Onion Rings", description: "Beer-battered onion rings with smoky dipping sauce.", price: 7, category: "Snacks & Sides", image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80" },
  { id: "s6", name: "Dragon Potato Wedges", description: "Seasoned potato wedges with dragon sauce and ranch.", price: 8, category: "Snacks & Sides", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80" },

  // ═══════════════════════════════════════════════
  // 🍝 PASTA
  // ═══════════════════════════════════════════════
  { id: "pa1", name: "Creamy Alfredo Pasta", description: "Rich white sauce, parmesan, and garlic-infused fettuccine.", price: 14, category: "Pasta", image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&q=80" },
  { id: "pa2", name: "Pink Sauce Pasta", description: "Blush tomato-cream fusion with penne and fresh basil.", price: 13, category: "Pasta", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80" },
  { id: "pa3", name: "Fiery Arrabiata Pasta", description: "Spicy tomato sauce, chili flakes, olives, and spaghetti.", price: 12, category: "Pasta", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80" },
  { id: "pa4", name: "Truffle Mushroom Pasta", description: "Wild mushrooms, truffle oil, cream, and toasted pine nuts.", price: 16, category: "Pasta", image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=500&q=80" },
  { id: "pa5", name: "Smoky Chicken Penne", description: "Smoked chicken, roasted peppers, and smoky paprika cream.", price: 15, category: "Pasta", image: "https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?w=500&q=80" },
  { id: "pa6", name: "Cheesy Jalapeño Pasta", description: "Spicy jalapeño-cheddar sauce with fusilli and crispy breadcrumbs.", price: 13, category: "Pasta", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80" },

  // ═══════════════════════════════════════════════
  // 🌯 WRAPS & SANDWICHES
  // ═══════════════════════════════════════════════
  { id: "w1", name: "Mexican Paneer Wrap", description: "Spiced paneer, black beans, corn salsa, and chipotle mayo.", price: 11, category: "Wraps", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&q=80" },
  { id: "w2", name: "Crispy Chicken Wrap", description: "Crispy fried chicken strips, coleslaw, and honey mustard.", price: 12, category: "Wraps", image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500&q=80" },
  { id: "w3", name: "Smoky BBQ Wrap", description: "BBQ-glazed chicken, smoked cheddar, and caramelized onions.", price: 12, category: "Wraps", image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=500&q=80" },
  { id: "w4", name: "Cheese Burst Veg Wrap", description: "Loaded veggies, triple cheese, and tangy garlic sauce.", price: 10, category: "Wraps", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
  { id: "w5", name: "Peri Peri Paneer Wrap", description: "Chargrilled paneer, peri peri glaze, fresh lettuce.", price: 11, category: "Wraps", image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&q=80" },
  { id: "w6", name: "Spicy Loaded Nacho Wrap", description: "Crushed nachos, jalapeños, queso, and sriracha mayo.", price: 11, category: "Wraps", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&q=80" },

  // ═══════════════════════════════════════════════
  // ☕🧋🍹 BEVERAGES
  // ═══════════════════════════════════════════════
  { id: "v1", name: "Nitro Cold Brew", description: "Smooth, nitrogen-infused cold brew coffee.", price: 6, category: "Beverages", image: "https://images.unsplash.com/photo-1461023058943-0708e5bc4cea?w=500&q=80" },
  { id: "v2", name: "Blue Lagoon Mocktail", description: "Refreshing blue curaçao syrup, lemon, and crushed ice.", price: 8, category: "Beverages", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80" },
  { id: "v3", name: "Signature Cappuccino", description: "Artisanal espresso with velvety steamed milk foam.", price: 5, category: "Beverages", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80" },
  { id: "v4", name: "Caramel Latte", description: "Rich espresso, steamed milk, and buttery caramel drizzle.", price: 6, category: "Beverages", image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&q=80" },
  { id: "v5", name: "Oreo Blast Shake", description: "Thick Oreo milkshake with whipped cream and cookie crumble.", price: 8, category: "Beverages", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80" },
  { id: "v6", name: "KitKat Frappe", description: "Blended iced coffee with KitKat chunks and chocolate sauce.", price: 9, category: "Beverages", image: "https://images.unsplash.com/photo-1461023058943-0708e5bc4cea?w=500&q=80" },
  { id: "v7", name: "Kiwi Mint Cooler", description: "Fresh kiwi, mint leaves, lime, and sparkling soda.", price: 7, category: "Beverages", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&q=80" },
  { id: "v8", name: "Berry Spark Mojito", description: "Mixed berries, fresh mint, lime, and sparkling water.", price: 8, category: "Beverages", image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80" },

  // ═══════════════════════════════════════════════
  // 🍰 DESSERTS
  // ═══════════════════════════════════════════════
  { id: "d1", name: "Choco Lava Blast", description: "Warm chocolate cake with a molten gooey center and vanilla ice cream.", price: 9, category: "Desserts", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&q=80" },
  { id: "d2", name: "Nutella Brownie", description: "Dense fudgy brownie with Nutella swirl and toasted hazelnuts.", price: 8, category: "Desserts", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80" },
  { id: "d3", name: "Red Velvet Cheesecake", description: "Creamy cheesecake layered with red velvet cake and cream cheese frosting.", price: 10, category: "Desserts", image: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=500&q=80" },
  { id: "d4", name: "Lotus Biscoff Jar", description: "Layered Biscoff cream, crushed cookies, and caramel drizzle.", price: 9, category: "Desserts", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80" },
  { id: "d5", name: "Oreo Ice Cream Sundae", description: "Vanilla ice cream, crushed Oreos, chocolate sauce, and whipped cream.", price: 8, category: "Desserts", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80" },
];
