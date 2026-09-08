import React, { useState, useEffect } from 'react';
import { Send, Terminal, Radio, Bell, CheckCircle2, RefreshCw, Smartphone } from 'lucide-react';
import { PushNotificationRequest, NotificationRoute } from '../types';
import { sendPushNotification, fetchNotificationRoutes, registerFCMDeviceToken } from '../services/api';
import { requestForToken, onMessageListener } from '../firebase';

export const NotificationTester: React.FC = () => {
  const [routes, setRoutes] = useState<NotificationRoute[]>([]);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [syncingToken, setSyncingToken] = useState(false);
  const [tokenSyncMessage, setTokenSyncMessage] = useState<string | null>(null);
  const [liveNotification, setLiveNotification] = useState<any | null>(null);

  const [formData, setFormData] = useState<PushNotificationRequest>({
    event_code: '',
    title: 'Absen Masuk Berhasil',
    message: 'Anda telah berhasil melakukan clock-in pada pukul ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'success',
    user_id: 151,
    employee_id: 277,
    reference_id: 6003,
    payload: { module: 'attendance', reference_id: 6003 },
    channels: ['database', 'fcm'],
    provider_id: 52,
    branch_id: 66,
  });

  const [loading, setLoading] = useState(false);
  const [responseLog, setResponseLog] = useState<{
    status: number;
    latency: number;
    data: any;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    fetchNotificationRoutes()
      .then((data) => {
        setRoutes(data || []);
        if (data && data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            event_code: prev.event_code || data[0].event_code,
          }));
        }
      })
      .catch((err) => console.warn('Could not fetch routes for tester:', err));

    // Listen to real-time foreground pushes
    onMessageListener()
      .then((payload: any) => {
        setLiveNotification(payload);
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(payload?.notification?.title || 'Notifikasi Baru', {
            body: payload?.notification?.body || '',
          });
        }
      })
      .catch((err) => console.log('failed: ', err));
  }, []);

  const handleSyncBrowserToken = async () => {
    setSyncingToken(true);
    setTokenSyncMessage(null);
    try {
      const token = await requestForToken();
      if (token) {
        setActiveToken(token);
        await registerFCMDeviceToken(token);
        setTokenSyncMessage('Token Browser Berhasil Disinkronkan & Aktif!');
      } else {
        setTokenSyncMessage('Gagal mendapatkan token. Pastikan izin notifikasi di browser diizinkan.');
      }
    } catch (err: any) {
      setTokenSyncMessage('Error registrasi token: ' + (err.message || 'Unknown'));
    } finally {
      setSyncingToken(false);
    }
  };

  const handleSelectRoute = (route: NotificationRoute) => {
    setFormData({
      ...formData,
      event_code: route.event_code,
      title: route.description ? route.description : `Notifikasi ${route.event_code}`,
      message: `Pesan pengujian untuk route ${route.event_code}`,
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const startTime = performance.now();

    try {
      const res = await sendPushNotification(formData);
      const endTime = performance.now();
      setResponseLog({
        status: 200,
        latency: Math.round(endTime - startTime),
        data: res,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      const endTime = performance.now();
      setResponseLog({
        status: err?.response?.status || 500,
        latency: Math.round(endTime - startTime),
        data: err?.response?.data || { error: err.message || 'Gagal mengirim notifikasi' },
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Notification Push Sandbox</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Interactive Tester
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Uji coba pengiriman payload notifikasi ke In-App Database Inbox dan FCM Push menggunakan route database
        </p>
      </div>

      {/* Live Token Sync Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Status Token FCM Browser Ini
              {activeToken && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Aktif & Terdaftar
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {activeToken
                ? `Token aktif: ${activeToken.substring(0, 32)}... (Siap menerima push notifikasi)`
                : 'Klik tombol di samping untuk mengaktifkan izin notifikasi & mendaftarkan token browser ini ke backend.'}
            </p>
            {tokenSyncMessage && (
              <p className="text-xs text-indigo-300 mt-1 font-medium">{tokenSyncMessage}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSyncBrowserToken}
          disabled={syncingToken}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncingToken ? 'animate-spin' : ''}`} />
          <span>{syncingToken ? 'Menghubungkan...' : '🔄 Sinkronkan Token Browser Ini'}</span>
        </button>
      </div>

      {/* Dynamic Route Selector from Database */}
      {routes.length > 0 && (
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold mb-2.5">
            <Radio className="w-4 h-4" />
            <span>Pilih Event Route dari Database:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {routes.map((route) => (
              <button
                key={route.event_code}
                type="button"
                onClick={() => handleSelectRoute(route)}
                className={`px-3 py-1.5 rounded-lg text-left text-xs border font-mono transition-all ${
                  formData.event_code === route.event_code
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-200 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {route.event_code}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Sandbox */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Event Code (Route) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.event_code}
                  onChange={(e) => setFormData({ ...formData, event_code: e.target.value })}
                  placeholder="masukkan event_code terdaftar"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target User ID <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.user_id || ''}
                  onChange={(e) => setFormData({ ...formData, user_id: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
                  placeholder="152"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Judul Notifikasi (Title) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pesan Notifikasi (Message) <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reference ID (Mengisi &#123;id&#125;)
                </label>
                <input
                  type="text"
                  value={formData.reference_id || ''}
                  onChange={(e) => setFormData({ ...formData, reference_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-purple-400 focus:outline-none focus:border-indigo-500"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tipe Notifikasi
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="info">Info</option>
                  <option value="approval">Approval</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="danger">Danger</option>
                </select>
              </div>
            </div>

            {/* JSON Payload Editor */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custom Payload JSON (Variables Substitution)
              </label>
              <textarea
                rows={3}
                value={JSON.stringify(formData.payload, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({ ...formData, payload: parsed });
                  } catch {
                    // ignore typing parse error
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Mengirimkan Notifikasi...' : 'Kirim Notifikasi (Push Dispatch)'}</span>
            </button>
          </form>
        </div>

        {/* Live Response Viewer */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Live Execution Output</h3>
              </div>
              {responseLog && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${responseLog.status === 200 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    HTTP {responseLog.status}
                  </span>
                  <span className="text-slate-500">{responseLog.latency}ms</span>
                </div>
              )}
            </div>

            {responseLog ? (
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
                <code>{JSON.stringify(responseLog.data, null, 2)}</code>
              </pre>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500">
                <Send className="w-8 h-8 opacity-30 mb-2" />
                <p className="text-xs">Pilih route dan klik "Kirim Notifikasi" untuk melihat respons live.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            * Endpoint Dispatcher: <code className="text-slate-400 font-mono">POST /api/hr/notification/push</code>
          </div>
        </div>
      </div>
    </div>
  );
};
