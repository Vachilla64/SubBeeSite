import { useEffect, useRef, useState } from 'react'
import './index.css'

// --- Tiny helpers ---

function BeeCard() {
  return (
    <div className="card-gradient rounded-[28px] p-6 text-white w-full max-w-[320px] shadow-2xl">
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-60 mb-1">Virtual Card</p>
          <p className="text-2xl font-bold text-tabular">₦ 0.00</p>
        </div>
        <svg className="w-8 h-8 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="5" width="20" height="14" rx="3"/>
          <path d="M2 10h20"/>
        </svg>
      </div>
      <p className="text-[11px] opacity-60 mb-6 leading-snug max-w-[200px]">
        Kept empty for safety. Funded the moment your bill is due.
      </p>
      <div className="card-dots flex items-center justify-between opacity-80">
        <span>••••</span>
        <span>••••</span>
        <span>••••</span>
        <span className="font-semibold tracking-wider">3712</span>
      </div>
    </div>
  )
}

function BalancePanel() {
  return (
    <div className="gold-panel honeycomb-bg rounded-[28px] p-6 text-white w-full max-w-[320px] shadow-2xl shadow-[#E9B84A33]">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs uppercase tracking-widest opacity-70">Total Balance</p>
        <img src="/assets/subbee-logo.png" className="h-8 drop-shadow-lg" alt="" />
      </div>
      <p className="text-4xl font-black text-tabular mb-3">₦ 45,500</p>
      <div className="bg-white/20 rounded-xl px-4 py-2 flex justify-between text-xs font-medium backdrop-blur-sm">
        <span>Available: ₦22,000</span>
        <span className="opacity-70">Reserved: ₦23,500</span>
      </div>
      {/* Pill subscriptions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {['Netflix', 'Spotify', 'DSTV', 'Gym'].map(s => (
          <span key={s} className="bg-white/20 backdrop-blur-sm text-[11px] px-3 py-1 rounded-full font-medium">{s}</span>
        ))}
      </div>
    </div>
  )
}

// --- Side nav dots ---
function SideNav({ current, total, onGoTo }: { current: number; total: number; onGoTo: (i: number) => void }) {
  const percentage = (current / (total - 1)) * 100;
  const labels = ['Home', 'Pain Points', 'How it Works', 'Security', 'Alerts', 'Join Beta'];
  const isVisible = current > 0 && current < total - 1;

  return (
    <div className={`fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center h-[320px] justify-between py-4 transition-all duration-500 ease-in-out ${
      isVisible ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4 pointer-events-none'
    }`}>
      {/* The Dotted Track Line */}
      <div className="absolute top-4 bottom-4 w-0 border-r-2 border-dashed border-[#1E2A2E]/20 pointer-events-none z-0" />
      
      {/* Sliding Bee Thumb */}
      <div 
        className="absolute w-8 h-8 z-20 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-center"
        style={{ 
          top: `calc(${percentage}% - 0rem + 16px)`, // Offset alignment
          transform: 'translateY(-50%)',
        }}
      >
        <img 
          src="/assets/subbee-logo.png" 
          alt="Bee indicator" 
          className="w-7 h-7 drop-shadow-md animate-bounce" 
          style={{ animationDuration: '2s' }}
        />
      </div>

      {/* Checkpoint Dots */}
      {Array.from({ length: total }).map((_, i) => {
        const isActive = current === i;
        return (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            className="group relative w-8 h-8 flex items-center justify-center z-10 focus:outline-none"
            aria-label={`Go to section ${i + 1}`}
          >
            {/* The Dot representation */}
            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              isActive 
                ? 'bg-[#E9B84A] border-[#E9B84A] scale-110 shadow-sm' 
                : 'bg-white border-[#1E2A2E]/30 group-hover:border-[#E9B84A] group-hover:scale-105'
            }`} />
            
            {/* Hover Tooltip Label */}
            <div className="absolute right-10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 bg-[#1E2A2E] text-white text-[11px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
              {labels[i]}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// --- Slide wrapper with Intersection Observer ---
function Slide({
  id,
  className = '',
  children,
  onVisible,
  index,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
  onVisible: (i: number) => void;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(index) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index, onVisible])

  return (
    <section
      id={id}
      ref={ref}
      className={`snap flex items-center justify-center px-6 relative overflow-hidden ${className}`}
    >
      {children}
    </section>
  )
}

// --- Main App ---
export default function App() {
  const [current, setCurrent] = useState(0)

  const TOTAL = 6

  function goTo(i: number) {
    const el = document.getElementById(`slide-${i}`)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const slides = [
    // 0 — Hero
    <Slide key={0} id="slide-0" onVisible={setCurrent} index={0} className="bg-[#FFFFFC]">
      {/* big blurred gold orb */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#E9B84A] opacity-10 blur-[120px] pointer-events-none" />

      {/* Bottom meadow */}
      <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none z-0">
        <img src="/assets/meadow.png" alt="" className="w-full h-full object-cover object-bottom" />
      </div>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left copy */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#183739]/5 text-[#183739] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A6E52]" />
            Nomba Hackathon 2026
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[5.5rem] font-black leading-[1.1] md:leading-[1.0] tracking-tight text-[#1E2A2E] mb-6">
            Never miss a<br/>
            <span className="underline-gold">payment</span>
            <br/>again.
          </h1>

          <p className="text-base sm:text-lg text-[#1E2A2E]/60 leading-relaxed max-w-md mb-10">
            One wallet, one virtual card. Fund SubBee once and we pay
            your Netflix, Spotify, and every bill — automatically, on time.
          </p>

          <div className="flex gap-4 flex-wrap">
            <button
              className="bg-[#183739] text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#2E6264] transition-colors"
              onClick={() => goTo(5)}
            >
              Get started free
            </button>
            <button
              className="text-[#183739] px-8 py-3.5 rounded-full font-semibold text-sm border border-[#183739]/20 hover:border-[#183739]/40 transition-colors"
              onClick={() => goTo(2)}
            >
              See how it works ↓
            </button>
          </div>
        </div>

        {/* Right: stacked cards */}
        <div className="relative h-[360px] sm:h-[380px] w-full max-w-[320px] sm:max-w-none mx-auto scale-90 sm:scale-100 origin-center flex items-center justify-center">
          <div className="absolute top-0 right-0 rotate-[-6deg] origin-bottom-left scale-90 sm:scale-100">
            <BalancePanel />
          </div>
          <div className="absolute bottom-0 left-0 rotate-[4deg] origin-bottom-right sm:left-12 scale-90 sm:scale-100">
            <BeeCard />
          </div>
        </div>
      </div>
    </Slide>,

    // 1 — The pain
    <Slide key={1} id="slide-1" onVisible={setCurrent} index={1} className="bg-[#183739] text-white">
      <div className="max-w-3xl w-full text-center">
        <p className="text-[#E9B84A] text-sm font-bold uppercase tracking-widest mb-6">Sound familiar?</p>
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-black leading-tight mb-8 md:mb-12">
          Your subscription<br/>failed. <span className="opacity-30">Again.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-4 text-left">
          {[
            { emoji: '😬', head: 'Surprise charge', body: 'You forgot the free trial ended. You wake up to a debit you weren\'t ready for.' },
            { emoji: '💸', head: 'Low balance, failed bill', body: 'You keep your main account low for security. Netflix disagrees.' },
            { emoji: '😰', head: 'Too many cards out there', body: 'Five streaming sites have your debit card. One breach and it\'s all gone.' },
          ].map(({ emoji, head, body }) => (
            <div key={head} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
              <p className="text-3xl mb-3">{emoji}</p>
              <p className="font-bold text-base mb-2">{head}</p>
              <p className="text-sm text-white/60 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-white/40 text-sm">Scroll to see the fix ↓</p>
      </div>
    </Slide>,

    // 2 — How it works
    <Slide key={2} id="slide-2" onVisible={setCurrent} index={2} className="bg-[#FFFFFC]">
      <div className="max-w-4xl w-full">
        <p className="text-[#E9B84A] text-sm font-bold uppercase tracking-widest mb-4 text-center">How it works</p>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-[#1E2A2E] leading-tight text-center mb-8 md:mb-16">
          Four steps.<br/>Then you're done.
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { n: '1', head: 'Deposit once', body: 'Get a dedicated Nomba account number. Transfer your monthly budget — ₦50,000, ₦20,000, whatever fits.' },
            { n: '2', head: 'Add subscriptions', body: 'Tell us: Netflix, monthly, ₦4,900. DSTV, monthly, ₦13,000. We remember everything.' },
            { n: '3', head: 'Get your virtual card', body: 'We issue you an isolated Mastercard — never your real card, always kept at ₦0 for safety.' },
            { n: '4', head: 'We handle the rest', body: 'You\'ll get a Telegram reminder 3 days before any charge. We pay it on time, every time.' },
          ].map(({ n, head, body }) => (
            <div key={n} className="relative bg-white border border-gray-100 rounded-2xl p-7 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <span className="step-num">{n}</span>
              <p className="font-black text-2xl text-[#1E2A2E] mb-2 relative z-10">{head}</p>
              <p className="text-[#1E2A2E]/60 text-sm leading-relaxed relative z-10">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>,

    // 3 — Security feature
    <Slide key={3} id="slide-3" onVisible={setCurrent} index={3} className="bg-[#1E2A2E] text-white">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[#E9B84A] text-sm font-bold uppercase tracking-widest mb-6">Security</p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
            Your card stays<br/>at <span className="text-[#E9B84A] text-tabular">₦ 0.00</span>.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm mb-8">
            We move the exact amount to your card only milliseconds before
            a charge is processed. Between charges, there's nothing to steal.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#E9B84A]/10 text-[#E9B84A] px-4 py-2 rounded-full text-sm font-semibold">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Just-in-time card funding
          </div>
        </div>
        {/* Card mockup */}
        <div className="flex justify-center">
          <BeeCard />
        </div>
      </div>
    </Slide>,

    // 4 — Telegram alerts
    <Slide key={4} id="slide-4" onVisible={setCurrent} index={4} className="bg-[#FFFFFC]">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-16 items-center">
        {/* Telegram mock */}
        <div className="order-2 md:order-1 flex justify-center">
          <div className="bg-[#17212b] rounded-3xl p-5 w-full max-w-[300px] shadow-2xl shadow-[#17212b]/30">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#2ca5e0] flex items-center justify-center">
                <img src="/assets/subbee-logo.png" alt="" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">SubBee</p>
                <p className="text-white/40 text-xs">bot</p>
              </div>
            </div>
            <div className="bg-[#2b5278] rounded-2xl rounded-tl-none px-4 py-3 mb-3">
              <p className="text-white text-sm leading-relaxed">
                🐝 Heads up! Your <strong>Spotify</strong> (₦1,200) charges in <strong>3 days</strong>.
              </p>
              <p className="text-white/50 text-xs mt-1 text-right">09:14 AM ✓✓</p>
            </div>
            <div className="flex gap-2">
              {['Pay now', 'Skip', 'Pause'].map(a => (
                <button key={a} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded-xl font-medium transition-colors">
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p className="text-[#E9B84A] text-sm font-bold uppercase tracking-widest mb-6">Alerts</p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1E2A2E] leading-tight mb-6">
            3-day heads up.<br/>Every time.
          </h2>
          <p className="text-[#1E2A2E]/60 text-lg leading-relaxed max-w-sm mb-6">
            SubBee messages you on Telegram (or WhatsApp) before every
            charge. Pay early, skip a month, or pause — right from the chat.
            No app switch needed.
          </p>
          <img src="/assets/bee-peek.png" alt="" className="h-20 opacity-80" />
        </div>
      </div>
    </Slide>,

    // 5 — CTA
    <Slide key={5} id="slide-5" onVisible={setCurrent} index={5} className="bg-[#183739] text-white">
      {/* Bottom meadow */}
      <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <img src="/assets/meadow.png" alt="" className="w-full h-full object-cover object-bottom" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <img src="/assets/subbee-logo.png" alt="" className="h-28 mx-auto mb-6 drop-shadow-2xl" />
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-4">
          Your bills.<br/>Handled.
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Join the beta. Get your dedicated subscription wallet in under 2 minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="your@email.com"
            className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-6 py-3.5 rounded-full text-sm focus:outline-none focus:border-[#E9B84A]/50 focus:bg-white/15 transition-all sm:w-64"
          />
          <button className="bg-[#E9B84A] text-[#1E2A2E] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#EDC062] transition-colors shadow-lg shadow-[#E9B84A]/30">
            Create free account →
          </button>
        </div>

        <p className="text-white/30 text-xs mt-6">No credit card. No paperwork. Just a phone number.</p>
      </div>
    </Slide>,
  ]

  return (
    <div className="relative">
      {/* Nav bar */}
      <header className="fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/subbee-logo.png" alt="SubBee" className="h-7 animate-pulse" style={{ animationDuration: '3s' }} />
            <span className={`font-black text-lg tracking-tight transition-colors duration-300 ${
              current % 2 !== 0 ? 'text-white' : 'text-[#183739]'
            }`}>SubBee</span>
          </div>

          <div className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-300 ${
            current % 2 !== 0 ? 'text-white/60' : 'text-[#1E2A2E]/50'
          }`}>
            <button onClick={() => goTo(2)} className={`transition-colors ${current % 2 !== 0 ? 'hover:text-white' : 'hover:text-[#1E2A2E]'}`}>How it works</button>
            <button onClick={() => goTo(3)} className={`transition-colors ${current % 2 !== 0 ? 'hover:text-white' : 'hover:text-[#1E2A2E]'}`}>Security</button>
            <button onClick={() => goTo(4)} className={`transition-colors ${current % 2 !== 0 ? 'hover:text-white' : 'hover:text-[#1E2A2E]'}`}>Alerts</button>
          </div>

          <button
            onClick={() => goTo(5)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
              current % 2 !== 0 
                ? 'bg-white text-[#183739] hover:bg-[#E9B84A] hover:text-white' 
                : 'bg-[#E9B84A] text-[#1E2A2E] hover:bg-[#EDC062]'
            }`}
          >
            Get started
          </button>
        </div>
      </header>

      {/* Slide nav */}
      <SideNav current={current} total={TOTAL} onGoTo={goTo} />

      {/* Slides */}
      <main>
        {slides}
      </main>
    </div>
  )
}
