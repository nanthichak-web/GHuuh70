import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  User,
  UserPlus,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Award,
  Eye,
  EyeOff,
  FolderKanban,
  FileCheck,
  Calendar,
  Lock,
  ChevronRight,
  Trees,
  Droplets,
  Zap,
  Recycle
} from 'lucide-react';
import { AccessLevel, AuthorizedUser, UserSession, LEVEL_PASSWORDS, Project, Meeting, Category } from '../types';
import { getAccessLevelConfig } from '../utils/helpers';

interface LandingPortalViewProps {
  authorizedUsers: AuthorizedUser[];
  onLoginSuccess: (session: UserSession) => void;
  onRegisterUser: (newUser: AuthorizedUser, session: UserSession) => Promise<void>;
  onContinueAsGuest: () => void;
  projects: Project[];
  meetings: Meeting[];
  categories: Category[];
}

export const LandingPortalView: React.FC<LandingPortalViewProps> = ({
  authorizedUsers,
  onLoginSuccess,
  onRegisterUser,
  onContinueAsGuest,
  projects,
  meetings,
  categories
}) => {
  const [activePortalTab, setActivePortalTab] = useState<'login' | 'register'>('login');

  // Login Form States
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel>('4');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [customUserName, setCustomUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState<boolean>(false);

  // Registration Form States
  const [regName, setRegName] = useState<string>('');
  const [regPosition, setRegPosition] = useState<string>('');
  const [regDepartment, setRegDepartment] = useState<string>('');
  const [regLevel, setRegLevel] = useState<AccessLevel>('1');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regNote, setRegNote] = useState<string>('');
  const [regError, setRegError] = useState<string>('');
  const [isSubmittingReg, setIsSubmittingReg] = useState<boolean>(false);
  const [regSuccessMsg, setRegSuccessMsg] = useState<string>('');

  const levels: AccessLevel[] = ['1', '2', '3', '4', '5', 'admin'];

  // Handle Quick Select Level in Login
  const handleSelectLevel = (lvl: AccessLevel) => {
    setSelectedLevel(lvl);
    setLoginError('');
    setPassword('');
    // Try to pre-select a user matching this level if none selected or mismatched
    const match = authorizedUsers.find(u => u.allowedLevels.includes(lvl));
    if (match && !customUserName) {
      setSelectedUserId(match.id);
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    let nameToUse = customUserName.trim();
    if (selectedUserId) {
      const found = authorizedUsers.find(u => u.id === selectedUserId);
      if (found) nameToUse = found.name;
    }

    if (!nameToUse) {
      setLoginError('กรุณาเลือกรายชื่อจากทะเบียนบุคลากร หรือพิมพ์ชื่อ-นามสกุลของท่าน');
      return;
    }

    const expectedPassword = LEVEL_PASSWORDS[selectedLevel];
    if (password !== expectedPassword) {
      setLoginError(`รหัสผ่านไม่ถูกต้อง สำหรับ${getAccessLevelConfig(selectedLevel).shortTitle} (กรุณาตรวจสอบรหัสผ่าน)`);
      return;
    }

    setIsSubmittingLogin(true);
    try {
      const now = new Date();
      const thaiDateStr = `${now.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })} เวลา ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;

      const levelConfig = getAccessLevelConfig(selectedLevel);
      const session: UserSession = {
        userName: nameToUse,
        level: selectedLevel,
        levelLabel: levelConfig.title,
        loginTime: thaiDateStr,
        role: levelConfig.role
      };

      onLoginSuccess(session);
    } catch (err) {
      setLoginError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccessMsg('');

    if (!regName.trim()) {
      setRegError('กรุณากรอกชื่อ-นามสกุล');
      return;
    }
    if (!regPosition.trim()) {
      setRegError('กรุณาระบุตำแหน่ง');
      return;
    }
    if (!regDepartment.trim()) {
      setRegError('กรุณาระบุฝ่ายหรือกลุ่มงาน');
      return;
    }

    const expectedPassword = LEVEL_PASSWORDS[regLevel];
    if (regPassword !== expectedPassword) {
      setRegError(`รหัสผ่านยืนยันสิทธิ์ไม่ถูกต้อง สำหรับ${getAccessLevelConfig(regLevel).shortTitle}`);
      return;
    }

    setIsSubmittingReg(true);
    try {
      const now = new Date();
      const thaiDateStr = `${now.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })} เวลา ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;

      const newUserId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newUser: AuthorizedUser = {
        id: newUserId,
        name: regName.trim(),
        position: regPosition.trim(),
        department: regDepartment.trim(),
        allowedLevels: [regLevel],
        createdAt: now.toISOString().split('T')[0],
        status: 'active',
        note: regNote.trim() || 'ลงทะเบียนผ่านหน้าแรกของระบบ'
      };

      const levelConfig = getAccessLevelConfig(regLevel);
      const session: UserSession = {
        userName: newUser.name,
        level: regLevel,
        levelLabel: levelConfig.title,
        loginTime: thaiDateStr,
        role: levelConfig.role
      };

      await onRegisterUser(newUser, session);
      setRegSuccessMsg('ลงทะเบียนเข้าสู่ระบบเรียบร้อย กำลังนำท่านเข้าสู่ระบบ...');
    } catch (err) {
      setRegError('เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmittingReg(false);
    }
  };

  // Quick stats
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const overallProgress = totalProjects > 0
    ? Math.round(projects.reduce((acc, p) => acc + p.progressPercent, 0) / totalProjects)
    : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-emerald-50/20 to-teal-50/30 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Institutional Branding Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>กระทรวงสาธารณสุข • โครงการ GREEN & CLEAN HOSPITAL (GCH)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ระบบบริหารและติดตามความก้าวหน้าโครงการ <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 bg-clip-text text-transparent">
              GREEN & CLEAN HOSPITAL (GCH)
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ศูนย์กลางติดตามเกณฑ์ 9 หมวดมาตรฐาน ยึดหลักฐานเชิงประจักษ์ (Evidence Matrix) 
            และระบบการรับรองผ่านขั้นตอน 5 ลำดับขั้น พร้อมระบบความปลอดภัยกำกับสิทธิ์การเข้าใช้งาน
          </p>
        </div>

        {/* Highlight Stats Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-3 border border-emerald-100 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">โครงการทั้งหมด</div>
              <div className="text-lg font-bold text-slate-900">{totalProjects} โครงการ</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-teal-100 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">สำเร็จสมบูรณ์</div>
              <div className="text-lg font-bold text-teal-800">{completedProjects} งาน</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-amber-100 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">ความก้าวหน้ารวม</div>
              <div className="text-lg font-bold text-amber-900">{overallProgress}%</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-indigo-100 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">มติคณะกรรมการ</div>
              <div className="text-lg font-bold text-indigo-900">{meetings.length} การประชุม</div>
            </div>
          </div>
        </div>

        {/* Main Portal Card: Login & Register Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl mx-auto">
          
          {/* Top Switcher Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/80">
            <button
              onClick={() => {
                setActivePortalTab('login');
                setLoginError('');
              }}
              className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activePortalTab === 'login'
                  ? 'border-emerald-600 text-emerald-900 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span>🔑 เข้าสู่ระบบด่วนตามระดับสิทธิ์ (Sign In)</span>
            </button>

            <button
              onClick={() => {
                setActivePortalTab('register');
                setRegError('');
                setRegSuccessMsg('');
              }}
              className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activePortalTab === 'register'
                  ? 'border-emerald-600 text-emerald-900 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>📝 ลงทะเบียนผู้ใช้งานใหม่ (Register)</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* TAB 1: QUICK SIGN IN */}
            {activePortalTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                
                {/* Level Selection Cards Grid */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    1. เลือกระดับสิทธิ์ที่ต้องการเข้าใช้งาน (Select Access Level):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {levels.map((lvl) => {
                      const cfg = getAccessLevelConfig(lvl);
                      const isSelected = selectedLevel === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleSelectLevel(lvl)}
                          className={`p-3 rounded-xl border text-left transition-all relative ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                                isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {lvl === 'admin' ? '👑' : lvl}
                              </div>
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {cfg.shortTitle}
                              </span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                            {cfg.title}
                          </p>
                          <div className="mt-1.5 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">การยืนยัน:</span>
                            <span className="text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                              🔒 รหัสผ่านความปลอดภัย
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Personnel Selection or Custom Name Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      2. เลือกชื่อจากทะเบียนผู้มีสิทธิ์ (Authorized Committee/Staff):
                    </label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => {
                        setSelectedUserId(e.target.value);
                        if (e.target.value) {
                          setCustomUserName('');
                          const found = authorizedUsers.find(u => u.id === e.target.value);
                          if (found && found.allowedLevels.length > 0) {
                            setSelectedLevel(found.allowedLevels[0]);
                          }
                        }
                      }}
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="">-- เลือกจากรายชื่อในทะเบียน --</option>
                      {authorizedUsers.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} — {u.position} ({u.department})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400">
                      เลือกจากรายชื่อคณะกรรมการ/ผู้รับผิดชอบที่ลงทะเบียนไว้
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      หรือพิมพ์ชื่อ-นามสกุลผู้ใช้งาน:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customUserName}
                        onChange={(e) => {
                          setCustomUserName(e.target.value);
                          if (e.target.value) setSelectedUserId('');
                        }}
                        placeholder="ระบุชื่อ-สกุล สำหรับบันทึก Audit Log"
                        className="w-full text-xs rounded-xl border border-slate-300 p-2.5 pl-8 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      หากไม่มีรายชื่อในระบบ สามารถพิมพ์ชื่อของท่านได้โดยตรง
                    </p>
                  </div>
                </div>

                {/* Password Input & Submit */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      3. รหัสผ่านความปลอดภัย (Security Password):
                    </label>
                    <span className="text-[11px] text-slate-400">
                      🔒 กรอกรหัสผ่านประจำสิทธิ์ {getAccessLevelConfig(selectedLevel).shortTitle}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError('');
                      }}
                      placeholder="กรอกรหัสผ่านเพื่อเข้าใช้งาน"
                      className="w-full text-sm font-mono rounded-xl border border-slate-300 p-3 pl-9 pr-10 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Login Error Notification */}
                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onContinueAsGuest}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors font-medium text-center"
                  >
                    เข้าชมภาพรวมทั่วไปในฐานะผู้สังเกตการณ์ (Guest View)
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingLogin}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                  >
                    <span>ลงชื่อเข้าสู่ระบบ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: PERSONNEL REGISTRATION */}
            {activePortalTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-emerald-700" />
                    <span>แบบฟอร์มลงทะเบียนบุคลากร / คณะกรรมการ GCH เข้าสู่ระบบ</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    บันทึกข้อมูลเข้าสู่ฐานข้อมูล Cloud Firestore เพื่อให้ชื่อและตำแหน่งของท่านปรากฏในทะเบียนบุคลากร และเข้าใช้งานได้ทันที
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      ชื่อ - นามสกุล <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="เช่น นพ.ประสิทธิ์ จิตเจริญ / นางสาวสมใจ รักดี"
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      ตำแหน่งวิชาชีพ / หน้าที่ <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      value={regPosition}
                      onChange={(e) => setRegPosition(e.target.value)}
                      placeholder="เช่น นายแพทย์ชำนาญการ / พยาบาลวิชาชีพ / นักวิชาการสาธารณสุข"
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      กลุ่มงาน / ฝ่าย / หน่วยงาน <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      placeholder="เช่น กลุ่มงานบริหารทั่วไป / กลุ่มงานบริการทางการแพทย์"
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      เลือกระดับสิทธิ์ที่ขอปฏิบัติงาน <span className="text-rose-500">*</span>:
                    </label>
                    <select
                      value={regLevel}
                      onChange={(e) => {
                        setRegLevel(e.target.value as AccessLevel);
                        setRegPassword('');
                      }}
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="1">ระดับ 1: ผู้รับผิดชอบงาน (บันทึกข้อมูล/แนบหลักฐาน)</option>
                      <option value="2">ระดับ 2: ผู้รับรอง / หัวหน้างาน (ตรวจและรับรองงาน)</option>
                      <option value="3">ระดับ 3: ผู้บริหารขั้นต้น (หัวหน้ากลุ่มงาน/ฝ่าย)</option>
                      <option value="4">ระดับ 4: ผู้บริหารขั้นสูง (ผู้อำนวยการ / รอง ผอ.)</option>
                      <option value="5">ระดับ 5: ผู้ประเมินภายนอก (กรรมการตรวจประเมิน GCH)</option>
                    </select>
                  </div>
                </div>

                {/* Password confirmation for level */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      รหัสผ่านยืนยันสิทธิ์สำหรับ{getAccessLevelConfig(regLevel).shortTitle} <span className="text-rose-500">*</span>:
                    </label>
                    <span className="text-[11px] text-slate-400">
                      🔒 กรุณากรอกรหัสผ่านความปลอดภัยประจำระดับ
                    </span>
                  </div>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      setRegError('');
                    }}
                    placeholder="กรอกรหัสผ่านเพื่อยืนยันสิทธิ์"
                    className="w-full text-xs font-mono rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    หมายเหตุ / เบอร์โทรศัพท์ติดต่อ (ไม่บังคับ):
                  </label>
                  <input
                    type="text"
                    value={regNote}
                    onChange={(e) => setRegNote(e.target.value)}
                    placeholder="เช่น โทร 081-xxx-xxxx หรือ ประจำโครงการประหยัดพลังงาน"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Notifications */}
                {regError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{regError}</span>
                  </div>
                )}
                {regSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{regSuccessMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActivePortalTab('login')}
                    className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
                  >
                    ยกเลิก / กลับไปเข้าสู่ระบบ
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingReg}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    <span>บันทึกลงทะเบียนและเข้าสู่ระบบทันที</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Security Notice Footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ระบบควบคุมความปลอดภัยและการเข้าถึงตามมาตรฐาน Green & Clean Hospital
            </span>
            <span className="text-slate-400 text-[10px]">
              🔒 ข้อมูลการเข้าใช้งานทุกระดับจะถูกบันทึกลง Audit Trail โดยอัตโนมัติ
            </span>
          </div>
        </div>

        {/* 9 Standard Categories Mini Showcase */}
        <div className="max-w-4xl mx-auto space-y-3 pt-4">
          <div className="text-center">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              มาตรฐาน Green & Clean Hospital 9 หมวดหลักที่โรงพยาบาลดำเนินงาน
            </h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="bg-white/80 backdrop-blur-xs rounded-xl p-2.5 border border-slate-200/80 text-center shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs mb-1 font-bold">
                  {cat.icon === 'Zap' && <Zap className="w-3.5 h-3.5 text-amber-600" />}
                  {cat.icon === 'Recycle' && <Recycle className="w-3.5 h-3.5 text-teal-600" />}
                  {cat.icon === 'Droplets' && <Droplets className="w-3.5 h-3.5 text-sky-600" />}
                  {cat.icon === 'Trees' && <Trees className="w-3.5 h-3.5 text-emerald-600" />}
                  {!['Zap', 'Recycle', 'Droplets', 'Trees'].includes(cat.icon) && (
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <div className="text-[10px] font-bold text-slate-800 line-clamp-1">
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* System Footer Note */}
      <div className="text-center text-[11px] text-slate-400 pt-6">
        ระบบพัฒนามาตรฐานโรงพยาบาลที่เป็นมิตรกับสิ่งแวดล้อม (GCH) • ข้อมูลเชื่อมต่อ Cloud Database แบบ Real-time
      </div>
    </div>
  );
};
