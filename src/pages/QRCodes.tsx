import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = window.location.origin;
const TABLE_COUNT = 10;

const QRCodes = () => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (tableNum: number) => {
    const url = `${BASE_URL}/qr/table-${tableNum}`;
    navigator.clipboard.writeText(url);
    setCopiedId(tableNum);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-warm-bg/60 backdrop-blur-xl border-b border-white/5 pt-12 pb-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Table QR Codes</h1>
              <p className="text-[10px] font-mono tracking-[0.2em] text-brand-neonBlue uppercase">
                Scannable ordering system
              </p>
            </div>
          </div>
          <button 
            onClick={handlePrintAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-semibold print:hidden"
          >
            <Printer className="w-4 h-4" />
            Print All
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
        {/* Info banner */}
        <div className="mb-8 bg-brand-neonBlue/5 border border-brand-neonBlue/10 rounded-2xl p-5">
          <p className="text-sm text-gray-300 leading-relaxed">
            Each table has a unique QR code. When scanned, customers are taken through a <span className="text-brand-neonBlue font-semibold">cinematic intro animation</span> and redirected to the menu with their table number pre-loaded. Print these codes and place them on each table.
          </p>
          <p className="text-xs text-gray-500 mt-2 font-mono">
            Base URL: <span className="text-brand-neonBlue">{BASE_URL}</span>
          </p>
        </div>

        {/* QR Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: TABLE_COUNT }, (_, i) => i + 1).map(tableNum => {
            const url = `${BASE_URL}/qr/table-${tableNum}`;
            
            return (
              <motion.div
                key={tableNum}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: tableNum * 0.04 }}
                className="bg-warm-card/30 border border-white/5 rounded-2xl p-6 flex flex-col items-center hover:border-white/10 transition-colors group"
              >
                {/* Table Label */}
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-bold text-white">Table {tableNum}</h3>
                  <p className="text-[10px] font-mono text-gray-500 tracking-wider uppercase mt-0.5">
                    THE BOWLING TOWN & CAFE
                  </p>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-xl p-4 shadow-[0_0_30px_rgba(0,240,255,0.05)] group-hover:shadow-[0_0_40px_rgba(0,240,255,0.1)] transition-shadow">
                  <QRCodeSVG
                    value={url}
                    size={160}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#0a0a0a"
                    imageSettings={{
                      src: '',
                      x: undefined,
                      y: undefined,
                      height: 0,
                      width: 0,
                      excavate: false,
                    }}
                  />
                </div>

                {/* URL */}
                <p className="text-[9px] font-mono text-gray-500 mt-3 max-w-full truncate text-center">
                  {url}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 print:hidden">
                  <button
                    onClick={() => handleCopy(tableNum)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-medium"
                  >
                    {copiedId === tableNum ? (
                      <><Check className="w-3 h-3 text-green-400" /> Copied</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy URL</>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Scan instruction */}
        <div className="mt-12 mb-8 text-center">
          <p className="text-sm text-gray-400">
            Scan any QR code with your phone camera to test the full customer journey:
          </p>
          <p className="text-xs text-gray-500 font-mono mt-2">
            QR Scan → Cinematic Intro → Menu → Order → Payment → Tracking
          </p>
        </div>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          header { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default QRCodes;
