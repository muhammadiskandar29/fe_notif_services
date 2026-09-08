import React, { useState, useEffect } from 'react';
import { Radio, Plus, Search, Trash2, Edit3, Shield, Check, AlertCircle, RefreshCw, X } from 'lucide-react';
import { NotificationRoute } from '../types';
import { fetchNotificationRoutes, saveNotificationRoute, deleteNotificationRoute } from '../services/api';

export const RouteRegistry: React.FC = () => {
  const [routes, setRoutes] = useState<NotificationRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<NotificationRoute>({
    event_code: '',
    description: '',
    web_target: '',
    mobile_target: '',
    target_roles_id: '',
  });
  const [previewId, setPreviewId] = useState('25');

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const data = await fetchNotificationRoutes(search);
      setRoutes(data || []);
    } catch (err: any) {
      console.error('Error fetching routes from database:', err);
      setNotificationMsg({ type: 'error', text: 'Gagal mengambil data route dari database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      event_code: '',
      description: '',
      web_target: '',
      mobile_target: '',
      target_roles_id: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (route: NotificationRoute) => {
    setFormData({
      id: route.id,
      event_code: route.event_code,
      description: route.description || '',
      web_target: route.web_target || '',
      mobile_target: route.mobile_target || '',
      target_roles_id: typeof route.target_roles_id === 'object' ? JSON.stringify(route.target_roles_id) : route.target_roles_id || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.event_code) {
      alert('Event code wajib diisi!');
      return;
    }

    try {
      await saveNotificationRoute(formData);
      setNotificationMsg({ type: 'success', text: `Route "${formData.event_code}" berhasil disimpan ke database!` });
      setShowModal(false);
      loadRoutes();
    } catch (err: any) {
      setNotificationMsg({ type: 'error', text: err?.response?.data?.message || 'Gagal menyimpan route ke database.' });
    }
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleDelete = async (eventCode: string) => {
    if (!confirm(`Yakin ingin menghapus route "${eventCode}" dari database?`)) return;
    try {
      await deleteNotificationRoute(eventCode);
      setNotificationMsg({ type: 'success', text: `Route "${eventCode}" berhasil dihapus dari database!` });
      loadRoutes();
    } catch (err: any) {
      setNotificationMsg({ type: 'error', text: err?.response?.data?.message || 'Gagal menghapus route.' });
    }
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const filteredRoutes = routes.filter((r) => {
    const term = search.toLowerCase();
    return (
      r.event_code.toLowerCase().includes(term) ||
      (r.description && r.description.toLowerCase().includes(term)) ||
      (r.web_target && r.web_target.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Notification Route Registry</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {filteredRoutes.length} Database Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data pemetaan rute notifikasi real-time dari tabel database <code className="text-indigo-300 font-mono">hr_notification_routes</code>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={loadRoutes}
            disabled={loading}
            className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition-all disabled:opacity-50"
            title="Refresh Routes dari Database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4" />
            <span>Daftar Route Baru</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notificationMsg && (
        <div
          className={`px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in slide-in-from-top duration-200 ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
          }`}
        >
          {notificationMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari event_code, deskripsi, atau URL web_target dari database..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all"
        />
      </div>

      {/* Routes Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Event Code</th>
                <th className="py-3.5 px-4 font-semibold">Deskripsi</th>
                <th className="py-3.5 px-4 font-semibold">Web Target Template</th>
                <th className="py-3.5 px-4 font-semibold">Target Roles</th>
                <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin text-indigo-400 mx-auto mb-2" />
                    <span>Memuat data dari database...</span>
                  </td>
                </tr>
              ) : filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Belum ada data route di database. Klik "Daftar Route Baru" untuk menambahkan.
                  </td>
                </tr>
              ) : (
                filteredRoutes.map((route, index) => (
                  <tr key={route.id || index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      <div className="flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{route.event_code}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-300 font-medium">
                      {route.description || <span className="text-slate-500 italic">-</span>}
                    </td>
                    <td className="py-3.5 px-4 max-w-md font-mono text-[11px] text-slate-300">
                      <div className="truncate" title={route.web_target}>
                        {route.web_target || <span className="text-slate-500 italic">-</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {route.target_roles_id ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                          <Shield className="w-2.5 h-2.5" />
                          {String(route.target_roles_id)}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Semua Role</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(route)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-all"
                          title="Edit Route"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(route.event_code)}
                          className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-all"
                          title="Hapus Route"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Route */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {formData.id ? 'Edit Notification Route' : 'Daftarkan Route Notifikasi Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">Data akan tersimpan langsung ke tabel hr_notification_routes</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Event Code <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.event_code}
                  onChange={(e) => setFormData({ ...formData, event_code: e.target.value })}
                  placeholder="contoh: approval_applicant, audit_salary, invoice_created"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Singkat
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="contoh: Notifikasi Pengajuan Berkas Pelamar Baru"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Web Target URL Template (Gunakan <code className="text-indigo-400 font-mono">&#123;id&#125;</code> untuk variabel)
                </label>
                <input
                  type="text"
                  value={formData.web_target}
                  onChange={(e) => setFormData({ ...formData, web_target: e.target.value })}
                  placeholder="https://daytrack.apbagroup.com/hrm/approval-center/applicant-approval/{id}/process"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Target URL Template (Deep Link / Web)
                </label>
                <input
                  type="text"
                  value={formData.mobile_target}
                  onChange={(e) => setFormData({ ...formData, mobile_target: e.target.value })}
                  placeholder="https://daytrack.apbagroup.com/hrm/approval-center/applicant-approval/{id}/process"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Roles ID (JSON Array, opsional)
                </label>
                <input
                  type="text"
                  value={typeof formData.target_roles_id === 'object' ? JSON.stringify(formData.target_roles_id) : formData.target_roles_id || ''}
                  onChange={(e) => setFormData({ ...formData, target_roles_id: e.target.value })}
                  placeholder='[1, 51] atau kosongkan untuk semua role'
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Live Preview Substitution Box */}
              {formData.web_target && formData.web_target.includes('{id}') && (
                <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-indigo-300 mb-1.5">
                    <span className="font-semibold">Live Preview URL Replacement:</span>
                    <div className="flex items-center gap-1">
                      <span>Simulasi ID:</span>
                      <input
                        type="text"
                        value={previewId}
                        onChange={(e) => setPreviewId(e.target.value)}
                        className="w-12 bg-slate-900 border border-indigo-500/40 rounded px-1.5 py-0.5 text-center font-mono text-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="font-mono text-xs text-emerald-400 break-all bg-slate-950 p-2 rounded-lg border border-slate-800">
                    {formData.web_target.replace('{id}', previewId || '25')}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Simpan ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
