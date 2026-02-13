import Link from "next/link";
import { ArrowRight, Receipt, Users } from "lucide-react";

function MockPhone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[240px] lg:w-[270px] rounded-[2rem] border-[6px] border-zinc-700 bg-[#141827] shadow-2xl shadow-blue-950/40">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[18px] bg-zinc-700 rounded-b-xl z-10" />
      <div className="rounded-[1.6rem] overflow-hidden bg-[#141827] p-3 pt-6">
        {children}
      </div>
    </div>
  );
}

function ScreenExpenses() {
  const expenses = [
    { name: "Dinner at Pho 24", date: "Feb 10", amount: "450,000", cat: "Food", by: "Mike" },
    { name: "Grab to airport", date: "Feb 9", amount: "185,000", cat: "Transport", by: "Lan" },
    { name: "Groceries", date: "Feb 8", amount: "320,000", cat: "Food", by: "Tuan" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-xs">Vietnam Trip</h3>
        <div className="w-5 h-5 rounded-full border border-zinc-600 flex items-center justify-center">
          <Users className="w-2.5 h-2.5 text-zinc-400" />
        </div>
      </div>
      <div className="flex gap-0.5 mb-3 bg-zinc-800/60 rounded-md p-0.5">
        <div className="flex-1 text-center text-[9px] font-medium py-1 rounded bg-zinc-700 text-white">Expenses</div>
        <div className="flex-1 text-center text-[9px] font-medium py-1 rounded text-zinc-500">Split</div>
        <div className="flex-1 text-center text-[9px] font-medium py-1 rounded text-zinc-500">Analytics</div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="bg-blue-600 text-white text-[8px] font-medium px-2 py-1 rounded">+ Add Expense</div>
        <div className="text-[9px] text-zinc-400">
          <span className="text-zinc-500">Total:</span>{" "}
          <span className="text-white font-medium">955,000 VND</span>
        </div>
      </div>
      <div className="rounded-md border border-zinc-700/80 overflow-hidden">
        {expenses.map((e, i) => (
          <div key={e.name} className={`px-2 py-1.5 ${i < expenses.length - 1 ? "border-b border-zinc-700/80" : ""}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-white text-[10px] font-medium">{e.name}</div>
                <div className="text-zinc-500 text-[8px]">{e.date} &middot; {e.by}</div>
              </div>
              <div className="text-right">
                <div className="text-white text-[10px] font-medium">{e.amount}</div>
                <div className="text-zinc-500 text-[8px]">{e.cat}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenSplit() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-xs">Vietnam Trip</h3>
        <div className="w-5 h-5 rounded-full border border-zinc-600 flex items-center justify-center">
          <Users className="w-2.5 h-2.5 text-zinc-400" />
        </div>
      </div>
      <div className="flex gap-0.5 mb-3 bg-zinc-800/60 rounded-md p-0.5">
        <div className="flex-1 text-center text-[9px] font-medium py-1 rounded text-zinc-500">Expenses</div>
        <div className="flex-1 text-center text-[9px] font-medium py-1 rounded bg-zinc-700 text-white">Split</div>
        <div className="flex-1 text-center text-[9px] font-medium py-1 rounded text-zinc-500">Analytics</div>
      </div>
      <div className="rounded-md border border-zinc-700/80 overflow-hidden">
        <div className="grid grid-cols-3 bg-zinc-800/40 px-2 py-1 text-[8px] text-zinc-400 font-medium uppercase tracking-wider">
          <div>Debtor</div>
          <div>To</div>
          <div className="text-right">Amount</div>
        </div>
        {[
          { from: "Lan", to: "Mike", amount: "88,333" },
          { from: "Lan", to: "Tuan", amount: "18,333" },
          { from: "Tuan", to: "Mike", amount: "43,333" },
        ].map((row) => (
          <div key={`${row.from}-${row.to}`} className="grid grid-cols-3 px-2 py-1.5 border-t border-zinc-700/80 text-[10px]">
            <div className="text-white font-medium">{row.from}</div>
            <div className="text-zinc-400">{row.to}</div>
            <div className="text-right text-white">{row.amount}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="bg-zinc-800/40 rounded-md p-2 border border-zinc-700/60">
          <div className="text-[8px] text-zinc-500">Mike is owed</div>
          <div className="text-white text-[11px] font-semibold">131,667</div>
        </div>
        <div className="bg-zinc-800/40 rounded-md p-2 border border-zinc-700/60">
          <div className="text-[8px] text-zinc-500">Lan owes</div>
          <div className="text-white text-[11px] font-semibold">106,667</div>
        </div>
      </div>
    </div>
  );
}

function ScreenAnalytics() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-xs">Vietnam Trip</h3>
        <div className="w-5 h-5 rounded-full border border-zinc-600 flex items-center justify-center">
          <Users className="w-2.5 h-2.5 text-zinc-400" />
        </div>
      </div>
      <div className="flex gap-0.5 mb-3 bg-zinc-800/60 rounded-md p-0.5">
        <div className="flex-1 text-center text-[9px] font-medium py-1 rounded text-zinc-500">Expenses</div>
        <div className="flex-1 text-center text-[9px] font-medium py-1 rounded text-zinc-500">Split</div>
        <div className="flex-1 text-center text-[9px] font-medium py-1 rounded bg-zinc-700 text-white">Analytics</div>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-2">
        <div className="bg-zinc-800/40 rounded-md p-2 border border-zinc-700/60">
          <div className="text-[8px] text-zinc-500">Total</div>
          <div className="text-white text-[12px] font-bold">955,000</div>
        </div>
        <div className="bg-zinc-800/40 rounded-md p-2 border border-zinc-700/60">
          <div className="text-[8px] text-zinc-500">Average</div>
          <div className="text-white text-[12px] font-bold">318,333</div>
        </div>
      </div>
      <div className="bg-zinc-800/40 rounded-md p-2 border border-zinc-700/60 mb-2">
        <div className="text-[9px] text-zinc-300 font-medium mb-1.5">By Category</div>
        <div className="flex items-center justify-center gap-3">
          <svg viewBox="0 0 36 36" className="w-[52px] h-[52px] -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="81 19" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="19 81" strokeDashoffset="-81" />
          </svg>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[8px]">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-zinc-300">Food 81%</span>
            </div>
            <div className="flex items-center gap-1 text-[8px]">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-zinc-300">Transport 19%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-zinc-800/40 rounded-md p-2 border border-zinc-700/60">
        <div className="text-[9px] text-zinc-300 font-medium mb-1.5">By Member</div>
        <div className="space-y-1">
          {[{ name: "Mike", pct: 47 }, { name: "Tuan", pct: 33 }, { name: "Lan", pct: 20 }].map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="text-[8px] text-zinc-400 w-6">{d.name}</div>
              <div className="flex-1 h-2.5 bg-zinc-700/40 rounded overflow-hidden">
                <div className="h-full bg-blue-500 rounded" style={{ width: `${d.pct}%` }} />
              </div>
              <div className="text-[8px] text-zinc-400 w-5 text-right">{d.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="h-screen bg-[#0a0e1a] text-white overflow-hidden flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/[0.05] blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-4 max-w-7xl mx-auto w-full shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Receipt className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-base tracking-tight">Smart Expense</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-1.5 rounded-lg hover:bg-white/5"
        >
          Sign in
        </Link>
      </nav>

      {/* Main content - hero left, phones right */}
      <div className="relative z-10 flex-1 flex items-center px-6 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left: Hero text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Free and open source
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
              Split expenses,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                not friendships.
              </span>
            </h1>
            <p className="mt-4 text-base lg:text-lg text-zinc-400 leading-relaxed max-w-md">
              Track group spending, see who owes what, and settle up. Built for roommates, trips, and shared life.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Phone mockups */}
          <div className="hidden lg:flex items-end justify-center gap-4">
            <div className="translate-y-6">
              <MockPhone>
                <ScreenExpenses />
              </MockPhone>
            </div>
            <div className="-translate-y-2">
              <MockPhone>
                <ScreenSplit />
              </MockPhone>
            </div>
            <div className="translate-y-6">
              <MockPhone>
                <ScreenAnalytics />
              </MockPhone>
            </div>
          </div>

          {/* Mobile: show just one phone */}
          <div className="flex lg:hidden justify-center">
            <MockPhone>
              <ScreenExpenses />
            </MockPhone>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-16 max-w-7xl mx-auto w-full py-3 shrink-0">
        <div className="flex items-center justify-between text-xs text-zinc-600">
          <span>Smart Expense</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
