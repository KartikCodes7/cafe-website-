import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Served';
export type PaymentMethod = 'UPI' | 'Counter';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  table: string | null;
  time: string;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  specialInstructions?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  instructions: string;
}

interface AppState {
  // Session context (e.g. from QR)
  currentTable: string | null;
  setTable: (table: string) => void;

  // Customer Info
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;

  // Orders (mocking backend)
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  // Staff / Manager Authentication
  isManagerAuthenticated: boolean;
  managerName: string | null;
  authenticateManager: (name: string | null) => void;
  logoutManager: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentTable: null,
  setTable: (table) => set({ currentTable: table }),

  customerInfo: null,
  setCustomerInfo: (info) => set({ customerInfo: info }),

  cart: [],
  addToCart: (item) => set((state) => {
    const existing = state.cart.find(i => i.id === item.id);
    if (existing) {
      return { cart: state.cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(i => i.id !== id)
  })),
  updateQuantity: (id, quantity) => set((state) => {
    if (quantity <= 0) {
      return { cart: state.cart.filter(i => i.id !== id) };
    }
    return { cart: state.cart.map(i => i.id === id ? { ...i, quantity } : i) };
  }),
  clearCart: () => set({ cart: [] }),
  cartTotal: () => get().cart.reduce((total, item) => total + (item.price * item.quantity), 0),

  // Initially populated with simulated live orders for the manager dashboard
  orders: [
    {
      id: 'ORD-101',
      items: [
        { id: 'p1', name: 'Inferno Volcano Pizza', price: 18, quantity: 1 },
        { id: 'v1', name: 'Nitro Cold Brew', price: 6, quantity: 2 },
      ],
      total: 30,
      status: 'Preparing',
      table: 'Table 4',
      time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      paymentMethod: 'UPI',
      customerName: 'Rahul Sharma',
      customerPhone: '9876543210',
      specialInstructions: 'Make the pizza extra spicy! 🌶️',
    },
    {
      id: 'ORD-102',
      items: [
        { id: 's1', name: 'Loaded Nachos', price: 11, quantity: 1 },
        { id: 'v2', name: 'Blue Lagoon Mocktail', price: 8, quantity: 3 },
      ],
      total: 35,
      status: 'Pending',
      table: 'Table 2',
      time: new Date().toISOString(),
      paymentMethod: 'Counter',
      customerName: 'Aarav Patel',
      customerPhone: '8765432109',
      specialInstructions: 'No ice in mocktails please.',
    },
    {
      id: 'ORD-100',
      items: [
        { id: 'b1', name: 'Double Smash Burger', price: 14, quantity: 2 },
        { id: 's2', name: 'Peri Peri Fries', price: 7, quantity: 2 },
      ],
      total: 42,
      status: 'Ready',
      table: 'Table 7',
      time: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      paymentMethod: 'UPI',
      customerName: 'Priya Iyer',
      customerPhone: '7654321098',
    }
  ],
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  })),

  // Initialize from sessionStorage to handle browser refreshes
  isManagerAuthenticated: sessionStorage.getItem('bt_manager_auth') === 'true',
  managerName: sessionStorage.getItem('bt_manager_name'),

  authenticateManager: (name) => {
    sessionStorage.setItem('bt_manager_auth', 'true');
    if (name) {
      sessionStorage.setItem('bt_manager_name', name);
    } else {
      sessionStorage.removeItem('bt_manager_name');
    }
    set({ isManagerAuthenticated: true, managerName: name });
  },
  logoutManager: () => {
    sessionStorage.removeItem('bt_manager_auth');
    sessionStorage.removeItem('bt_manager_name');
    set({ isManagerAuthenticated: false, managerName: null });
  },
}));
