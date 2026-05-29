import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntroLoader from './pages/IntroLoader';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Track from './pages/Track';
import BookLane from './pages/BookLane';
import Dashboard from './pages/Dashboard';
import QRCodes from './pages/QRCodes';
import KitchenAccess from './pages/KitchenAccess';
import { useAppStore } from './store/useAppStore';

// Protected Route Guard to prevent unauthorized public access to dashboard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isManagerAuthenticated = useAppStore(state => state.isManagerAuthenticated);
  return isManagerAuthenticated ? <>{children}</> : <Navigate to="/kitchen-access" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-warm-bg text-gray-100 font-sans">
        <Routes>
          {/* Default redirect to a demo QR */}
          <Route path="/" element={<Navigate to="/qr/table-4" replace />} />
          
          {/* Customer Routes */}
          <Route path="/qr/:id" element={<IntroLoader />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<Order />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/track" element={<Track />} />
          <Route path="/book-lane" element={<BookLane />} />
          
          {/* Manager Operations Routes (Secured) */}
          <Route path="/kitchen-access" element={<KitchenAccess />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/qr-codes" element={<ProtectedRoute><QRCodes /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
