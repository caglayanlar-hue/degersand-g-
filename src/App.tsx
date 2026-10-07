/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  Key,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Keyboard,
  RotateCcw,
  Sparkles,
  FileDown,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

declare global {
  interface Window {
    html2pdf?: any;
  }
}

// 12 Months 2027 Values & Wisdom with Vivid Multi-Color Themes
interface MonthData {
  index: number;
  month: string;
  value: string;
  quote: string;
  author: string;
  guideline: string;
  cardBg: string;
  borderColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  titleColor: string;
  guidelineBg: string;
}

const MONTHS_2027: MonthData[] = [
  {
    index: 1,
    month: 'Ocak 2027',
    value: 'Dürüstlük',
    quote: 'Cümleler doğrudur sen doğru isen, doğruluk bulunmaz sen eğri isen.',
    author: 'Yunus Emre',
    guideline: 'Sözde, işte ve niyette her zaman doğru ve ilkeli olmak.',
    cardBg: 'bg-gradient-to-br from-[#991b1b] via-[#7f1d1d] to-[#450a0a]',
    borderColor: 'border-rose-400/90 hover:border-white',
    badgeBg: 'bg-rose-500/40',
    badgeBorder: 'border-rose-300',
    badgeText: 'text-rose-100',
    titleColor: 'text-rose-200',
    guidelineBg: 'bg-black/35 border-rose-400/50 text-rose-100'
  },
  {
    index: 2,
    month: 'Şubat 2027',
    value: 'Yardımlaşma',
    quote: 'Bir elin nesi var, iki elin sesi var. Birlikten kuvvet doğar.',
    author: 'Geleneksel Atasözü',
    guideline: 'Zorlukları dayanışma ve kardeşlikle omuz omuza aşmak.',
    cardBg: 'bg-gradient-to-br from-[#065f46] via-[#064e3b] to-[#022c22]',
    borderColor: 'border-emerald-400/90 hover:border-white',
    badgeBg: 'bg-emerald-500/40',
    badgeBorder: 'border-emerald-300',
    badgeText: 'text-emerald-100',
    titleColor: 'text-emerald-200',
    guidelineBg: 'bg-black/35 border-emerald-400/50 text-emerald-100'
  },
  {
    index: 3,
    month: 'Mart 2027',
    value: 'Saygı',
    quote: 'Yaratılanı hoş gör, Yaradan’dan ötürü. Büyüklere hürmet, küçüklere şefkat.',
    author: 'Yunus Emre',
    guideline: 'Farklılıklara hürmet edip nezaket ve sevgi diliyle yaklaşmak.',
    cardBg: 'bg-gradient-to-br from-[#0369a1] via-[#075985] to-[#082f49]',
    borderColor: 'border-sky-400/90 hover:border-white',
    badgeBg: 'bg-sky-500/40',
    badgeBorder: 'border-sky-300',
    badgeText: 'text-sky-100',
    titleColor: 'text-sky-200',
    guidelineBg: 'bg-black/35 border-sky-400/50 text-sky-100'
  },
  {
    index: 4,
    month: 'Nisan 2027',
    value: 'Vefa',
    quote: 'Vefa; hatırlamak değil, hiç unutmamaktır. Emek ve sevgi kutsaldır.',
    author: 'Geleneksel Hikmet',
    guideline: 'Verilen emeği, dostluğu ve iyiliği ömür boyu aziz bilmek.',
    cardBg: 'bg-gradient-to-br from-[#6d28d9] via-[#4c1d95] to-[#2e1065]',
    borderColor: 'border-purple-400/90 hover:border-white',
    badgeBg: 'bg-purple-500/40',
    badgeBorder: 'border-purple-300',
    badgeText: 'text-purple-100',
    titleColor: 'text-purple-200',
    guidelineBg: 'bg-black/35 border-purple-400/50 text-purple-100'
  },
  {
    index: 5,
    month: 'Mayıs 2027',
    value: 'Sabır',
    quote: 'Sabır acıdır, lakin meyvesi pek tatlıdır.',
    author: 'Sâdi-i Şîrâzî',
    guideline: 'Hedefe ulaşırken azimle ve metanetle yola devam etmek.',
    cardBg: 'bg-gradient-to-br from-[#b45309] via-[#78350f] to-[#451a03]',
    borderColor: 'border-amber-400/90 hover:border-white',
    badgeBg: 'bg-amber-500/40',
    badgeBorder: 'border-amber-300',
    badgeText: 'text-amber-100',
    titleColor: 'text-amber-200',
    guidelineBg: 'bg-black/35 border-amber-400/50 text-amber-100'
  },
  {
    index: 6,
    month: 'Haziran 2027',
    value: 'Sevgi',
    quote: 'Sevelim sevilelim, bu dünya kimseye kalmaz.',
    author: 'Yunus Emre',
    guideline: 'Gönülleri birleştiren en büyük gücün karşılıksız sevgi olduğunu bilmek.',
    cardBg: 'bg-gradient-to-br from-[#be185d] via-[#831843] to-[#500724]',
    borderColor: 'border-pink-400/90 hover:border-white',
    badgeBg: 'bg-pink-500/40',
    badgeBorder: 'border-pink-300',
    badgeText: 'text-pink-100',
    titleColor: 'text-pink-200',
    guidelineBg: 'bg-black/35 border-pink-400/50 text-pink-100'
  },
  {
    index: 7,
    month: 'Temmuz 2027',
    value: 'Adalet',
    quote: 'Adalet kutup yıldızı gibi yerinde durur ve her şey onun etrafında döner.',
    author: 'Konfüçyüs',
    guideline: 'Her durumda haklının yanında olmak, hakkaniyeti üstün tutmak.',
    cardBg: 'bg-gradient-to-br from-[#1d4ed8] via-[#1e3a8a] to-[#172554]',
    borderColor: 'border-blue-400/90 hover:border-white',
    badgeBg: 'bg-blue-500/40',
    badgeBorder: 'border-blue-300',
    badgeText: 'text-blue-100',
    titleColor: 'text-blue-200',
    guidelineBg: 'bg-black/35 border-blue-400/50 text-blue-100'
  },
  {
    index: 8,
    month: 'Ağustos 2027',
    value: 'Hoşgörü',
    quote: 'Ne olursan ol, yine gel... Bizim dergâhımız ümitsizlik dergâhı değildir.',
    author: 'Mevlâna Celâleddîn-i Rûmî',
    guideline: 'Hataları affetme olgunluğu ve geniş bir yürekle kucak açmak.',
    cardBg: 'bg-gradient-to-br from-[#0f766e] via-[#115e59] to-[#042f2e]',
    borderColor: 'border-teal-400/90 hover:border-white',
    badgeBg: 'bg-teal-500/40',
    badgeBorder: 'border-teal-300',
    badgeText: 'text-teal-100',
    titleColor: 'text-teal-200',
    guidelineBg: 'bg-black/35 border-teal-400/50 text-teal-100'
  },
  {
    index: 9,
    month: 'Eylül 2027',
    value: 'Cesaret',
    quote: 'Cesaret, hak bildiğin yolda korkuyu bilgi ve inançla aşmaktır.',
    author: 'Bilgelik Öğüdü',
    guideline: 'Doğru olanı savunmaktan ve yeni ufuklara adım atmaktan çekinmemek.',
    cardBg: 'bg-gradient-to-br from-[#be123c] via-[#881337] to-[#4c0519]',
    borderColor: 'border-red-400/90 hover:border-white',
    badgeBg: 'bg-red-500/40',
    badgeBorder: 'border-red-300',
    badgeText: 'text-red-100',
    titleColor: 'text-red-200',
    guidelineBg: 'bg-black/35 border-red-400/50 text-red-100'
  },
  {
    index: 10,
    month: 'Ekim 2027',
    value: 'Sorumluluk',
    quote: 'Yalnızca yaptıklarımızdan değil, yapmadıklarımızdan da mesulüz.',
    author: 'Molière',
    guideline: 'Vazifelerini zamanında yerine getirip çevrene ve topluma sahip çıkmak.',
    cardBg: 'bg-gradient-to-br from-[#4338ca] via-[#312e81] to-[#1e1b4b]',
    borderColor: 'border-indigo-400/90 hover:border-white',
    badgeBg: 'bg-indigo-500/40',
    badgeBorder: 'border-indigo-300',
    badgeText: 'text-indigo-100',
    titleColor: 'text-indigo-200',
    guidelineBg: 'bg-black/35 border-indigo-400/50 text-indigo-100'
  },
  {
    index: 11,
    month: 'Kasım 2027',
    value: 'Empati',
    quote: 'Damdan düşenin halini, ancak damdan düşen anlar.',
    author: 'Nasreddin Hoca',
    guideline: 'Kendini başkalarının yerine koyabilmek ve dertlerine ortak olmak.',
    cardBg: 'bg-gradient-to-br from-[#a21caf] via-[#701a75] to-[#4a044e]',
    borderColor: 'border-fuchsia-400/90 hover:border-white',
    badgeBg: 'bg-fuchsia-500/40',
    badgeBorder: 'border-fuchsia-300',
    badgeText: 'text-fuchsia-100',
    titleColor: 'text-fuchsia-200',
    guidelineBg: 'bg-black/35 border-fuchsia-400/50 text-fuchsia-100'
  },
  {
    index: 12,
    month: 'Aralık 2027',
    value: 'Umut',
    quote: 'Gecenin en karanlık anı, şafağa en yakın zamandır.',
    author: 'Geleneksel Hikmet',
    guideline: 'Yarınlara daima aydınlık bir inanç ve heyecanla bakmak.',
    cardBg: 'bg-gradient-to-br from-[#0e7490] via-[#155e75] to-[#083344]',
    borderColor: 'border-cyan-400/90 hover:border-white',
    badgeBg: 'bg-cyan-500/40',
    badgeBorder: 'border-cyan-300',
    badgeText: 'text-cyan-100',
    titleColor: 'text-cyan-200',
    guidelineBg: 'bg-black/35 border-cyan-400/50 text-cyan-100'
  }
];

