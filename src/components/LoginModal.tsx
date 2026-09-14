import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  User,
  CheckCircle2,
  AlertCircle,
  Building,
  Sparkles,
  Info,
  Lock,
  ArrowRight
} from 'lucide-react';
import { AccessLevel, AuthorizedUser, UserSession, LEVEL_PASSWORDS } from '../types';
import { getAccessLevelConfig } from '../utils/helpers';
import { recordAccessLog } from '../lib/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  authorizedUsers: AuthorizedUser[];
  onLoginSuccess: (session: UserSession) => void;
  currentSession: UserSession | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  authorizedUsers,
  onLoginSuccess,
  currentSession
}) => {
  const [userName, setUserName] = useState<string>(currentSession?.userName || '');
  const [selectedUser, setSelectedUser] = useState<AuthorizedUser | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel>(currentSession?.level || '1');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const levels: AccessLevel[] = ['1', '2', '3', '4', '5', 'admin'];

  const handleSelectAuthorizedUser = (userId: string) => {
    if (!userId) {
      setSelectedUser(null);
      return;
    }
    const found = authorizedUsers.find(u => u.id === userId);
    if (found) {
      setSelectedUser(found);
      setUserName(found.name);
      // Auto-select their first allowed level if applicable
      if (found.allowedLevels && found.allowedLevels.length > 0) {
        setSelectedLevel(found.allowedLevels[0]);
      }
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = userName.trim();
    if (!trimmedName) {
      setErrorMsg('กรุณาระบุชื่อ-นามสกุล หรือเลือกจากรายชื่อผู้มีสิทธิเข้าถึง');
      return;
    }

    const expectedPassword = LEVEL_PASSWORDS[selectedLevel];
    if (password !== expectedPassword) {
      setErrorMsg(`รหัสผ่านไม่ถูกต้อง สำหรับ${getAccessLevelConfig(selectedLevel).shortTitle}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date();
      const thaiDateStr = `${now.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })} เวลา ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;

      const levelConfig = getAccessLevelConfig(selectedLevel);

      const session: UserSession = {
        userName: trimmedName,
        level: selectedLevel,
        levelLabel: levelConfig.title,
        loginTime: thaiDateStr,
        role: levelConfig.role
      };

      // Record to Cloud Firestore access_logs registry
      const logEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userName: trimmedName,
        level: selectedLevel,
        levelLabel: levelConfig.title,
        loginTime: thaiDateStr,
        timestampMs: Date.now(),
        deviceInfo: `${navigator.platform || 'Web'} - ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}`,
        status: 'success' as const
      };

      await recordAccessLog(logEntry);

      // Save to localStorage
      try {
        localStorage.setItem('gch_user_session', JSON.stringify(session));
      } catch (e) {
        console.warn('Cannot write session to localStorage:', e);
      }

      onLoginSuccess(session);
      if (onClose) onClose();
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกการเข้าใช้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-800 text-white p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  ระบบความปลอดภัยและการยืนยันสิทธิ
                </span>
                <span className="text-xs text-emerald-300">Green & Clean Hospital</span>
              </div>
              <h2 className="text-xl font-bold mt-0.5 tracking-tight text-white">
                ลงชื่อเข้าใช้งานระบบ (Access Authentication)
              </h2>
            </div>
          </div>
          <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
            กรุณาระบุชื่อผู้ใช้งาน เลือกระดับสิทธิที่ได้รับมอบหมาย และกรอกรหัสผ่านประจำระดับเพื่อเข้าสู่ระบบ
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Quick Select from Authorized Users Registry */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                เลือกจากทะเบียนผู้มีสิทธิเข้าถึง (Authorized Directory)
              </label>
              <span className="text-[11px] text-slate-400">กำหนดโดย Admin</span>
            </div>
            <select
              value={selectedUser?.id || ''}
              onChange={(e) => handleSelectAuthorizedUser(e.target.value)}
              className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-700"
            >
              <option value="">-- เลือกรายชื่อกรรมการ / ผู้มีสิทธิ หรือพิมพ์ชื่อเองด้านล่าง --</option>
              {authorizedUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.position}
                </option>
              ))}
            </select>
          </div>

          {/* Manual Name Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              ชื่อ-นามสกุล ผู้เข้าใช้งาน <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="เช่น นพ.เกรียงศักดิ์ ธรรมรัตน์, นางสาวกานดา สุวรรณฉัตร"
                required
                className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all pl-9"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {selectedUser && (
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{selectedUser.position} ({selectedUser.department})</span>
              </div>
            )}
          </div>

          {/* Select Access Level */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              เลือกระดับสิทธิการเข้าใช้งาน (Access Level) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {levels.map((lvl) => {
                const cfg = getAccessLevelConfig(lvl);
                const isSelected = selectedLevel === lvl;
                const isAllowedForSelectedUser =
                  !selectedUser ||
                  !selectedUser.allowedLevels ||
                  selectedUser.allowedLevels.includes(lvl);

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl);
                      setPassword('');
                      setErrorMsg('');
                    }}
                    className={`p-3 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{cfg.iconEmoji}</span>
                        {lvl === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : `ระดับ ${lvl}`}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium">
                      {cfg.title.split(': ')[1] || cfg.title}
                    </span>
                    {!isAllowedForSelectedUser && (
                      <span className="mt-1 text-[10px] text-amber-600">
                        (ไม่อยู่ในระดับที่กำหนดล่วงหน้า)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password Input for Selected Level */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                รหัสผ่านสำหรับ {getAccessLevelConfig(selectedLevel).shortTitle} <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {selectedLevel === 'admin' ? 'รหัสเฉพาะ Admin' : `รหัสระดับ ${selectedLevel}`}
              </span>
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="กรอกรหัสผ่านเพื่อเข้าใช้งาน"
                required
                className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all pl-9"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Security Notice */}
            <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3 text-emerald-600" />
                สิทธิจะถูกบันทึกประวัติลงสู่ระบบหลังบ้าน
              </span>
              <span className="text-slate-400 text-[10px]">
                🔒 รักษาความปลอดภัยตามมาตรฐานความมั่นคงปลอดภัยสารสนเทศ
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                ยกเลิก / ปิด
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 px-5 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-emerald-200'
              }`}
            >
              {isSubmitting ? (
                <span>กำลังเข้าสู่ระบบ...</span>
              ) : (
                <>
                  <span>ยืนยันเข้าสู่ระบบ</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
