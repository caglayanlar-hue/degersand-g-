import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, RotateCcw, X, Info, Sparkles, ArrowRight, Check, Printer } from 'lucide-react';

const TURKISH_ALPHABET = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'
];

interface CaesarWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyWord?: (word: string) => void;
  initialShift?: number;
}

export const CaesarWheelModal: React.FC<CaesarWheelModalProps> = ({
  isOpen,
  onClose,
  onApplyWord,
  initialShift = 2
}) => {
  const [shift, setShift] = useState<number>(initialShift);
  const [testWord, setTestWord] = useState<string>('FYŞYTÜNYM');
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const startAngleRef = useRef<number>(0);
  const startShiftRef = useRef<number>(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const totalLetters = TURKISH_ALPHABET.length; // 29
  const stepAngle = 360 / totalLetters; // ~12.4137 degrees

  // Keep shift in 0..28
  const normalizedShift = ((shift % totalLetters) + totalLetters) % totalLetters;

  // Decrypt test word: Each letter shifted backward by shift
  const decodeLetter = (char: string, s: number) => {
    const idx = TURKISH_ALPHABET.indexOf(char.toLocaleUpperCase('tr-TR'));
    if (idx === -1) return char;
    const newIdx = ((idx - s) % totalLetters + totalLetters) % totalLetters;
    return TURKISH_ALPHABET[newIdx];
  };

  const encodeLetter = (char: string, s: number) => {
    const idx = TURKISH_ALPHABET.indexOf(char.toLocaleUpperCase('tr-TR'));
    if (idx === -1) return char;
    const newIdx = (idx + s) % totalLetters;
    return TURKISH_ALPHABET[newIdx];
  };

  const decodedResult = testWord
    .split('')
    .map(c => decodeLetter(c, normalizedShift))
    .join('');

  const rotateStep = (direction: 'cw' | 'ccw') => {
    setIsRotating(true);
    setShift(prev => {
      const next = direction === 'cw' ? prev + 1 : prev - 1;
      return ((next % totalLetters) + totalLetters) % totalLetters;
    });
    setTimeout(() => setIsRotating(false), 300);
  };

  // Touch / Mouse wheel drag calculation
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    isDraggingRef.current = true;
    startAngleRef.current = angle;
    startShiftRef.current = shift;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    let delta = currentAngle - startAngleRef.current;

    // Convert angle delta to step change
    const stepsDelta = Math.round(delta / stepAngle);
    const newShift = ((startShiftRef.current - stepsDelta) % totalLetters + totalLetters) % totalLetters;
    setShift(newShift);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-3 border-amber-400 rounded-3xl shadow-[0_25px_70px_rgba(245,158,11,0.4)] p-4 sm:p-6 text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-indigo-400/40 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">⚙️</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent flex items-center gap-2">
                İnteraktif Sezar Şifreleme Çarkı
                <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase">
                  TÜBİTAK 4006 Atölyesi
                </span>
              </h3>
              <p className="text-xs text-cyan-200 font-medium hidden sm:block">
                İç çarkı çevirin, açık ve şifreli harfleri eşleştirerek şifreleri çözün!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-600 text-slate-200 hover:text-white border border-slate-700 transition-all cursor-pointer shadow-md"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: 2 Columns (Wheel on Left/Center, Tools & Decoder on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Wheel Visual Area */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Quick Shift Badges & Controls */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => rotateStep('ccw')}
                className="px-3 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-700 border-2 border-indigo-400 text-xs font-black flex items-center gap-1 active:scale-95 transition-all shadow-md cursor-pointer"
                title="1 Adım Geri Çevir"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                <span>-1 Adım</span>
              </button>

              <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-md border border-yellow-200">
                Kaydırma (Anahtar): <span className="text-white text-base">+{normalizedShift}</span>
              </div>

              <button
                onClick={() => rotateStep('cw')}
                className="px-3 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-700 border-2 border-indigo-400 text-xs font-black flex items-center gap-1 active:scale-95 transition-all shadow-md cursor-pointer"
                title="1 Adım İleri Çevir"
              >
                <span>+1 Adım</span>
                <RotateCw className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>

            {/* SVG Interactive Concentric Wheels */}
            <div
              ref={wheelRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative w-72 h-72 sm:w-84 sm:h-84 select-none touch-none cursor-grab active:cursor-grabbing p-1 bg-slate-950/70 rounded-full border-4 border-amber-400/70 shadow-[0_0_35px_rgba(245,158,11,0.35)]"
              style={{ width: '310px', height: '310px' }}
            >
              {/* Outer Pointer Indicator (Fixed at 12 o'clock) */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-yellow-300 drop-shadow-[0_2px_6px_rgba(234,179,8,1)]" />
              </div>

              <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl">
                {/* 1. OUTER WHEEL: Base / Plain Letters (Fixed, Outer Ring) */}
                <circle cx="200" cy="200" r="190" fill="#0f172a" stroke="#6366f1" strokeWidth="4" />
                <circle cx="200" cy="200" r="145" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" strokeDasharray="3 3" />

                {/* Outer Ring Letter Divisions */}
                {TURKISH_ALPHABET.map((letter, i) => {
                  const angle = i * stepAngle - 90; // Start at top
                  const rad = (angle * Math.PI) / 180;
                  const x = 200 + 168 * Math.cos(rad);
                  const y = 200 + 168 * Math.sin(rad);
                  return (
                    <g key={`outer-${letter}`} transform={`rotate(${angle + 90}, ${x}, ${y})`}>
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#38bdf8"
                        fontSize="13"
                        fontWeight="900"
                        fontFamily="monospace"
                      >
                        {letter}
                      </text>
                    </g>
                  );
                })}

                {/* 2. INNER ROTATING WHEEL: Shifted Letters */}
                <g
                  transform={`rotate(${-normalizedShift * stepAngle}, 200, 200)`}
                  style={{ transition: isRotating ? 'transform 0.25s ease-out' : 'none' }}
                >
                  <circle cx="200" cy="200" r="140" fill="#312e81" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx="200" cy="200" r="85" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="2" />

                  {/* Inner Ring Letters */}
                  {TURKISH_ALPHABET.map((letter, i) => {
                    const angle = i * stepAngle - 90;
                    const rad = (angle * Math.PI) / 180;
                    const x = 200 + 112 * Math.cos(rad);
                    const y = 200 + 112 * Math.sin(rad);
                    return (
                      <g key={`inner-${letter}`} transform={`rotate(${angle + 90}, ${x}, ${y})`}>
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#fef08a"
                          fontSize="13"
                          fontWeight="900"
                          fontFamily="monospace"
                        >
                          {letter}
                        </text>
                      </g>
                    );
                  })}

                  {/* Decorative Radial Rays */}
                  {Array.from({ length: 12 }).map((_, rIdx) => {
                    const rAngle = (rIdx * 30 * Math.PI) / 180;
                    return (
                      <line
                        key={`ray-${rIdx}`}
                        x1={200 + 30 * Math.cos(rAngle)}
                        y1={200 + 30 * Math.sin(rAngle)}
                        x2={200 + 80 * Math.cos(rAngle)}
                        y2={200 + 80 * Math.sin(rAngle)}
                        stroke="#4338ca"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>

                {/* 3. CENTER PIN / BRASS STUD (Maşalı Raptiye Efekti) */}
                <circle cx="200" cy="200" r="28" fill="#d97706" stroke="#fef08a" strokeWidth="3" />
                <circle cx="200" cy="200" r="14" fill="#78350f" />
                <circle cx="196" cy="196" r="5" fill="#fef08a" opacity="0.8" />
              </svg>

              {/* Touch Drag Hint */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-amber-200/90 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  Çarkı Çevir
                </span>
              </div>
            </div>

            {/* Wheel Legend */}
            <div className="flex items-center justify-center gap-4 mt-3 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-400 inline-block shadow-sm" />
                <span className="text-sky-300">Dış Halka: Açık Metin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-yellow-300 inline-block shadow-sm" />
                <span className="text-yellow-300">İç Halka: Şifreli Metin</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Word Decoder & Presets */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Quick Puzzle Presets for Workshop */}
            <div className="bg-slate-950/80 border-2 border-indigo-500/50 rounded-2xl p-3.5 shadow-inner">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-2">
                🎯 Hızlı Atölye Görevleri (Tıkla ve Çöz)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setShift(2);
                    setTestWord('FYŞYTÜNYM');
                  }}
                  className="p-2 rounded-xl bg-indigo-900/70 hover:bg-rose-700/80 border border-indigo-400 text-left font-bold transition-all cursor-pointer"
                >
                  <div className="text-[10px] text-rose-300 font-black">1. Kilit (+2 Adım)</div>
                  <div className="font-mono text-white text-xs">FYŞYTÜNYM</div>
                </button>
                <button
                  onClick={() => {
                    setShift(2);
                    setTestWord('ZGĞC');
                  }}
                  className="p-2 rounded-xl bg-indigo-900/70 hover:bg-emerald-700/80 border border-indigo-400 text-left font-bold transition-all cursor-pointer"
                >
                  <div className="text-[10px] text-emerald-300 font-black">Görev A (+2 Adım)</div>
                  <div className="font-mono text-white text-xs">ZGĞC (VEFA)</div>
                </button>
                <button
                  onClick={() => {
                    setShift(2);
                    setTestWord('TCÇJŞ');
                  }}
                  className="p-2 rounded-xl bg-indigo-900/70 hover:bg-cyan-700/80 border border-indigo-400 text-left font-bold transition-all cursor-pointer"
                >
                  <div className="text-[10px] text-cyan-300 font-black">Görev B (+2 Adım)</div>
                  <div className="font-mono text-white text-xs">TCÇJŞ (SABIR)</div>
                </button>
                <button
                  onClick={() => {
                    setShift(2);
                    setTestWord('TCAHJ');
                  }}
                  className="p-2 rounded-xl bg-indigo-900/70 hover:bg-purple-700/80 border border-indigo-400 text-left font-bold transition-all cursor-pointer"
                >
                  <div className="text-[10px] text-purple-300 font-black">Görev C (+2 Adım)</div>
                  <div className="font-mono text-white text-xs">TCAHJ (SAYGI)</div>
                </button>
              </div>
            </div>

            {/* Custom Input Decoder Box */}
            <div className="bg-slate-950/90 border-2 border-amber-400/70 rounded-2xl p-4 shadow-md space-y-3">
              <div>
                <label className="block text-xs font-black text-cyan-300 mb-1">
                  Şifreli Metni Girin:
                </label>
                <input
                  type="text"
                  value={testWord}
                  onChange={(e) => setTestWord(e.target.value.toLocaleUpperCase('tr-TR'))}
                  className="w-full bg-slate-900 border-2 border-indigo-400 rounded-xl px-3 py-2 text-white font-mono font-black text-center tracking-widest uppercase focus:border-amber-400 outline-none"
                  placeholder="METİN..."
                />
              </div>

              {/* Live Decoded Output */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950 to-teal-950 border-2 border-emerald-400 text-center">
                <span className="text-[11px] font-black text-emerald-300 uppercase tracking-widest block mb-0.5">
                  Çarkın Çözdüğü Açık Kelime:
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-yellow-300 tracking-[0.2em] drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">
                  {decodedResult || '—'}
                </span>
              </div>

              {/* Use in Game Button */}
              {onApplyWord && decodedResult && (
                <button
                  onClick={() => {
                    onApplyWord(decodedResult);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg border border-yellow-200 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Bu Kelimeyi Oyundaki Giriş Kutusuna Aktar</span>
                </button>
              )}
            </div>

            {/* Printable Workshop Tip */}
            <div className="p-3 rounded-xl bg-indigo-950/70 border border-indigo-400/40 text-xs text-indigo-200 flex items-start gap-2.5">
              <span className="text-lg">💡</span>
              <div>
                <span className="font-bold text-white block">TÜBİTAK 4006 Standı İçin İpucu:</span>
                Ziyaretçiler standınızdaki fiziksel karton çarkı elleriyle çevirirken, bu ekrandan çarkın dijital simülasyonunu test edebilirler.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
