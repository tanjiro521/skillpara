import React from 'react';
import { Button } from '@/components/ui/button';
// Assuming lucide-react is installed per package.json
import { MessageSquare, Heart, Share2, MapPin } from 'lucide-react'; 

export default function CommunityFeed() {
  // Mock data representing the Database "posts" combined with "followers" and "profiles" location
  const posts = [
    {
      id: 1,
      author: "Priya Sharma",
      area: "Indiranagar",
      city: "Bangalore",
      content: "Just finished teaching my first Advanced React pattern session using SkillCredits! The hyperlocal matching works beautifully.",
      likes: 24,
      comments: 5,
      time: "2 hours ago"
    },
    {
      id: 2,
      author: "Rahul V.",
      area: "Koramangala",
      city: "Bangalore",
      content: "Looking to exchange 2 hours of Python tutoring for some Acoustic Guitar basics this weekend. Anyone nearby?",
      likes: 12,
      comments: 8,
      time: "5 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl flex gap-8">
        
        {/* Main Feed */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Local Community Feed</h1>
          
          {/* Create Post */}
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl mb-8">
            <textarea 
              className="w-full bg-slate-900/50 rounded-xl p-4 text-white border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              rows={3}
              placeholder="What are you learning or teaching locally today?"
            ></textarea>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Posting in <span className="text-indigo-300">Your Area</span>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 rounded-full px-6">
                Share Post
              </Button>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 hover:border-slate-600/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md">
                      {post.author[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200">{post.author}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {post.area}, {post.city} • {post.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10">
                    Follow
                  </Button>
                </div>
                
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center gap-6 border-t border-slate-700/50 pt-4">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-80 space-y-8">
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <h3 className="font-bold text-lg mb-4 text-white">Trending Local Skills</h3>
            <div className="space-y-4">
              {['Advanced React', 'Guitar Basics', 'Spoken English'].map((skill, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      #{i+1}
                    </div>
                    <span className="text-slate-300 group-hover:text-white transition-colors">{skill}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-900/50 to-cyan-900/30 rounded-2xl p-6 border border-indigo-500/20 shadow-xl">
            <h3 className="font-bold text-lg mb-2 text-white">Invite & Earn 🎁</h3>
            <p className="text-sm text-indigo-200 mb-4">Earn 20 Skill Credits for every neighbor you bring to the platform.</p>
            <Button className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              Get Referral Code
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