// Web Audio API Synthesizer
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playKey() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.035);
  }

  playUnlock() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.09);
      osc.stop(this.ctx.currentTime + idx * 0.09 + 0.4);
    });
  }

  playError() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(85, this.ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  playVictory() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const chordNotes = [
      { f: 523.25, d: 0.0 },
      { f: 659.25, d: 0.1 },
      { f: 783.99, d: 0.2 },
      { f: 1046.5, d: 0.3 },
      { f: 1318.5, d: 0.45 },
      { f: 1567.98, d: 0.6 }
    ];
    chordNotes.forEach(({ f, d }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + d);
      gain.gain.setValueAtTime(0, this.ctx.currentTime + d);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + d + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + d + 1.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + d);
      osc.stop(this.ctx.currentTime + d + 1.1);
    });
  }
}

const sfx = new SoundFX();

// Turkish normalization
function normalizeTurkish(input: string): string {
  if (!input) return '';
  return input
    .replace(/i/g, 'İ')
    .replace(/ı/g, 'I')
    .toLocaleUpperCase('tr-TR')
    .trim()
    .replace(/\s+/g, ' ');
}

type StageType = 'intro' | 'lock1' | 'lock2' | 'lock3' | 'lock4' | 'lock5' | 'final';

export default function App() {
  const [stage, setStage] = useState<StageType>('intro');
  const [locks, setLocks] = useState<boolean[]>([false, false, false, false, false]);
  const [inputValue, setInputValue] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const calendarPrintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sfx.enabled = !isMuted;
  }, [isMuted]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    setInputValue('');
    setFeedback({ type: 'idle', message: '' });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [stage]);

  // Confetti on final stage
  useEffect(() => {
    if (stage !== 'final') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    sfx.playVictory();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#14b8a6', '#06b6d4', '#fbbf24', '#38bdf8', '#e2e8f0'];
    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 3 + 3,
      rot: Math.random() * 360,
      vrot: Math.random() * 6 - 3
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      });
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [stage]);

  const toggleFullscreen = () => {
    sfx.playKey();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleVirtualKey = (char: string) => {
    sfx.playKey();
    setInputValue((prev) => prev + char);
    inputRef.current?.focus();
  };

  const handleVirtualBackspace = () => {
    sfx.playKey();
    setInputValue((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  const handleVirtualClear = () => {
    sfx.playKey();
    setInputValue('');
    inputRef.current?.focus();
  };

  const restartGame = () => {
    sfx.playKey();
    setStage('intro');
    setLocks([false, false, false, false, false]);
    setInputValue('');
    setFeedback({ type: 'idle', message: '' });
  };

  // Submit Answer Logic for 5 Locks
  const handleCheckAnswer = () => {
    const raw = inputValue;
    const normalized = normalizeTurkish(raw);

    if (stage === 'lock1') {
      // 1. Kilit: Sezar Şifrelemesi -> DÜRÜSTLÜK
      if (normalized === 'DÜRÜSTLÜK' || normalized === 'DURUSTLUK') {
        sfx.playUnlock();
        setLocks([true, locks[1], locks[2], locks[3], locks[4]]);
        setFeedback({ type: 'success', message: 'Tebrikler! 1. Kilit Açıldı: Dürüstlük' });
        setTimeout(() => setStage('lock2'), 1200);
      } else {
        sfx.playError();
        setIsShaking(true);
        setFeedback({ type: 'error', message: 'Hatalı şifre! Alfabede 2 adım geriye sayarak tekrar dene.' });
        setTimeout(() => setIsShaking(false), 500);
      }
    } else if (stage === 'lock2') {
      // 2. Kilit: Tersine Çevirme -> BİRLİKTEN KUVVET DOĞAR
      const compact = normalized.replace(/\s+/g, '');
      const isCorrect =
        normalized === 'BİRLİKTEN KUVVET DOĞAR' ||
        normalized === 'BIRLIKTEN KUVVET DOGAR' ||
        compact === 'BİRLİKTENKUVVETDOĞAR' ||
        compact === 'BIRLIKTENKUVVETDOGAR';

      if (isCorrect) {
        sfx.playUnlock();
        setLocks([locks[0], true, locks[2], locks[3], locks[4]]);
        setFeedback({ type: 'success', message: 'Harika! 2. Kilit Açıldı: Yardımlaşma' });
        setTimeout(() => setStage('lock3'), 1200);
      } else {
        sfx.playError();
        setIsShaking(true);
        setFeedback({ type: 'error', message: 'Hatalı söz! Metni tersine okuyup boşlukları ayarlayarak tekrar dene.' });
        setTimeout(() => setIsShaking(false), 500);
      }
    } else if (stage === 'lock3') {
      // 3. Kilit: Karakter Değiştirme -> SAYGI
      if (normalized === 'SAYGI') {
        sfx.playUnlock();
        setLocks([locks[0], locks[1], true, locks[3], locks[4]]);
        setFeedback({ type: 'success', message: 'Mükemmel! 3. Kilit Açıldı: Saygı' });
        setTimeout(() => setStage('lock4'), 1200);
      } else {
        sfx.playError();
        setIsShaking(true);
        setFeedback({ type: 'error', message: 'Hatalı değer! Sesli harf kuralını uygulayarak tekrar dene.' });
        setTimeout(() => setIsShaking(false), 500);
      }
    } else if (stage === 'lock4') {
      // 4. Kilit: Akrostiş Algoritması -> VEFA
      if (normalized === 'VEFA') {
        sfx.playUnlock();
        setLocks([locks[0], locks[1], locks[2], true, locks[4]]);
        setFeedback({ type: 'success', message: 'Tebrikler! 4. Kilit Açıldı: Vefa' });
        setTimeout(() => setStage('lock5'), 1200);
      } else {
        sfx.playError();
        setIsShaking(true);
        setFeedback({ type: 'error', message: 'Hatalı kelime! Her kelimenin ilk harfine odaklan.' });
        setTimeout(() => setIsShaking(false), 500);
      }
    } else if (stage === 'lock5') {
      // 5. Kilit: Anagram (Karışık Harfler) -> SABIR
      if (normalized === 'SABIR') {
        sfx.playUnlock();
        setLocks([locks[0], locks[1], locks[2], locks[3], true]);
        setFeedback({ type: 'success', message: 'Muhteşem! 5. Kilit Açıldı: Sabır' });
        setTimeout(() => setStage('final'), 1200);
      } else {
        sfx.playError();
        setIsShaking(true);
        setFeedback({ type: 'error', message: 'Hatalı kelime! Karışık harfleri doğru sıraya dizerek tekrar dene.' });
        setTimeout(() => setIsShaking(false), 500);
      }
    }
  };

  // Helper to ensure html2pdf is loaded
  const ensureHtml2Pdf = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && window.html2pdf) return true;
    return new Promise((resolve) => {
      const existing = document.querySelector('script[src*="html2pdf"]');
      if (existing) {
        if (window.html2pdf) return resolve(true);
        existing.addEventListener('load', () => resolve(!!window.html2pdf));
        setTimeout(() => resolve(!!window.html2pdf), 2000);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => resolve(!!window.html2pdf);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
      setTimeout(() => resolve(!!window.html2pdf), 2500);
    });
  };

  // PDF Export via html2pdf.js
  const handleDownloadPdf = async () => {
    sfx.playKey();
    const element = calendarPrintRef.current;
    if (!element) return;

    setIsGeneratingPdf(true);

    try {
      const isLoaded = await ensureHtml2Pdf();
      if (isLoaded && window.html2pdf) {
        const opt = {
          margin: [8, 8, 8, 8],
          filename: '2027_Degerler_Takvimi.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#070b14'
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };
        await window.html2pdf().set(opt).from(element).save();
      } else {
        window.print();
      }
    } catch (err) {
      console.error('PDF indirme hatası:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Calculate current stage index 1..5
  const getStageIndex = () => {
    if (stage === 'lock1') return 1;
    if (stage === 'lock2') return 2;
    if (stage === 'lock3') return 3;
    if (stage === 'lock4') return 4;
    if (stage === 'lock5') return 5;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e0854] via-[#1d4ed8] via-[#0284c7] to-[#047857] text-white flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Radiant Ambient Multi-Color Orbs */}
      <div className="absolute top-10 left-10 w-80 sm:w-96 h-80 sm:h-96 bg-pink-500/30 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/4 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-amber-400/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-400/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-400/30 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-500 ${
          stage === 'final' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Vibrant Multi-Color Header */}
      <header className="bg-slate-900/80 border-b-2 border-indigo-400/40 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xl shadow-indigo-950/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-500 to-rose-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/40 ring-2 ring-yellow-200">
            <Key className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-yellow-300 via-amber-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-md">
                DEĞER SANDIĞI
              </span>
              <span className="text-[11px] font-black text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-300 to-emerald-300 px-3 py-0.5 rounded-full shadow-md border border-white">
                ✨ 2027 Değerler Takvimi
              </span>
            </div>
            <p className="text-xs text-cyan-200 font-bold hidden sm:block">
              5 Aşamalı Renkli Kriptoloji ve Algoritma Macerası
            </p>
          </div>
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center gap-2">
          {stage !== 'final' && (
            <button
              onClick={() => {
                sfx.playKey();
                setShowKeyboard(!showKeyboard);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer shadow-md ${
                showKeyboard
                  ? 'bg-amber-400 text-slate-950 border-white shadow-amber-500/50 scale-105'
                  : 'bg-indigo-900/80 text-white border-indigo-400/60 hover:bg-indigo-800'
              }`}
              title="Sanal Klavyeyi Aç / Kapat"
            >
              <Keyboard className="w-4 h-4" />
              <span className="hidden lg:inline">Sanal Klavye</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsMuted(!isMuted);
              sfx.playKey();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-indigo-900/80 text-white border-2 border-indigo-400/60 hover:bg-indigo-800 transition-all cursor-pointer shadow-md"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
            <span className="hidden lg:inline">{isMuted ? 'Sessiz' : 'Ses Açık'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-2 border-yellow-200 hover:brightness-110 transition-all cursor-pointer shadow-md"
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Küçült' : 'Tam Ekran'}</span>
          </button>

          <button
            onClick={restartGame}
            className="p-2.5 rounded-xl text-white hover:bg-rose-600 bg-rose-700/80 border-2 border-rose-400 transition-all cursor-pointer shadow-md"
            title="Oyunu Baştan Başlat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Multi-Colored 5-Step Progress Bar */}
      <section className="bg-slate-900/85 border-b-2 border-indigo-400/40 px-4 py-2.5 shadow-lg backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto">
          {[
            { id: 1, label: '1. Sezar', stageKey: 'lock1', val: 'Dürüstlük', unlockedClass: 'bg-rose-500 text-white border-rose-300 shadow-[0_0_15px_#f43f5e]', activeClass: 'bg-rose-600 text-white border-rose-200 shadow-[0_0_20px_#f43f5e]' },
            { id: 2, label: '2. Ters Çevirme', stageKey: 'lock2', val: 'Yardımlaşma', unlockedClass: 'bg-emerald-500 text-white border-emerald-300 shadow-[0_0_15px_#10b981]', activeClass: 'bg-emerald-600 text-white border-emerald-200 shadow-[0_0_20px_#10b981]' },
            { id: 3, label: '3. Değiştirme', stageKey: 'lock3', val: 'Saygı', unlockedClass: 'bg-cyan-500 text-white border-cyan-300 shadow-[0_0_15px_#06b6d4]', activeClass: 'bg-cyan-600 text-white border-cyan-200 shadow-[0_0_20px_#06b6d4]' },
            { id: 4, label: '4. Akrostiş', stageKey: 'lock4', val: 'Vefa', unlockedClass: 'bg-purple-500 text-white border-purple-300 shadow-[0_0_15px_#a855f7]', activeClass: 'bg-purple-600 text-white border-purple-200 shadow-[0_0_20px_#a855f7]' },
            { id: 5, label: '5. Anagram', stageKey: 'lock5', val: 'Sabır', unlockedClass: 'bg-amber-400 text-slate-950 border-amber-200 shadow-[0_0_15px_#f59e0b]', activeClass: 'bg-amber-400 text-slate-950 border-yellow-100 shadow-[0_0_20px_#f59e0b]' }
          ].map((item, idx) => {
            const isUnlocked = locks[idx];
            const isCurrent = stage === item.stageKey;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-black transition-all whitespace-nowrap flex-1 justify-center ${
                  isUnlocked
                    ? `${item.unlockedClass} shadow-md`
                    : isCurrent
                    ? `${item.activeClass} ring-2 ring-white scale-105 animate-pulse`
                    : 'bg-slate-950/60 border-slate-700/60 text-slate-300/80'
                }`}
              >
                {isUnlocked ? <Unlock className="w-3.5 h-3.5 stroke-[2.5]" /> : <Lock className="w-3.5 h-3.5" />}
                <span>
                  {item.id}. {isUnlocked ? item.val : item.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-5xl w-full mx-auto relative z-10">
        {/* ================= CHEST STAGES (INTRO & 5 LOCKS) ================= */}
        {stage !== 'final' && (
          <div className="w-full flex flex-col items-center">
            {/* Luminous Golden Treasure Chest with Rainbow Gemstone Locks */}
            <div className="relative mb-6 sm:mb-8 flex flex-col items-center">
              <div
                className={`w-72 sm:w-88 h-40 sm:h-48 rounded-3xl relative transition-all duration-500 flex flex-col items-center justify-center z-10 border-4 border-yellow-200 bg-gradient-to-b from-[#f59e0b] via-[#d97706] to-[#92400e] shadow-[0_20px_60px_rgba(245,158,11,0.5)] ${
                  locks.filter(Boolean).length > 0 ? 'animate-chest-glow' : ''
                }`}
              >
                {/* Shimmering Golden Metal Straps with Rivets */}
                <div className="absolute top-4 left-3 right-3 h-3 bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-100 rounded-sm shadow-md flex justify-between items-center px-4">
                  <div className="w-2 h-2 rounded-full bg-amber-950"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-950"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-950"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-950"></div>
                </div>
                <div className="absolute bottom-4 left-3 right-3 h-3 bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-100 rounded-sm shadow-md flex justify-between items-center px-4">
                  <div className="w-2 h-2 rounded-full bg-amber-950"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-950"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-950"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-950"></div>
                </div>

                {/* 5 Jewel-Toned Lock Sockets */}
                <div className="bg-slate-950/90 border-2 border-yellow-300 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3.5 z-20 shadow-2xl">
                  {locks.map((isUnlocked, idx) => {
                    const jewelColors = [
                      { bg: 'from-rose-500 to-red-600', border: 'border-rose-200', glow: 'shadow-[0_0_20px_#f43f5e]' },
                      { bg: 'from-emerald-400 to-teal-600', border: 'border-emerald-200', glow: 'shadow-[0_0_20px_#10b981]' },
                      { bg: 'from-sky-400 to-blue-600', border: 'border-sky-200', glow: 'shadow-[0_0_20px_#0284c7]' },
                      { bg: 'from-purple-400 to-fuchsia-600', border: 'border-purple-200', glow: 'shadow-[0_0_20px_#a855f7]' },
                      { bg: 'from-amber-300 to-yellow-500', border: 'border-amber-100', glow: 'shadow-[0_0_20px_#f59e0b]' }
                    ];
                    const jewel = jewelColors[idx];
                    return (
                      <div
                        key={idx}
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                          isUnlocked
                            ? `bg-gradient-to-br ${jewel.bg} ${jewel.border} text-white ${jewel.glow} scale-110 ring-2 ring-white`
                            : getStageIndex() === idx + 1
                            ? `bg-gradient-to-br ${jewel.bg} ${jewel.border} text-white ${jewel.glow} scale-105 animate-pulse ring-2 ring-white`
                            : 'bg-black/60 border-amber-600/50 text-amber-500/50'
                        }`}
                        title={`${idx + 1}. Kilit`}
                      >
                        {isUnlocked ? <Unlock className="w-4 sm:w-5 h-4 sm:h-5 stroke-[2.5]" /> : <Lock className="w-4 sm:w-5 h-4 sm:h-5" />}
                      </div>
                    );
                  })}
                </div>

                {/* Status Indicator */}
                <div className="absolute -bottom-4 text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 border-2 border-white px-4 py-1 rounded-full shadow-xl">
                  ✨ {locks.filter(Boolean).length} / 5 Kilit Açıldı
                </div>
              </div>
            </div>

            {/* -------------------- STAGE: INTRO -------------------- */}
            {stage === 'intro' && (
              <div className="w-full max-w-xl bg-gradient-to-b from-indigo-900/90 via-slate-900/95 to-purple-900/90 border-3 border-amber-400 rounded-3xl p-6 sm:p-9 shadow-[0_25px_60px_rgba(245,158,11,0.35)] text-center backdrop-blur-xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 text-xs font-black mb-4 shadow-lg border border-yellow-200">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>GİZEMLİ VE RENKLİ DEĞER SANDIĞI</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-yellow-200 via-amber-300 to-rose-300 bg-clip-text text-transparent tracking-tight mb-3 drop-shadow">
                  Değer Sandığına Hoş Geldin!
                </h1>

                <p className="text-cyan-100 text-base sm:text-lg font-bold leading-relaxed mb-7 max-w-md mx-auto">
                  Şifreleri çöz, sandığı aç ve 2027 Değerler Hazinesine ulaş.
                </p>

                <button
                  onClick={() => {
                    sfx.playKey();
                    setStage('lock1');
                  }}
                  className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 font-black text-lg shadow-xl shadow-orange-500/40 hover:scale-[1.03] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 mx-auto cursor-pointer border-2 border-yellow-200"
                >
                  <Key className="w-5 h-5 stroke-[2.5]" />
                  <span>Kilidi Açmaya Başla</span>
                </button>
              </div>
            )}

            {/* -------------------- 1. KİLİT: SEZAR ŞİFRELEMESİ (RUBY / ROSE THEME) -------------------- */}
            {stage === 'lock1' && (
              <div className="w-full max-w-xl bg-gradient-to-b from-rose-950/90 via-slate-900/95 to-pink-950/90 border-3 border-rose-400 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(244,63,94,0.4)] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-white bg-rose-600 px-3.5 py-1 rounded-full shadow-md border border-rose-300">
                    💎 1. Kilit: Sezar Şifrelemesi
                  </span>
                  <span className="text-xs text-rose-200 font-black bg-rose-900/80 px-3 py-1 rounded-lg border border-rose-400">1 / 5 Kilit</span>
                </div>

                <div className="bg-rose-900/70 border-2 border-rose-400 rounded-2xl p-4 mb-5 text-white text-center font-black text-base sm:text-lg shadow-md">
                  Alfabede 2 adım geriye git.
                </div>

                <div className="bg-slate-950/80 border-2 border-rose-400 rounded-2xl p-5 text-center mb-5 shadow-inner">
                  <span className="text-xs font-black text-rose-300 tracking-widest uppercase block mb-2">
                    ŞİFRELİ METİN
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-rose-300 tracking-[0.3em] font-mono drop-shadow-[0_0_15px_rgba(244,63,94,0.9)]">
                    B S P S Q R J S I
                  </div>
                </div>

                {/* Input & Action */}
                <div className="space-y-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                    placeholder="Kelimeyi buraya yazın..."
                    className={`w-full bg-slate-950/90 border-3 rounded-2xl px-5 py-4 text-xl sm:text-2xl font-black text-center text-white placeholder:text-rose-300/40 outline-none uppercase tracking-widest transition-all ${
                      isShaking
                        ? 'animate-shake border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.8)]'
                        : feedback.type === 'success'
                        ? 'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.7)]'
                        : 'border-rose-400 focus:border-rose-300 focus:shadow-[0_0_25px_rgba(244,63,94,0.6)]'
                    }`}
                    autoComplete="off"
                  />

                  {feedback.message && (
                    <div
                      className={`p-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 ${
                        feedback.type === 'success'
                          ? 'bg-emerald-900/90 border-2 border-emerald-400 text-white'
                          : 'bg-rose-900/90 border-2 border-rose-400 text-white'
                      }`}
                    >
                      {feedback.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
                      )}
                      <span>{feedback.message}</span>
                    </div>
                  )}

                  <button
                    onClick={handleCheckAnswer}
                    className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 text-white font-black text-xl shadow-xl shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-300"
                  >
                    <Unlock className="w-6 h-6 stroke-[2.5]" />
                    <span>KONTROL ET VE AÇ 🔓</span>
                  </button>
                </div>
              </div>
            )}

            {/* -------------------- 2. KİLİT: TERSİNE ÇEVİRME (EMERALD THEME) -------------------- */}
            {stage === 'lock2' && (
              <div className="w-full max-w-xl bg-gradient-to-b from-emerald-950/90 via-slate-900/95 to-teal-950/90 border-3 border-emerald-400 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(16,185,129,0.4)] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-white bg-emerald-600 px-3.5 py-1 rounded-full shadow-md border border-emerald-300">
                    💎 2. Kilit: Tersine Çevirme Algoritması
                  </span>
                  <span className="text-xs text-emerald-200 font-black bg-emerald-900/80 px-3 py-1 rounded-lg border border-emerald-400">2 / 5 Kilit</span>
                </div>

                <div className="bg-emerald-900/70 border-2 border-emerald-400 rounded-2xl p-4 mb-5 text-white text-center font-black text-base sm:text-lg shadow-md">
                  Sondan başa doğru oku ve gizli boşlukları bul.
                </div>

                <div className="bg-slate-950/80 border-2 border-emerald-400 rounded-2xl p-5 text-center mb-5 shadow-inner">
                  <span className="text-xs font-black text-emerald-300 tracking-widest uppercase block mb-2">
                    ŞİFRELİ METİN
                  </span>
                  <div className="text-xl sm:text-3xl font-black text-emerald-300 tracking-widest font-mono drop-shadow-[0_0_15px_rgba(16,185,129,0.9)]">
                    RAĞODTEVVUKNETKİLRİB
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                    placeholder="Atasözünü yazın..."
                    className={`w-full bg-slate-950/90 border-3 rounded-2xl px-5 py-4 text-xl sm:text-2xl font-black text-center text-white placeholder:text-emerald-300/40 outline-none uppercase tracking-wide transition-all ${
                      isShaking
                        ? 'animate-shake border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.8)]'
                        : feedback.type === 'success'
                        ? 'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.7)]'
                        : 'border-emerald-400 focus:border-emerald-300 focus:shadow-[0_0_25px_rgba(16,185,129,0.6)]'
                    }`}
                    autoComplete="off"
                  />

                  {feedback.message && (
                    <div
                      className={`p-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 ${
                        feedback.type === 'success'
                          ? 'bg-emerald-900/90 border-2 border-emerald-400 text-white'
                          : 'bg-rose-900/90 border-2 border-rose-400 text-white'
                      }`}
                    >
                      {feedback.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
                      )}
                      <span>{feedback.message}</span>
                    </div>
                  )}

                  <button
                    onClick={handleCheckAnswer}
                    className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-xl shadow-xl shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-300"
                  >
                    <Unlock className="w-6 h-6 stroke-[2.5]" />
                    <span>KONTROL ET VE AÇ 🔓</span>
                  </button>
                </div>
              </div>
            )}

            {/* -------------------- 3. KİLİT: KARAKTER DEĞİŞTİRME (CYAN THEME) -------------------- */}
            {stage === 'lock3' && (
              <div className="w-full max-w-xl bg-gradient-to-b from-cyan-950/90 via-slate-900/95 to-blue-950/90 border-3 border-cyan-400 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(6,182,212,0.4)] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-white bg-cyan-600 px-3.5 py-1 rounded-full shadow-md border border-cyan-300">
                    💎 3. Kilit: Karakter Değiştirme
                  </span>
                  <span className="text-xs text-cyan-200 font-black bg-cyan-900/80 px-3 py-1 rounded-lg border border-cyan-400">3 / 5 Kilit</span>
                </div>

                <div className="bg-cyan-900/70 border-2 border-cyan-400 rounded-2xl p-4 mb-5 text-white text-center font-black text-base sm:text-lg shadow-md">
                  Sadece sesli harflere odaklan: A=1, E=2, I=3, İ=4, O=5...
                </div>

                <div className="bg-slate-950/80 border-2 border-cyan-400 rounded-2xl p-5 text-center mb-5 shadow-inner">
                  <span className="text-xs font-black text-cyan-300 tracking-widest uppercase block mb-2">
                    ŞİFRELİ METİN
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-cyan-300 tracking-[0.4em] font-mono drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]">
                    S1YG3
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                    placeholder="Değeri yazın..."
                    className={`w-full bg-slate-950/90 border-3 rounded-2xl px-5 py-4 text-xl sm:text-2xl font-black text-center text-white placeholder:text-cyan-300/40 outline-none uppercase tracking-widest transition-all ${
                      isShaking
                        ? 'animate-shake border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.8)]'
                        : feedback.type === 'success'
                        ? 'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.7)]'
                        : 'border-cyan-400 focus:border-cyan-300 focus:shadow-[0_0_25px_rgba(6,182,212,0.6)]'
                    }`}
                    autoComplete="off"
                  />

                  {feedback.message && (
                    <div
                      className={`p-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 ${
                        feedback.type === 'success'
                          ? 'bg-emerald-900/90 border-2 border-emerald-400 text-white'
                          : 'bg-rose-900/90 border-2 border-rose-400 text-white'
                      }`}
                    >
                      {feedback.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
                      )}
                      <span>{feedback.message}</span>
                    </div>
                  )}

                  <button
                    onClick={handleCheckAnswer}
                    className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-black text-xl shadow-xl shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-300"
                  >
                    <Unlock className="w-6 h-6 stroke-[2.5]" />
                    <span>KONTROL ET VE AÇ 🔓</span>
                  </button>
                </div>
              </div>
            )}

            {/* -------------------- 4. KİLİT: AKROSTİŞ (PURPLE THEME) -------------------- */}
            {stage === 'lock4' && (
              <div className="w-full max-w-xl bg-gradient-to-b from-purple-950/90 via-slate-900/95 to-fuchsia-950/90 border-3 border-purple-400 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(168,85,247,0.4)] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-white bg-purple-600 px-3.5 py-1 rounded-full shadow-md border border-purple-300">
                    💎 4. Kilit: Akrostiş Algoritması
                  </span>
                  <span className="text-xs text-purple-200 font-black bg-purple-900/80 px-3 py-1 rounded-lg border border-purple-400">4 / 5 Kilit</span>
                </div>

                <div className="bg-purple-900/70 border-2 border-purple-400 rounded-2xl p-4 mb-5 text-white text-center font-black text-base sm:text-lg shadow-md">
                  Kelimelerin başındaki sırrı çöz.
                </div>

                <div className="bg-slate-950/80 border-2 border-purple-400 rounded-2xl p-5 text-center mb-5 shadow-inner">
                  <span className="text-xs font-black text-purple-300 tracking-widest uppercase block mb-2">
                    ŞİFRELİ METİN
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-purple-200 tracking-wide drop-shadow-[0_0_15px_rgba(168,85,247,0.9)] leading-relaxed">
                    <span className="text-yellow-300 text-2xl sm:text-3xl font-extrabold underline decoration-yellow-400">V</span>akit{' '}
                    <span className="text-yellow-300 text-2xl sm:text-3xl font-extrabold underline decoration-yellow-400">E</span>rken{' '}
                    <span className="text-yellow-300 text-2xl sm:text-3xl font-extrabold underline decoration-yellow-400">F</span>ırtına{' '}
                    <span className="text-yellow-300 text-2xl sm:text-3xl font-extrabold underline decoration-yellow-400">A</span>kşamı
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                    placeholder="Gizli değeri yazın..."
                    className={`w-full bg-slate-950/90 border-3 rounded-2xl px-5 py-4 text-xl sm:text-2xl font-black text-center text-white placeholder:text-purple-300/40 outline-none uppercase tracking-widest transition-all ${
                      isShaking
                        ? 'animate-shake border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.8)]'
                        : feedback.type === 'success'
                        ? 'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.7)]'
                        : 'border-purple-400 focus:border-purple-300 focus:shadow-[0_0_25px_rgba(168,85,247,0.6)]'
                    }`}
                    autoComplete="off"
                  />

                  {feedback.message && (
                    <div
                      className={`p-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 ${
                        feedback.type === 'success'
                          ? 'bg-emerald-900/90 border-2 border-emerald-400 text-white'
                          : 'bg-rose-900/90 border-2 border-rose-400 text-white'
                      }`}
                    >
                      {feedback.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
                      )}
                      <span>{feedback.message}</span>
                    </div>
                  )}

                  <button
                    onClick={handleCheckAnswer}
                    className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white font-black text-xl shadow-xl shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-purple-300"
                  >
                    <Unlock className="w-6 h-6 stroke-[2.5]" />
                    <span>KONTROL ET VE AÇ 🔓</span>
                  </button>
                </div>
              </div>
            )}

            {/* -------------------- 5. KİLİT: ANAGRAM (GOLD / AMBER THEME) -------------------- */}
            {stage === 'lock5' && (
              <div className="w-full max-w-xl bg-gradient-to-b from-amber-950/90 via-slate-900/95 to-orange-950/90 border-3 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(245,158,11,0.4)] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-3.5 py-1 rounded-full shadow-md border border-white">
                    💎 5. Kilit: Anagram (Karışık Harfler)
                  </span>
                  <span className="text-xs text-amber-200 font-black bg-amber-900/80 px-3 py-1 rounded-lg border border-amber-400">5 / 5 Kilit</span>
                </div>

                <div className="bg-amber-900/70 border-2 border-amber-400 rounded-2xl p-4 mb-5 text-white text-center font-black text-base sm:text-lg shadow-md">
                  Harflerin yeri karışmış. Doğru sıraya dizerek bu erdemi ortaya çıkar.
                </div>

                <div className="bg-slate-950/80 border-2 border-amber-400 rounded-2xl p-5 text-center mb-5 shadow-inner">
                  <span className="text-xs font-black text-amber-300 tracking-widest uppercase block mb-2">
                    ŞİFRELİ METİN
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-[0.4em] font-mono drop-shadow-[0_0_15px_rgba(245,158,11,0.9)]">
                    R I S B A
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                    placeholder="Son gizli kelimeyi yazın..."
                    className={`w-full bg-slate-950/90 border-3 rounded-2xl px-5 py-4 text-xl sm:text-2xl font-black text-center text-white placeholder:text-amber-300/40 outline-none uppercase tracking-widest transition-all ${
                      isShaking
                        ? 'animate-shake border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.8)]'
                        : feedback.type === 'success'
                        ? 'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.7)]'
                        : 'border-amber-400 focus:border-amber-300 focus:shadow-[0_0_25px_rgba(245,158,11,0.6)]'
                    }`}
                    autoComplete="off"
                  />

                  {feedback.message && (
                    <div
                      className={`p-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 ${
                        feedback.type === 'success'
                          ? 'bg-emerald-900/90 border-2 border-emerald-400 text-white'
                          : 'bg-rose-900/90 border-2 border-rose-400 text-white'
                      }`}
                    >
                      {feedback.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
                      )}
                      <span>{feedback.message}</span>
                    </div>
                  )}

                  <button
                    onClick={handleCheckAnswer}
                    className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-slate-950 font-black text-xl shadow-xl shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-yellow-200"
                  >
                    <Sparkles className="w-6 h-6 stroke-[2.5]" />
                    <span>KONTROL ET VE HAZİNEYE ULAŞ ✨</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= FINAL STAGE: 2027 DEĞERLER TAKVİMİ ================= */}
        {stage === 'final' && (
          <div className="w-full flex flex-col items-center animate-lock-pop">
            {/* Top Celebration & PDF Export Header */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-indigo-900/80">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-black uppercase text-amber-300 bg-gradient-to-r from-amber-500/25 to-rose-500/25 border border-amber-400/60 px-3 py-1 rounded-full shadow-sm">
                    ✨ 5 Kilit Çözüldü • Hazine Açıldı
                  </span>
                  <span className="text-xs text-indigo-300 font-bold bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-800">Yıl 2027</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                  2027 Değerler Takvimi
                </h1>
                <p className="text-xs sm:text-sm text-indigo-200/90 font-bold">
                  12 Aya ait erdemler, bilgelik sözleri ve rehber ilkeler.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-60"
                >
                  <FileDown className="w-5 h-5 stroke-[2.5]" />
                  <span>{isGeneratingPdf ? '⏳ PDF Hazırlanıyor...' : '📥 Takvimi PDF Olarak İndir'}</span>
                </button>

                <button
                  onClick={restartGame}
                  className="px-5 py-3.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border-2 border-indigo-800/80 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Yeniden Oyna</span>
                </button>
              </div>
            </div>

            {/* 2027 VALUES CALENDAR PRINT AREA (No day numbers/schedule grid) */}
            <div
              ref={calendarPrintRef}
              id="calendarPrintTarget"
              className="w-full bg-slate-900/90 border-3 border-indigo-400/80 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-5 pb-4 border-b-2 border-indigo-500/40 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-yellow-300 via-amber-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow">
                    2027 Yılı Değerler ve Bilgelik Takvimi
                  </h2>
                  <p className="text-xs sm:text-sm text-cyan-200 font-bold">
                    Kriptoloji ve Algoritma Hazinesi • Ortaokul Değerler Eğitimi
                  </p>
                </div>
                <span className="text-xs font-black text-slate-950 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 border-2 border-white px-4 py-1.5 rounded-full shadow-lg">
                  🌟 12 Ay • 12 Erdem
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {MONTHS_2027.map((m) => (
                  <div
                    key={m.index}
                    className={`${m.cardBg} border-2 ${m.borderColor} rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all group`}
                  >
                    <div>
                      {/* Month & Value Tag */}
                      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/20">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300 drop-shadow">
                          {m.month}
                        </span>
                        <span className={`text-xs font-black ${m.badgeBg} border ${m.badgeBorder} ${m.badgeText} px-2.5 py-0.5 rounded-full shadow-md`}>
                          {m.value}
                        </span>
                      </div>

                      {/* Prominent Value Title */}
                      <h3 className={`text-2xl font-black ${m.titleColor} mb-2 tracking-tight drop-shadow`}>
                        {m.value}
                      </h3>

                      {/* Inspiring Value Quote */}
                      <p className="text-xs sm:text-sm text-white font-medium italic leading-relaxed mb-3 drop-shadow-sm">
                        "{m.quote}"
                      </p>

                      {/* Monthly Wisdom Guideline */}
                      <div className={`text-[11px] font-bold ${m.guidelineBg} border rounded-xl p-2.5 shadow-inner leading-relaxed`}>
                        <span className="font-black text-yellow-300">📌 Rehber İlke:</span> {m.guideline}
                      </div>
                    </div>

                    {/* Author Attribution */}
                    <div className="pt-3 border-t border-white/20 mt-4 flex items-center justify-between text-xs">
                      <span className="font-black text-amber-200">— {m.author}</span>
                      <span className="text-[11px] text-white/80 font-mono font-bold">2027</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Print Footer */}
              <div className="mt-6 pt-4 border-t-2 border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between text-xs text-cyan-100 font-black gap-2">
                <span>Değer Sandığı • 2027 Değerler Takvimi</span>
                <span className="text-yellow-300 font-black">
                  "Dürüstlük · Yardımlaşma · Saygı · Vefa · Sabır"
                </span>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- SMARTBOARD TOUCH KEYBOARD -------------------- */}
        {showKeyboard && stage !== 'intro' && stage !== 'final' && (
          <div className="w-full max-w-2xl mt-5 bg-slate-900/95 border-2 border-indigo-400 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between px-2 pb-2.5 mb-2.5 border-b-2 border-indigo-500/40 text-xs">
              <span className="font-black text-yellow-300 text-sm">⌨️ Dokunmatik Akıllı Tahta Klavyesi</span>
              <button
                onClick={() => setShowKeyboard(false)}
                className="text-white hover:bg-rose-600 text-xs font-black px-3 py-1 rounded-lg bg-indigo-900 border border-indigo-400 cursor-pointer shadow-sm"
              >
                Gizle ✕
              </button>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-12 gap-1 mb-1.5">
              {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleVirtualKey(k)}
                  className="h-12 rounded-xl bg-indigo-950 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-slate-950 text-white font-black text-base border-2 border-indigo-500/50 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-md"
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-11 gap-1 mb-1.5 px-1">
              {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleVirtualKey(k)}
                  className="h-12 rounded-xl bg-indigo-950 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-slate-950 text-white font-black text-base border-2 border-indigo-500/50 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-md"
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-11 gap-1 mb-1.5">
              {['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleVirtualKey(k)}
                  className="h-12 rounded-xl bg-indigo-950 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-slate-950 text-white font-black text-base border-2 border-indigo-500/50 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-md"
                >
                  {k}
                </button>
              ))}
              <button
                onClick={handleVirtualBackspace}
                className="col-span-2 h-12 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs border-2 border-rose-300 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-md shadow-rose-600/30"
              >
                ⌫ Sil
              </button>
            </div>

            {/* Row 4: Space & Submit */}
            <div className="grid grid-cols-12 gap-1.5">
              <button
                onClick={handleVirtualClear}
                className="col-span-2 h-12 rounded-xl bg-purple-900/90 hover:bg-purple-700 text-purple-100 font-black text-xs border-2 border-purple-400 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-md"
              >
                Temizle
              </button>
              <button
                onClick={() => handleVirtualKey(' ')}
                className="col-span-6 h-12 rounded-xl bg-cyan-900/90 hover:bg-cyan-700 text-cyan-100 font-black text-xs border-2 border-cyan-400 active:scale-95 transition-all flex items-center justify-center tracking-wider cursor-pointer shadow-md"
              >
                ␣ Boşluk
              </button>
              <button
                onClick={handleCheckAnswer}
                className="col-span-4 h-12 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-emerald-500/40 cursor-pointer border-2 border-white"
              >
                Onayla ↵
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Vibrant Footer */}
      <footer className="bg-slate-900/85 border-t-2 border-indigo-400/40 py-3.5 px-4 text-center text-xs text-cyan-200 font-black">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span>Değer Sandığı • 5 Aşamalı Kriptoloji Oyunu</span>
          <span className="text-yellow-300 font-black">🌟 2027 Değerler Takvimi</span>
        </div>
      </footer>
    </div>
  );
}
