import React, { useState, useEffect } from 'react';
import { Bell, Shield, Copy, Check, ExternalLink, RefreshCw, Smartphone, Globe, Radio } from 'lucide-react';
import { fetchInboxNotifications, registerFCMDeviceToken } from '../services/api';
import { InAppNotification } from '../types';

interface LiveInboxProps {
  fcmToken: string | null;
  onRequestFCM: () => void;
  liveFCMMessage: any;
}

export const LiveInbox: React.FC<LiveInboxProps> = ({ fcmToken, onRequestFCM, liveFCMMessage }) => {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [registered, setRegistered] = useState(false);

  const loadInbox = async () => {
    setLoading(true);
    try {
      const data = await fetchInboxNotifications();
      setNotifications(data);
    } catch (err) {
      console.warn('Unable to load server inbox:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  const handleRegisterTokenToBackend = async () => {
    if (!fcmToken) return;
    try {
      await registerFCMDeviceToken(fcmToken);
      setRegistered(true);
      setTimeout(() => setRegistered(false), 3000);
    } catch (err) {
      alert('Gagal registrasi token ke backend: ' + err);
    }
  };

  const handleCopy = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Live Inbox & FCM Listener</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Realtime Receiver
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pantau notifikasi yang masuk ke database inbox dan token browser Firebase FCM
          </p>
        </div>

        <button
          onClick={loadInbox}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* FCM Token Banner Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${fcmToken ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Firebase FCM Browser Token</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${fcmToken ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {fcmToken ? 'ACTIVE' : 'NOT CONNECTED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {fcmToken ? 'Browser Anda siap menerima notifikasi push secara real-time.' : 'Aktifkan izin browser untuk menerima Push Notification FCM.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {fcmToken ? (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Copy Token'}</span>
                </button>
                <button
                  onClick={handleRegisterTokenToBackend}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>{registered ? 'Tersinkron!' : 'Daftarkan Token ke DB'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={onRequestFCM}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-amber-600/30 transition-all"
              >
                <Bell className="w-4 h-4" />
                <span>Minta Izin Notifikasi Browser</span>
              </button>
            )}
          </div>
        </div>

        {fcmToken && (
          <div className="mt-4 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-400 break-all select-all">
            {fcmToken}
          </div>
        )}
      </div>

      {/* Realtime Live Message Toast Banner */}
      {liveFCMMessage && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">Pesan FCM Baru Masuk!</span>
                  <span className="text-[10px] text-slate-400">{new Date().toLocaleTimeString()}</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {liveFCMMessage.notification?.title || liveFCMMessage.data?.title || 'Notifikasi'}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {liveFCMMessage.notification?.body || liveFCMMessage.data?.body || liveFCMMessage.data?.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Database Inbox Feed */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <span>Riwayat Notifikasi Masuk (In-App Inbox)</span>
        </h3>

        {notifications.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500">
            <Bell className="w-8 h-8 opacity-30 mx-auto mb-2" />
            <p className="text-xs">Belum ada notifikasi inbox di database.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{notif.name || notif.title}</span>
                      <span className="text-[10px] text-slate-500">{notif.created_at}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
                    {notif.payload && Object.keys(notif.payload).length > 0 && (
                      <div className="mt-2 text-[11px] font-mono text-indigo-400 bg-slate-900 px-2 py-1 rounded inline-block">
                        Payload: {JSON.stringify(notif.payload)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {notif.web_target && (
                    <a
                      href={notif.web_target}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium border border-slate-700 transition-all"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Buka Web</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  )}
                  {notif.mobile_target && (
                    <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/50 text-cyan-400 text-xs font-mono">
                      <Smartphone className="w-3 h-3" />
                      <span>Mobile Target</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
