import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Copy, Share2, Users } from 'lucide-react';

export default function InviteEarnPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 mb-6">
          <Gift className="w-10 h-10 text-cyan-400" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-white">Invite Friends & Earn Credits</h1>
        <p className="text-lg text-slate-400 mb-12">
          For every neighbor, friend, or colleague you invite, you both receive <span className="font-bold text-cyan-400">20 Skill Credits</span> to spend on learning something new locally.
        </p>

        <div className="glass-card p-8 rounded-3xl border border-slate-700/50 relative overflow-hidden mb-8 text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
          
          <h3 className="font-semibold text-slate-300 mb-2">Your Unique Referral Code</h3>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-6 py-4 font-mono text-lg text-indigo-300 flex items-center justify-between shadow-inner">
              <span className="tracking-wider">SKILL-BANG-240X</span>
              <Copy className="w-5 h-5 text-slate-500 cursor-pointer hover:text-cyan-400 transition-colors" />
            </div>
            <Button size="lg" className="h-auto bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8 shadow-lg shadow-indigo-600/25">
              <Share2 className="w-5 h-5 mr-2" /> Share Link
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-700/50">
            <div>
              <div className="text-sm text-slate-400 mb-1">Total Referrals</div>
              <div className="text-3xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-400" /> 12
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Total Earned</div>
              <div className="text-3xl font-bold text-cyan-400">240 Credits</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

