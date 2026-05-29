import type { CartItem } from '../store/useAppStore';
import { menuData } from './menuData';
import type { MenuItem } from './menuData';

export interface RecommendationResult {
  headline: string;
  tagline: string;
  recommendations: MenuItem[];
}

/**
 * Intelligently generates complementary menu recommendations based on current cart items.
 * Ensures that recommended items are not already in the cart.
 */
export const getRecommendationsForCart = (cart: CartItem[]): RecommendationResult => {
  // If cart is empty, suggest trending premium items
  if (cart.length === 0) {
    const trendingIds = ['b3', 'pa4', 'v5']; // Truffle Veg Burger, Truffle Mushroom Pasta, Oreo Blast Shake
    const items = menuData.filter(item => trendingIds.includes(item.id));
    return {
      headline: "Trending combos at the lounge right now 🔥",
      tagline: "Intelligent pairings handpicked by our café concierge.",
      recommendations: items
    };
  }

  // Check what categories are present in the cart
  const cartIds = new Set(cart.map(item => item.id));
  const hasPizza = cart.some(item => item.id.startsWith('p'));
  const hasBurger = cart.some(item => item.id.startsWith('b'));
  const hasPasta = cart.some(item => item.id.startsWith('pa'));
  const hasBeverage = cart.some(item => item.id.startsWith('v'));

  let targetIds: string[] = [];
  let headline = "Perfect combo for your order 🎳";
  let tagline = "Customers usually pair this with...";

  if (hasPizza) {
    // Pizza pairing: Garlic Bread (s3), Nitro Cold Brew (v1), Oreo Sundae (d5)
    targetIds = ['s3', 'v1', 'd5'];
    headline = "Complete your pizza combo! 🍕";
    tagline = "Add artisan sides and cold brew to complete your gourmet table experience.";
  } else if (hasBurger) {
    // Burger pairing: Peri Peri Fries (s2), Oreo Blast Shake (v5), Loaded Nachos (s1)
    targetIds = ['s2', 'v5', 's1'];
    headline = "Complete your burger feast! 🍔";
    tagline = "Double down with loaded nachos, crispy fries, and a thick Oreo shake.";
  } else if (hasPasta) {
    // Pasta pairing: Cheese Garlic Bread (s3), Berry Spark Mojito (v8), Red Velvet Cheesecake (d3)
    targetIds = ['s3', 'v8', 'd3'];
    headline = "Authentic Italian pairings! 🍝";
    tagline = "A buttery garlic bread and fresh berry mojito perfectly balance a rich pasta.";
  } else if (hasBeverage) {
    // Beverage-only pairing: Nutella Brownie (d2), Cheese Burst Veg Wrap (w4), Choco Lava Blast (d1)
    targetIds = ['d2', 'w4', 'd1'];
    headline = "Pair your drink with a premium bite! ☕";
    tagline = "Satisfy your cravings with our freshly baked wraps and gourmet desserts.";
  } else {
    // Fallback/General: Dynamite Corn Cups (s4), Smoky BBQ Wrap (w3), Nutella Brownie (d2)
    targetIds = ['s4', 'w3', 'd2'];
    headline = "Complete your table experience! 🎳";
    tagline = "Highly-rated light bites and sweets trending at our tables.";
  }

  // Filter out items already in the cart
  let recommendedItems = menuData.filter(item => targetIds.includes(item.id) && !cartIds.has(item.id));

  // If some suggested items are already in the cart, fill in with popular items from other categories
  if (recommendedItems.length < 3) {
    const backupIds = ['s2', 'v5', 'd1', 's3', 'd2']; // Fries, Shake, Lava Cake, Garlic Bread, Brownie
    for (const backupId of backupIds) {
      if (recommendedItems.length >= 3) break;
      if (!cartIds.has(backupId) && !recommendedItems.some(item => item.id === backupId)) {
        const backupItem = menuData.find(item => item.id === backupId);
        if (backupItem) {
          recommendedItems.push(backupItem);
        }
      }
    }
  }

  // Cap at 3 recommendations maximum
  return {
    headline,
    tagline,
    recommendations: recommendedItems.slice(0, 3)
  };
};
