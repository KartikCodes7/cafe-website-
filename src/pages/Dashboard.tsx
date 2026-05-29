import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Bell, Clock, MoreVertical, LayoutDashboard, DollarSign, TrendingUp, Smartphone, Store, ChevronRight, QrCode, Phone, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import type { OrderStatus, Order } from '../store/useAppStore';

const columns: OrderStatus[] = ['Pending', 'Preparing', 'Ready', 'Served'];

const randomMenuItems = [
  [
    { id: 'p1', name: 'Inferno Volcano Pizza', price: 18, quantity: 1 },
    { id: 'v1', name: 'Nitro Cold Brew', price: 6, quantity: 2 },
  ],
  [
    { id: 'b1', name: 'Double Smash Burger', price: 14, quantity: 2 },
    { id: 's2', name: 'Peri Peri Fries', price: 7, quantity: 1 },
  ],
  [
    { id: 'pa1', name: 'Creamy Alfredo Pasta', price: 14, quantity: 1 },
    { id: 'v2', name: 'Blue Lagoon Mocktail', price: 8, quantity: 3 },
  ],
  [
    { id: 'w1', name: 'Mexican Paneer Wrap', price: 11, quantity: 2 },
    { id: 'd1', name: 'Choco Lava Blast', price: 9, quantity: 1 },
  ],
  [
    { id: 's1', name: 'Loaded Nachos', price: 11, quantity: 1 },
    { id: 'v5', name: 'Oreo Blast Shake', price: 8, quantity: 2 },
    { id: 'p3', name: 'Smoky BBQ Paneer', price: 17, quantity: 1 },
  ],
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, addOrder, managerName, logoutManager } = useAppStore();
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics'>('orders');
  const [activeMenuOrderId, setActiveMenuOrderId] = useState<string | null>(null);

  // Automated Chef status progression simulation loop to make Kanban board feel alive
  useEffect(() => {
    const chefInterval = setInterval(() => {
      // Find active orders that are not served yet
      const activeOrders = orders.filter(o => o.status !== 'Served');
      if (activeOrders.length === 0) return;
      
      // Select a random active order to advance
      const randomOrder = activeOrders[Math.floor(Math.random() * activeOrders.length)];
      
      const currentIndex = columns.indexOf(randomOrder.status);
      if (currentIndex < columns.length - 1) {
        const nextStatus = columns[currentIndex + 1];
        updateOrderStatus(randomOrder.id, nextStatus);
        
        // Push a cinematic Chef toast alert to the manager dashboard
        setNotification(`👨‍🍳 Chef advanced #${randomOrder.id} to "${nextStatus}"`);
        setTimeout(() => setNotification(null), 4000);
      }
    }, 18000); // Trigger order advancement simulation every 18 seconds

    return () => clearInterval(chefInterval);
  }, [orders, updateOrderStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      const items = randomMenuItems[Math.floor(Math.random() * randomMenuItems.length)];
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const mockNames = ['Sameer Sen', 'Neha Verma', 'Kabir Bose', 'Nisha Roy', 'Aditya Dev', 'Tara Roy'];
      const mockPhones = ['9876543211', '8765432102', '7654321093', '6543210984', '9543210985', '8543210986'];
      const mockInstructions = [
        'Make the burger extra spicy! 🌶️',
        'Allergy alert: No dairy in mocktail.',
        'Please deliver plates.',
        'No onions in wrap.',
        '',
        ''
      ];
      
      const randIdx = Math.floor(Math.random() * mockNames.length);
      const newOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        items,
        total,
        status: 'Pending',
        table: `Table ${Math.floor(Math.random() * 10) + 1}`,
        time: new Date().toISOString(),
        paymentMethod: Math.random() > 0.5 ? 'UPI' : 'Counter',
        customerName: mockNames[randIdx],
        customerPhone: mockPhones[randIdx],
        specialInstructions: mockInstructions[randIdx] || undefined,
      };
      addOrder(newOrder);
      setNotification(`New order from ${newOrder.table} — $${total.toFixed(2)}`);
      setTimeout(() => setNotification(null), 4000);
    }, Math.floor(Math.random() * 20000) + 20000);
    return () => clearInterval(interval);
  }, [addOrder]);

  const handleNextStatus = (orderId: string, currentStatus: OrderStatus) => {
    const currentIndex = columns.indexOf(currentStatus);
    if (currentIndex < columns.length - 1) {
      updateOrderStatus(orderId, columns[currentIndex + 1]);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const activeCount = orders.filter(o => o.status !== 'Served').length;

  return (
    <div className="min-h-screen bg-warm-bg flex text-white">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 border-r border-white/5 bg-warm-bg hidden sm:flex flex-col shrink-0">
        <div className="p-4 md:p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-neonPurple to-brand-neonBlue p-[1px] flex-shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <div className="w-full h-full bg-warm-card rounded-[7px] flex items-center justify-center text-xs font-extrabold text-white">BT</div>
          </div>
          <span className="font-bold tracking-widest hidden md:block text-sm">BOWLING TOWN</span>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3 md:px-4">
          <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-white/10 text-brand-neonBlue' : 'text-gray-400 hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden md:block text-sm font-medium">Live Orders</span>
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'analytics' ? 'bg-white/10 text-brand-neonBlue' : 'text-gray-400 hover:bg-white/5'}`}>
            <Activity className="w-5 h-5" />
            <span className="hidden md:block text-sm font-medium">Analytics</span>
          </button>
          <button onClick={() => navigate('/qr-codes')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 transition-colors">
            <QrCode className="w-5 h-5" />
            <span className="hidden md:block text-sm font-medium">QR Codes</span>
          </button>
          
          {/* Staff Exit Logout Button */}
          <button 
            onClick={() => {
              logoutManager();
              navigate('/menu');
            }} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-auto font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block text-sm font-semibold">Log Out</span>
          </button>
        </nav>
        <div className="p-4 border-t border-white/5 hidden md:block">
          <p className="text-[10px] text-gray-500 font-mono tracking-wider">SIMULATION MODE</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between glass-light shrink-0">
          <div>
            <h1 className="text-sm font-black tracking-wide uppercase">
              {activeTab === 'orders' ? 'Kitchen Dashboard' : 'Analytics'}
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-0.5 uppercase">
              Welcome, {managerName || 'Console Chief'} 👨‍🍳
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-neonBlue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-neonBlue"></span>
            </span>
            <span className="hidden sm:inline text-xs">Live Simulation</span>
          </div>
        </header>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className="absolute top-20 left-1/2 z-50 bg-warm-card/90 border border-brand-neonBlue/20 text-white px-5 py-2.5 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.15)] flex items-center gap-3 backdrop-blur-xl">
              <Bell className="w-4 h-4 text-brand-neonBlue" />
              <span className="text-sm font-medium">{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'orders' ? (
          <>
            {/* Stats */}
            <div className="px-6 py-4 flex gap-4 overflow-x-auto shrink-0">
              <div className="flex items-center gap-3 bg-warm-card border border-white/5 rounded-xl px-4 py-3 min-w-[160px]">
                <div className="w-9 h-9 rounded-lg bg-brand-neonBlue/10 flex items-center justify-center"><DollarSign className="w-4 h-4 text-brand-neonBlue" /></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Revenue</p><p className="text-white font-bold font-mono">${totalRevenue.toFixed(2)}</p></div>
              </div>
              <div className="flex items-center gap-3 bg-warm-card border border-white/5 rounded-xl px-4 py-3 min-w-[140px]">
                <div className="w-9 h-9 rounded-lg bg-brand-gold/10 flex items-center justify-center"><Clock className="w-4 h-4 text-brand-gold" /></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Pending</p><p className="text-white font-bold">{pendingCount}</p></div>
              </div>
              <div className="flex items-center gap-3 bg-warm-card border border-white/5 rounded-xl px-4 py-3 min-w-[140px]">
                <div className="w-9 h-9 rounded-lg bg-brand-neonPurple/10 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-brand-neonPurple" /></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Active</p><p className="text-white font-bold">{activeCount}</p></div>
              </div>
            </div>

            {/* Kanban */}
            <div className="flex-1 overflow-x-auto px-6 pb-6">
              <div className="flex gap-5 min-w-max h-full">
                {columns.map(col => (
                  <div key={col} className="w-80 flex flex-col bg-warm-card/40 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-warm-card/85 flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${col === 'Pending' ? 'bg-brand-neonBlue animate-pulse' : col === 'Preparing' ? 'bg-brand-neonPurple' : col === 'Ready' ? 'bg-brand-gold' : 'bg-green-500'}`} />
                        <h2 className="font-semibold text-sm">{col}</h2>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-white/5 text-[11px] flex items-center justify-center font-bold text-gray-400">
                        {orders.filter(o => o.status === col).length}
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <AnimatePresence mode="popLayout">
                        {orders.filter(o => o.status === col).map(order => (
                          <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={order.id} className="bg-warm-card border border-white/5 rounded-xl p-4 shadow-xl group relative overflow-hidden hover:border-white/10 transition-colors">
                            {col === 'Pending' && <div className="absolute top-0 left-0 w-1 h-full bg-brand-neonBlue" />}
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-mono text-brand-neonBlue bg-brand-neonBlue/10 px-2 py-0.5 rounded font-bold">{order.table}</span>
                                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${order.paymentMethod === 'UPI' ? 'text-green-400 bg-green-500/10' : 'text-brand-gold bg-brand-gold/10'}`}>
                                    {order.paymentMethod === 'UPI' ? <Smartphone className="w-2.5 h-2.5" /> : <Store className="w-2.5 h-2.5" />}
                                    {order.paymentMethod}
                                  </span>
                                </div>
                                <h3 className="font-semibold text-xs tracking-wider text-white mt-1">#{order.id}</h3>
                                <div className="flex flex-col gap-0.5 mt-1.5 mb-2">
                                  <h4 className="font-display font-extrabold text-[11px] text-white tracking-wide uppercase">{order.customerName}</h4>
                                  <span className="text-[9px] font-mono text-gray-500 flex items-center gap-1">
                                    <Phone className="w-2.5 h-2.5 text-gray-500" />
                                    {order.customerPhone}
                                  </span>
                                </div>
                              </div>
                              <div className="relative">
                                <button 
                                  onClick={() => setActiveMenuOrderId(activeMenuOrderId === order.id ? null : order.id)}
                                  className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                <AnimatePresence>
                                  {activeMenuOrderId === order.id && (
                                    <>
                                      {/* Click outside backdrop overlay */}
                                      <div className="fixed inset-0 z-40" onClick={() => setActiveMenuOrderId(null)} />
                                      <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="absolute right-0 mt-1.5 w-40 rounded-xl bg-warm-card border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.5)] py-1.5 z-50 text-xs text-left"
                                      >
                                        <button 
                                          onClick={() => {
                                            setActiveMenuOrderId(null);
                                            setNotification(`🖨️ Receipt sent to Kitchen Thermal Printer (${order.table})!`);
                                            setTimeout(() => setNotification(null), 4000);
                                          }}
                                          className="w-full text-left px-3.5 py-2 text-gray-200 hover:bg-white/5 hover:text-brand-neonBlue transition-colors font-medium"
                                        >
                                          Print Receipt
                                        </button>
                                        <button 
                                          onClick={() => {
                                            setActiveMenuOrderId(null);
                                            setNotification(`🔔 Table Alert sent: "Chef is handcrafting your order!"`);
                                            setTimeout(() => setNotification(null), 4000);
                                          }}
                                          className="w-full text-left px-3.5 py-2 text-gray-200 hover:bg-white/5 hover:text-brand-neonBlue transition-colors font-medium"
                                        >
                                          Alert Table
                                        </button>
                                        <div className="h-[1px] bg-white/5 my-1" />
                                        <button 
                                          onClick={() => {
                                            setActiveMenuOrderId(null);
                                            updateOrderStatus(order.id, 'Served');
                                            setNotification(`❌ Order #${order.id} has been archived.`);
                                            setTimeout(() => setNotification(null), 4000);
                                          }}
                                          className="w-full text-left px-3.5 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium"
                                        >
                                          Archive Order
                                        </button>
                                      </motion.div>
                                    </>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                            <ul className="text-xs text-gray-300 space-y-1.5 mb-4">
                              {order.items.map((item, i) => (
                                <li key={i} className="flex justify-between">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span className="text-gray-500 font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                            {order.specialInstructions && (
                              <div className="mb-3.5 p-2 rounded bg-brand-neonPurple/5 border border-brand-neonPurple/10 text-[9px] text-gray-400 font-light leading-normal">
                                <span className="font-bold text-brand-neonPurple uppercase tracking-wider block mb-0.5">Instructions:</span>
                                "{order.specialInstructions}"
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(order.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="text-xs text-white font-mono font-bold">${order.total.toFixed(2)}</span>
                              </div>
                              {col !== 'Served' && (
                                <button onClick={() => handleNextStatus(order.id, col)} className="text-[11px] bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1">
                                  {columns[columns.indexOf(col) + 1]}<ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-24 h-24 rounded-full bg-brand-neonBlue/10 border border-brand-neonBlue/20 flex items-center justify-center mb-6">
              <TrendingUp className="w-12 h-12 text-brand-neonBlue" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Revenue Insights</h2>
            <p className="text-gray-400 max-w-sm text-center text-sm leading-relaxed">Connect a backend provider to unlock historical revenue and performance analytics.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-warm-card border border-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white font-mono">${totalRevenue.toFixed(0)}</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Session Revenue</p>
              </div>
              <div className="bg-warm-card border border-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{orders.length}</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Total Orders</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
