import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InteractiveDocs } from './components/InteractiveDocs';
import { RouteRegistry } from './components/RouteRegistry';
import { NotificationTester } from './components/NotificationTester';
import { LiveInbox } from './components/LiveInbox';
import { requestForToken, onMessageListener } from './firebase';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docs' | 'routes' | 'tester' | 'inbox'>('docs');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [liveFCMMessage, setLiveFCMMessage] = useState<any>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(
    localStorage.getItem('API_BASE_URL') || 'http://localhost/rs_keuanganGL_V2/api/hr'
  );
  const [apiToken, setApiToken] = useState<string>(
    localStorage.getItem('API_AUTH_TOKEN') || ''
  );

  const handleRequestFCM = async () => {
    try {
      const token = await requestForToken();
      if (token) {
        setFcmToken(token);
        localStorage.setItem('FCM_DEVICE_TOKEN', token);
      }
    } catch (err) {
      console.warn('Failed to get FCM token:', err);
    }
  };

  useEffect(() => {
    // Check for existing token
    const savedToken = localStorage.getItem('FCM_DEVICE_TOKEN');
    if (savedToken) {
      setFcmToken(savedToken);
    }

    // Listen for foreground Firebase Cloud Messages
    onMessageListener()
      .then((payload) => {
        setLiveFCMMessage(payload);
        // Play subtle chime or vibration if supported
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          const title = (payload as any)?.notification?.title || 'Notifikasi Baru';
          const body = (payload as any)?.notification?.body || '';
          new Notification(title, { body, icon: '/vite.svg' });
        }
      })
      .catch((err) => console.error('FCM Message Listener error:', err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fcmToken={fcmToken}
        onRequestFCM={handleRequestFCM}
        apiBaseUrl={apiBaseUrl}
        setApiBaseUrl={setApiBaseUrl}
        apiToken={apiToken}
        setApiToken={setApiToken}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'docs' && <InteractiveDocs />}
        {activeTab === 'routes' && <RouteRegistry />}
        {activeTab === 'tester' && <NotificationTester />}
        {activeTab === 'inbox' && (
          <LiveInbox
            fcmToken={fcmToken}
            onRequestFCM={handleRequestFCM}
            liveFCMMessage={liveFCMMessage}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>Notification Hub &bull; Universal Gateway & Route Registry &bull; PT. APBATECH</p>
      </footer>
    </div>
  );
};

export default App;
