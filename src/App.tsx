import { useEffect, useRef, useState } from 'react'
import './index.css'

// --- Config Toggles ---
const SHOW_BEE_PATH = false; // Set to true to render the bee trail path

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
  const labels = ['Home', 'Pain Points', 'How it Works', 'Funding Modes', 'Security', 'Alerts', 'Join Beta'];
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
  const [isAutoPilot, setIsAutoPilot] = useState(true)


  const TOTAL = 7

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

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.1] md:leading-[1.05] tracking-tight text-[#1E2A2E] mb-6">
            Netflix shouldn't have access to your <span className="underline-gold">rent money</span>.
          </h1>

          <p className="text-base sm:text-lg text-[#1E2A2E]/60 leading-relaxed max-w-md mb-10">
            Stop linking your main bank account to the internet. Fund your SubBee wallet once a month, and we'll pay your subscriptions using a virtual card that can't be overdrawn.
          </p>

          <div className="flex gap-4 flex-wrap">
            <a
              href="https://subbee.vercel.app"
              className="bg-white text-[#183739] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 shadow-md"
            >
              <svg viewBox="0 0 512 512" className="w-5 h-5">
                <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"/>
                <path fill="#4285F4" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"/>
                <path fill="#FBBC04" d="M425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z"/>
                <path fill="#34A853" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
              </svg>
              Get The App
            </a>
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
          The 3 AM<br/>Subscription <span className="opacity-30">Panic.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-left relative z-10">
          {[
            { img: '/assets/bee-confused-right.png', head: 'The Free Trial Trap', body: 'You clicked "start 7-day trial" and forgot. Now you\'re down ₦5,000 for an app you don\'t use.' },
            { img: '/assets/bee-sad.png', head: 'The Empty Account Bounce', body: 'You keep your debit card balance low so hackers can\'t steal it. Now Spotify keeps failing to charge.' },
            { img: '/assets/pain_security_breach.png', head: 'The Data Breach', body: 'Three different websites have your debit card number. If one gets hacked, you have to freeze your whole bank account.' },
          ].map(({ img, head, body }) => (
            <div key={head} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors flex flex-col justify-between">
              <div>
                <div className="h-20 mb-6 flex items-center">
                  <img src={img} alt={head} className="h-full object-contain" />
                </div>
                <p className="font-bold text-lg mb-2">{head}</p>
                <p className="text-sm text-white/60 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-white/40 text-sm">Scroll to see the fix ↓</p>
      </div>
    </Slide>,

    // 2 — How it works
    <Slide key={2} id="slide-2" onVisible={setCurrent} index={2} className="bg-[#FFFFFC]">
      {/* Honey drip decoration at the transition boundary */}
      <div className="absolute top-0 left-0 right-0 w-full z-20 pointer-events-none opacity-80">
        <img src="/assets/honey_drip.png" alt="" className="w-full h-16 md:h-24 object-cover object-top" />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <p className="text-[#E9B84A] text-sm font-bold uppercase tracking-widest mb-4 text-center">How it works</p>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-[#1E2A2E] leading-tight text-center mb-8 md:mb-16">
          Setup takes 2 minutes.<br/>We do the rest.
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { n: '1', head: 'Send us money', body: 'Wire your monthly subscription budget to your dedicated Nomba account.' },
            { n: '2', head: 'List your bills', body: 'Tell us you pay Netflix ₦4,900 and DSTV ₦13,000.' },
            { n: '3', head: 'Take the card', body: 'We hand you a virtual Mastercard that stays empty by default.' },
            { n: '4', head: 'Approve via Telegram', body: 'We ping you 3 days before a bill. Say yes, and we fund the card for that exact millisecond.' },
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

    // 3 — Funding Modes
    <Slide key={3} id="slide-3" onVisible={setCurrent} index={3} className="bg-[#183739] text-white">
      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center">
        {/* Floating Bubbles */}
        <div className="absolute inset-[-100px] pointer-events-none overflow-hidden hidden sm:block opacity-40 blur-[1px]">
          <img src="/assets/netflix.png" className="absolute top-[10%] left-[10%] w-16 h-16 rounded-full shadow-2xl animate-float delay-1 object-contain" />
          <img src="/assets/spotify.png" className="absolute top-[30%] left-[85%] w-12 h-12 rounded-full shadow-2xl animate-float delay-2 object-contain" />
          <img src="/assets/amazon.png" className="absolute bottom-[15%] left-[20%] w-20 h-20 rounded-full shadow-2xl animate-float delay-3 object-contain" />
          <img src="/assets/openai.png" className="absolute top-[20%] right-[15%] w-16 h-16 rounded-full shadow-2xl animate-float delay-4 object-contain" />
          <img src="/assets/dstv.png" className="absolute bottom-[25%] right-[20%] w-14 h-14 rounded-full shadow-2xl animate-float object-contain" style={{ animationDelay: '1.2s' }} />
          <img src="/assets/apple.png" className="absolute bottom-[10%] right-[40%] w-16 h-16 rounded-full shadow-2xl animate-float object-contain" style={{ animationDelay: '0.8s' }} />
          <img src="/assets/youtube.png" className="absolute top-[5%] right-[40%] w-12 h-12 rounded-full shadow-2xl animate-float object-contain" style={{ animationDelay: '2.5s' }} />
        </div>

        {/* Toggle Switch */}
        <div className="relative z-20 bg-[#0E2426] p-1.5 rounded-full flex items-center mb-12 shadow-inner border border-white/5">
          <button
            onClick={() => setIsAutoPilot(false)}
            className={`relative px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              !isAutoPilot ? 'text-[#1E2A2E] shadow-md' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {!isAutoPilot && <div className="absolute inset-0 bg-white rounded-full z-0 transition-all duration-300"></div>}
            <span className="relative z-10">Manual Control</span>
          </button>
          
          <button
            onClick={() => setIsAutoPilot(true)}
            className={`relative px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              isAutoPilot ? 'text-[#1E2A2E] shadow-md shadow-[#E9B84A]/20' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {isAutoPilot && <div className="absolute inset-0 bg-[#E9B84A] rounded-full z-0 transition-all duration-300"></div>}
            <span className="relative z-10">✨ Auto-Pilot</span>
          </button>
        </div>

        {/* Dynamic Content Block */}
        <div className="relative z-20 min-h-[220px] transition-opacity duration-300 flex flex-col items-center">
          {isAutoPilot ? (
            <div key="auto" className="slide-up">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight mb-8">
                Let SubBee do the<br/>heavy lifting.
              </h2>
              <ul className="text-left inline-block space-y-4 text-white/80 text-lg">
                <li className="flex items-center gap-3"><span className="text-[#E9B84A] text-xl">💰</span> Drop a lump sum into your wallet once.</li>
                <li className="flex items-center gap-3"><span className="text-[#E9B84A] text-xl">🔍</span> We automatically detect your subscriptions.</li>
                <li className="flex items-center gap-3"><span className="text-[#E9B84A] text-xl">⚡</span> We pay them exactly when they're due.</li>
              </ul>
            </div>
          ) : (
            <div key="manual" className="slide-up">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight mb-8">
                Absolute precision.<br/>You call the shots.
              </h2>
              <ul className="text-left inline-block space-y-4 text-white/80 text-lg">
                <li className="flex items-center gap-3"><span className="text-white text-xl">🎯</span> Fund specific bills only.</li>
                <li className="flex items-center gap-3"><span className="text-white text-xl">🛑</span> Never get charged for a service you forgot.</li>
                <li className="flex items-center gap-3"><span className="text-white text-xl">📅</span> You tell us exactly what to pay and when.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </Slide>,

    // 4 — Security feature
    <Slide key={4} id="slide-4" onVisible={setCurrent} index={4} className="bg-[#1E2A2E] text-white">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[#E9B84A] text-sm font-bold uppercase tracking-widest mb-6">Security</p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
            Hackers can't<br/>steal <span className="text-[#E9B84A] text-tabular">₦ 0.00</span>.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm mb-8">
            We keep your virtual card empty. We only move cash to it milliseconds before a verified charge hits. If a scammer gets your card details, they get a piece of plastic with zero purchasing power.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#E9B84A]/10 text-[#E9B84A] px-4 py-2 rounded-full text-sm font-semibold">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Just-in-time card funding
          </div>
        </div>
        {/* Card mockup & Security Guard Mascot */}
        <div className="relative flex justify-center items-center h-[340px] w-full max-w-[340px] mx-auto scale-90 sm:scale-100">
          <div className="absolute left-[-40px] bottom-0 z-0 opacity-90 scale-95">
            <img src="/assets/security_vault.png" alt="Security Bee" className="h-48 object-contain" />
          </div>
          <div className="relative z-10 ml-16">
            <BeeCard />
          </div>
        </div>
      </div>
    </Slide>,

    // 5 — Telegram alerts
    <Slide key={5} id="slide-5" onVisible={setCurrent} index={5} className="bg-[#FFFFFC]">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-16 items-center">
        {/* Telegram mock with Postman Bee */}
        <div className="order-2 md:order-1 flex justify-center relative">
          <div className="absolute top-[-50px] left-[-30px] z-20 pointer-events-none">
            <img 
              src="/assets/alerts_postman.png" 
              alt="Postman Bee" 
              className="h-28 object-contain drop-shadow-md animate-bounce" 
              style={{ animationDuration: '3s' }}
            />
          </div>
          <div className="bg-[#17212b] rounded-3xl p-5 w-full max-w-[300px] shadow-2xl shadow-[#17212b]/30 relative z-10">
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
            We interrogate<br/>every charge.
          </h2>
          <p className="text-[#1E2A2E]/60 text-lg leading-relaxed max-w-sm mb-6">
            We don't just pay bills blindly. 3 days before Netflix charges you, SubBee sends you a Telegram message. Want to skip this month? Tap "Skip" in the chat. The charge bounces, and you keep your cash.
          </p>
          <img src="/assets/bee-waiting.png" alt="" className="h-20 opacity-80" />
        </div>
      </div>
    </Slide>,

    // 6 — CTA
    <Slide key={6} id="slide-6" onVisible={setCurrent} index={6} className="bg-[#183739] text-white">
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

        <div className="flex justify-center mt-6">
          <a
            href="https://subbee.vercel.app"
            className="bg-white text-[#183739] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow-xl flex items-center justify-center gap-3 w-fit mx-auto"
          >
            <svg viewBox="0 0 512 512" className="w-5 h-5">
              <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"/>
              <path fill="#4285F4" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"/>
              <path fill="#FBBC04" d="M425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z"/>
              <path fill="#34A853" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
            </svg>
            Get The App
          </a>
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
              [1, 3, 4, 6].includes(current) ? 'text-white' : 'text-[#183739]'
            }`}>SubBee</span>
          </div>

          <div className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-300 ${
            [1, 3, 4, 6].includes(current) ? 'text-white/60' : 'text-[#1E2A2E]/50'
          }`}>
            <button onClick={() => goTo(2)} className={`transition-colors ${[1, 3, 4, 6].includes(current) ? 'hover:text-white' : 'hover:text-[#1E2A2E]'}`}>How it works</button>
            <button onClick={() => goTo(4)} className={`transition-colors ${[1, 3, 4, 6].includes(current) ? 'hover:text-white' : 'hover:text-[#1E2A2E]'}`}>Security</button>
            <button onClick={() => goTo(5)} className={`transition-colors ${[1, 3, 4, 6].includes(current) ? 'hover:text-white' : 'hover:text-[#1E2A2E]'}`}>Alerts</button>
          </div>

          <a
            href="https://subbee.vercel.app"
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
              [1, 3, 4, 6].includes(current) 
                ? 'bg-white text-[#183739] hover:bg-gray-100' 
                : 'bg-white text-[#183739] hover:bg-gray-100 shadow-sm border border-gray-200'
            }`}
          >
            <svg viewBox="0 0 512 512" className="w-4 h-4">
              <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"/>
              <path fill="#4285F4" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"/>
              <path fill="#FBBC04" d="M425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z"/>
              <path fill="#34A853" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
            </svg>
            Get The App
          </a>
        </div>
      </header>

      {/* Slide nav */}
      <SideNav current={current} total={TOTAL} onGoTo={goTo} />

      {/* Trailing Dashes Bee Path (Multi-segment off-screen loops) */}
      {SHOW_BEE_PATH && (
        <div className="absolute inset-y-0 left-0 right-0 w-full pointer-events-none z-20 overflow-hidden">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 6000">
            {/* Segment 1: Hero to Pain section, loops off right, exits left */}
            <path
              d="M 650,250
                 C 1200,600 1100,1050 600,1300
                 C 200,1500 -200,1650 -150,1850"
              fill="none"
              stroke="#E9B84A"
              strokeWidth="4"
              strokeDasharray="10 10"
              className="opacity-30 md:opacity-40"
            />
            {/* Segment 2: Enters right in How it Works, loops wide left, exits right in Security */}
            <path
              d="M 1150,2200
                 C 700,2400 100,2500 250,2800
                 C 450,3200 1200,3050 1200,3350"
              fill="none"
              stroke="#E9B84A"
              strokeWidth="4"
              strokeDasharray="10 10"
              className="opacity-30 md:opacity-40"
            />
            {/* Segment 3: Enters left in Alerts, loops right, ends in CTA */}
            <path
              d="M -150,4100
                 C 500,4300 1150,4600 700,4900
                 C 350,5150 -150,5200 150,5550
                 C 350,5750 700,5850 500,6000"
              fill="none"
              stroke="#E9B84A"
              strokeWidth="4"
              strokeDasharray="10 10"
              className="opacity-30 md:opacity-40"
            />
          </svg>
        </div>
      )}

      {/* Slides */}
      <main className="relative z-10">
        {slides}
      </main>
    </div>
  )
}
