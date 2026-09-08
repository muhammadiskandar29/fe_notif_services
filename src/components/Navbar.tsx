import React, { useState } from 'react';
import { Bell, Radio, BookOpen, Send, Shield, Settings, Check, Copy } from 'lucide-react';

interface NavbarProps {
  activeTab: 'docs' | 'routes' | 'tester' | 'inbox';
  setActiveTab: (tab: 'docs' | 'routes' | 'tester' | 'inbox') => void;
  fcmToken: string | null;
  onRequestFCM: () => void;
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
  apiToken: string;
  setApiToken: (token: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  fcmToken,
  onRequestFCM,
  apiBaseUrl,
  setApiBaseUrl,
  apiToken,
  setApiToken,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleCopyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bell className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Notification Hub
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Dev Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">Universal Gateway & Route Registry</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'docs'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Tutorial & Docs</span>
            </button>

            <button
              onClick={() => setActiveTab('routes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'routes'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Route Registry</span>
            </button>

            <button
              onClick={() => setActiveTab('tester')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'tester'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Push Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'inbox'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Live Inbox</span>
            </button>
          </nav>

          {/* Right Controls: FCM Token status & API Settings */}
          <div className="flex items-center gap-2">
            {fcmToken ? (
              <button
                onClick={handleCopyToken}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                title="Klik untuk copy token FCM browser"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>FCM Active</span>
                {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
              </button>
            ) : (
              <button
                onClick={onRequestFCM}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Enable FCM Push</span>
              </button>
            )}

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all border border-slate-800"
              title="API & Connection Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* API Config Modal Drawer */}
      {showSettings && (
        <div className="border-t border-slate-800 bg-slate-900/95 px-4 py-4 animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="w-full md:w-1/2">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Backend API Base URL
              </label>
              <input
                type="text"
                value={apiBaseUrl}
                onChange={(e) => {
                  setApiBaseUrl(e.target.value);
                  localStorage.setItem('API_BASE_URL', e.target.value);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="http://localhost/rs_keuanganGL_V2/api/hr"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Bearer Auth Token (Opsional untuk testing user)
              </label>
              <input
                type="text"
                value={apiToken}
                onChange={(e) => {
                  setApiToken(e.target.value);
                  localStorage.setItem('API_AUTH_TOKEN', e.target.value);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
