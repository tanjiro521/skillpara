import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export default function WalletDashboard() {
  const transactions = [
    { id: 1, desc: "Taught Python Basics", amt: "+20", type: "earn", date: "Today" },
    { id: 2, desc: "Learnt Acoustic Guitar", amt: "-15", type: "spend", date: "Yesterday" },
    { id: 3, desc: "Referral Bonus (Amit)", amt: "+20", type: "earn", date: "Oct 12" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Skill Wallet</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 col-span-2 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px]" />
            <h3 className="text-slate-400 font-medium mb-2">Available Balance</h3>
            <div className="text-5xl font-bold text-white flex items-center gap-4">
              <Zap className="w-10 h-10 text-cyan-400" />
              125 <span className="text-xl font-normal text-slate-400 mt-2">Credits</span>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-2xl border border-indigo-500/20 flex flex-col justify-center">
            <h3 className="text-slate-400 font-medium mb-1">Total Earned</h3>
            <div className="text-2xl font-bold text-indigo-300">450 Credits</div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 text-slate-200">Recent Transactions</h2>
        <div className="glass-card rounded-2xl border border-slate-700/50 overflow-hidden">
          {transactions.map(t => (
            <div key={t.id} className="flex justify-between items-center p-6 border-b border-slate-700/50 last:border-0 hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${t.type === 'earn' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-700/30 text-slate-400'}`}>
                  {t.type === 'earn' ? <ArrowUpRight className="w-5 h-5"/> : <ArrowDownRight className="w-5 h-5"/>}
                </div>
                <div>
                  <h4 className="font-medium text-white">{t.desc}</h4>
                  <div className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {t.date}
                  </div>
                </div>
              </div>
              <div className={`text-xl font-bold ${t.type === 'earn' ? 'text-cyan-400' : 'text-slate-300'}`}>
                {t.amt}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

