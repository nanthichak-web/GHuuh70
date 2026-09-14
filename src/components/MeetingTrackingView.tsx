import React, { useState } from 'react';
import {
  Calendar,
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  ExternalLink,
  Sparkles,
  FolderPlus,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Trash2,
  X,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';
import { Meeting, MeetingResolution, Project, MeetingEndorsement, UserRole } from '../types';
import { getStatusConfig } from '../utils/helpers';

interface MeetingTrackingViewProps {
  meetings: Meeting[];
  projects: Project[];
  currentUserRole?: UserRole;
  onSelectProject: (p: Project) => void;
  onConvertResolutionToProject: (meeting: Meeting, res: MeetingResolution) => void;
  onOpenNewMeetingModal: () => void;
  onUpdateMeeting: (updatedMeeting: Meeting) => void;
}

export const MeetingTrackingView: React.FC<MeetingTrackingViewProps> = ({
  meetings,
  projects,
  currentUserRole,
  onSelectProject,
  onConvertResolutionToProject,
  onOpenNewMeetingModal,
  onUpdateMeeting
}) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(meetings[0]?.id || '');
  const [showEndorsementModal, setShowEndorsementModal] = useState<boolean>(false);

  // Endorsement Form States
  const [signerName, setSignerName] = useState<string>('');
  const [signerRole, setSignerRole] = useState<string>('กรรมการ Green & Clean Hospital');
  const [decision, setDecision] = useState<'endorsed' | 'rejected'>('endorsed');
  const [reason, setReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const activeMeeting = meetings.find(m => m.id === selectedMeetingId) || meetings[0];

  // Calculate endorsement stats for active meeting
  const endorsements = activeMeeting?.endorsements || [];
  const endorsedCount = endorsements.filter(e => e.decision === 'endorsed').length;
  const rejectedCount = endorsements.filter(e => e.decision === 'rejected').length;
  const totalSigned = endorsements.length;

  // Preset committee members for quick selection
  const committeePresets = [
    { name: 'นพ.เกรียงศักดิ์ ธรรมรัตน์', role: 'ประธานกรรมการ GCH / ผู้อำนวยการ' },
    { name: 'นพ.สมศักดิ์ ปรีชาชาญ', role: 'รองผู้อำนวยการฝ่ายการแพทย์ / ประธานที่ประชุม' },
    { name: 'นางสาวกานดา สุวรรณฉัตร', role: 'กรรมการและเลขานุการ / งานสิ่งแวดล้อม' },
    { name: 'พญ.ศศิธร วงศ์สวรรค์', role: 'กรรมการ / ตัวแทนคณะแพทย์และกายภาพ' },
    { name: 'นายธนกฤต ประเสริฐยิ่ง', role: 'กรรมการ / งานอาชีวอนามัยและความปลอดภัย' },
    { name: 'นายประสิทธิ์ มงคลชัย', role: 'กรรมการ / งานบริหารทั่วไปและพัสดุ' }
  ];

  const handleOpenModal = () => {
    setErrorMsg('');
    setReason('');
    setDecision('endorsed');
    // Pre-fill reasonable defaults if none selected yet
    if (!signerName) {
      setSignerName('นพ.สมศักดิ์ ปรีชาชาญ');
      setSignerRole('รองผู้อำนวยการฝ่ายการแพทย์ / กรรมการ GCH');
    }
    setShowEndorsementModal(true);
  };

  const handleSubmitEndorsement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) {
      setErrorMsg('กรุณาระบุชื่อ-นามสกุล ของกรรมการผู้ลงนาม');
      return;
    }

    if (!activeMeeting) return;

    // Create new Endorsement Entry
    const now = new Date();
    const thaiDateStr = now.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ` เวลา ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;

    const newEndorsement: MeetingEndorsement = {
      id: `end-${Date.now()}`,
      memberName: signerName.trim(),
      memberRole: signerRole.trim() || 'กรรมการ Green & Clean Hospital',
      decision,
      timestamp: thaiDateStr,
      ...(reason.trim() ? { reason: reason.trim() } : {})
    };

    const updatedMeeting: Meeting = {
      ...activeMeeting,
      endorsements: [...(activeMeeting.endorsements || []), newEndorsement]
    };

    onUpdateMeeting(updatedMeeting);
    setShowEndorsementModal(false);
  };

  const handleDeleteEndorsement = (endId: string) => {
    if (!activeMeeting) return;
    if (confirm('คุณต้องการยกเลิก/ลบการลงนามรับรองรายการนี้ใช่หรือไม่?')) {
      const updatedMeeting: Meeting = {
        ...activeMeeting,
        endorsements: (activeMeeting.endorsements || []).filter(e => e.id !== endId)
      };
      onUpdateMeeting(updatedMeeting);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200 mb-2">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Meeting Tracking & Resolution Governance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            ระบบติดตามการประชุมและรับรองมติคณะกรรมการ
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            ติดตามมติที่ประชุม Green & Clean Hospital พร้อมระบบลงนามรับรองมติโดยคณะกรรมการ (รับรอง / ไม่รับรอง) และแปลงมติเป็นงานติดตามในระบบได้ทันที
          </p>
        </div>

        <button
          onClick={onOpenNewMeetingModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>บันทึกการประชุมใหม่</span>
        </button>
      </div>

      {/* 2-Column Layout: Meeting List on Left, Active Meeting Details & Endorsement on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Meetings Navigation List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            รายการบันทึกการประชุม ({meetings.length} ครั้ง)
          </div>

          <div className="space-y-2">
            {meetings.map((m) => {
              const isSelected = m.id === selectedMeetingId;
              const resCount = m.resolutions.length;
              const completedCount = m.resolutions.filter(r => r.status === 'completed').length;
              const mEndorsements = m.endorsements || [];
              const mEndorsedCount = mEndorsements.filter(e => e.decision === 'endorsed').length;
              const mRejectedCount = mEndorsements.filter(e => e.decision === 'rejected').length;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeetingId(m.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono font-medium text-slate-500">{m.code}</span>
                    <span className="text-slate-400">{m.date}</span>
                  </div>

                  <h3 className={`text-xs font-bold line-clamp-2 ${isSelected ? 'text-teal-900' : 'text-slate-900'}`}>
                    {m.title}
                  </h3>

                  {/* Endorsement Status Badge on List */}
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    {mEndorsements.length === 0 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>รอกรรมการรับรอง</span>
                      </span>
                    ) : mRejectedCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>ไม่รับรอง {mRejectedCount} ท่าน (รับรอง {mEndorsedCount})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>รับรองมติแล้ว {mEndorsedCount} ท่าน</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
                    <span>👥 {m.attendeesCount} ผู้เข้าร่วม</span>
                    <span className="font-medium text-teal-700">
                      มติสำเร็จ {completedCount}/{resCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Meeting Detail, Committee Endorsement & Resolutions */}
        {activeMeeting && (
          <div className="lg:col-span-8 space-y-5">
            
            {/* Meeting Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {activeMeeting.code}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    {activeMeeting.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                    <span>📅 วันที่: <strong>{activeMeeting.date}</strong> ({activeMeeting.time})</span>
                    <span>📍 สถานที่: <strong>{activeMeeting.location}</strong></span>
                    <span>👤 ประธาน: <strong>{activeMeeting.chairperson}</strong></span>
                  </div>
                </div>
              </div>

              {/* Attendees & Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                <div>
                  <span className="font-semibold text-slate-700">ผู้เข้าร่วม ({activeMeeting.attendeesCount} คน): </span>
                  <span className="text-slate-600">{activeMeeting.attendeesSummary}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">สรุปผลการประชุม: </span>
                  <span className="text-slate-600 leading-relaxed">{activeMeeting.minutesSummary}</span>
                </div>
              </div>

              {/* Agenda & Attachments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-xs font-bold text-slate-700 mb-1.5">วาระการประชุม:</div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {activeMeeting.agenda.map((ag, idx) => (
                      <li key={idx} className="line-clamp-1 flex items-start gap-1.5">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{ag}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-700 mb-1.5">เอกสารและรายงานการประชุม:</div>
                  <div className="space-y-1.5">
                    {activeMeeting.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="truncate font-medium text-slate-800">{att.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{att.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* COMMITTEE RESOLUTION ENDORSEMENT SECTION (ตามคำขอ: กรรมการเข้ามารับรองมติการประชุม / ไม่รับรองมติ) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-200 mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Committee Endorsement & Governance</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>การลงนามรับรองมติที่ประชุมโดยคณะกรรมการ</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      ลงนามแล้ว {totalSigned} ท่าน
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    กรรมการผู้มีสิทธิ์ตรวจสอบรายงานและลงมติ รับรอง หรือ ไม่รับรองมติที่ประชุม พร้อมระบุข้อสังเกต
                  </p>
                </div>

                <button
                  onClick={handleOpenModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-102 self-start sm:self-auto cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>[ลงนามรับรองมติที่ประชุม]</span>
                </button>
              </div>

              {/* Endorsement Summary Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-emerald-800">รับรองมติการประชุม</div>
                    <div className="text-lg font-bold text-emerald-950">{endorsedCount} <span className="text-xs font-normal text-emerald-700">ท่าน</span></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-rose-800">ไม่รับรองมติที่ประชุม</div>
                    <div className="text-lg font-bold text-rose-950">{rejectedCount} <span className="text-xs font-normal text-rose-700">ท่าน</span></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-600">สถานะมติภาพรวม</div>
                    <div className="text-xs font-bold text-slate-800">
                      {totalSigned === 0 ? (
                        <span className="text-amber-600 font-semibold">รอกรรมการลงนาม</span>
                      ) : rejectedCount > 0 ? (
                        <span className="text-rose-600 font-semibold">มีข้อทักท้วง/แก้ไข</span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">ผ่านการรับรองเอกฉันท์</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Endorsements List */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>ประวัติการลงนามรับรองของกรรมการ ({endorsements.length} รายการ):</span>
                  {endorsements.length > 0 && (
                    <span className="text-[11px] font-normal text-slate-400">
                      จัดเก็บลง Cloud Database และพร้อมตรวจสอบย้อนหลัง
                    </span>
                  )}
                </div>

                {endorsements.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2">
                    <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600">ยังไม่มีการบันทึกการลงนามรับรองมติในรอบการประชุมนี้</p>
                    <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                      คณะกรรมการสามารถกดปุ่ม "[ลงนามรับรองมติที่ประชุม]" ด้านบน เพื่อบันทึกชื่อและระบุสถานะรับรองหรือทักท้วงมติ
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {endorsements.map((item) => {
                      const isEndorsed = item.decision === 'endorsed';
                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-xl border transition-all text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                            isEndorsed
                              ? 'bg-emerald-50/30 border-emerald-200/80 hover:bg-emerald-50/50'
                              : 'bg-rose-50/30 border-rose-200/80 hover:bg-rose-50/50'
                          }`}
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  isEndorsed
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border-rose-300'
                                }`}
                              >
                                {isEndorsed ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>รับรองมติการประชุม</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 text-rose-600" />
                                    <span>ไม่รับรองมติที่ประชุม</span>
                                  </>
                                )}
                              </span>

                              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                {item.memberName}
                              </span>

                              <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {item.memberRole}
                              </span>
                            </div>

                            {/* Reason / Remarks if present */}
                            {item.reason && (
                              <div className="p-2.5 rounded-lg bg-white border border-slate-200/90 text-[11px] text-slate-700 flex items-start gap-2 mt-1">
                                <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                <div className="leading-relaxed">
                                  <span className="font-semibold text-slate-800">ข้อสังเกต/เหตุผล: </span>
                                  <span>{item.reason}</span>
                                </div>
                              </div>
                            )}

                            <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>ลงนามเมื่อ: {item.timestamp}</span>
                            </div>
                          </div>

                          {/* Delete Endorsement button */}
                          <button
                            onClick={() => handleDeleteEndorsement(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors self-end sm:self-auto cursor-pointer"
                            title="ลบ/ยกเลิกการลงนามนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Resolutions Section (The core feature: มติที่ประชุม -> กลายเป็นงานติดตาม) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>มติที่ประชุมและการติดตามผล ({activeMeeting.resolutions.length} มติ)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    แปลงมติเป็นงานติดตามในระบบเพื่อกำหนดผู้รับผิดชอบ, กำหนดเวลา, และติดตามความคืบหน้า
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {activeMeeting.resolutions.map((res) => {
                  const statusCfg = getStatusConfig(res.status);
                  const linkedProject = res.linkedProjectId
                    ? projects.find(p => p.id === res.linkedProjectId)
                    : null;

                  return (
                    <div
                      key={res.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/40 hover:bg-white transition-all text-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusCfg.badgeClass}`}>
                            <span>{statusCfg.iconEmoji}</span>
                            <span>{statusCfg.label}</span>
                          </span>
                          <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {res.department}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            กำหนดเสร็จ: {res.deadline}
                          </span>
                        </div>

                        <div className="font-bold text-slate-900 text-xs sm:text-sm leading-relaxed">
                          {res.topic}
                        </div>

                        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                          <span>👤 ผู้รับผิดชอบ: <strong>{res.responsiblePerson}</strong></span>
                          <span>•</span>
                          <span>ความคืบหน้า: <strong>{res.progress}%</strong></span>
                        </div>
                      </div>

                      {/* Action: Already linked or Convert button */}
                      <div className="shrink-0 flex items-center gap-2">
                        {linkedProject ? (
                          <button
                            onClick={() => onSelectProject(linkedProject)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                            title="เปิดดูโครงการติดตาม"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>ดูโครงการ: {linkedProject.code}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onConvertResolutionToProject(activeMeeting, res)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all hover:scale-102 cursor-pointer"
                            title="กดเพื่อสร้างเป็นโครงการติดตามในระบบทันที"
                          >
                            <FolderPlus className="w-4 h-4" />
                            <span>[สร้างงานติดตามจากมติ]</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* COMMITTEE ENDORSEMENT MODAL (หน้าต่างลงนามรับรองมติการประชุม) */}
      {showEndorsementModal && activeMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ลงนามรับรองมติการประชุม
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeMeeting.code} - {activeMeeting.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEndorsementModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitEndorsement} className="space-y-4 text-xs">
              
              {/* Quick Preset Buttons */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  เลือกกรรมการอย่างรวดเร็ว (Preset):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {committeePresets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSignerName(p.name);
                        setSignerRole(p.role);
                      }}
                      className={`px-2 py-1 rounded-lg text-[11px] transition-colors border cursor-pointer ${
                        signerName === p.name
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.name.split(' ')[0]} {p.name.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ชื่อ-นามสกุล กรรมการผู้ลงนาม <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="เช่น นพ.สมศักดิ์ ปรีชาชาญ หรือ นางสาวกานดา สุวรรณฉัตร"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs"
                />
              </div>

              {/* Role input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ตำแหน่ง / ฝ่ายในคณะกรรมการ
                </label>
                <input
                  type="text"
                  value={signerRole}
                  onChange={(e) => setSignerRole(e.target.value)}
                  placeholder="เช่น ประธานกรรมการ, กรรมการและเลขานุการ, ผู้แทนฝ่ายการพยาบาล"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs"
                />
              </div>

              {/* Decision Toggle Radio Cards */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  สถานะการรับรองมติที่ประชุม <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Option 1: รับรองมติการประชุม */}
                  <div
                    onClick={() => setDecision('endorsed')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      decision === 'endorsed'
                        ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>รับรองมติการประชุม</span>
                      </div>
                      <input
                        type="radio"
                        name="decision"
                        checked={decision === 'endorsed'}
                        onChange={() => setDecision('endorsed')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-[10px] text-emerald-700/90 leading-tight">
                      เห็นชอบกับบันทึกรายงานและมติที่ประชุมทุกข้อ
                    </p>
                  </div>

                  {/* Option 2: ไม่รับรองมติที่ประชุม */}
                  <div
                    onClick={() => setDecision('rejected')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      decision === 'rejected'
                        ? 'bg-rose-50/80 border-rose-500 text-rose-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 text-xs">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>ไม่รับรองมติที่ประชุม</span>
                      </div>
                      <input
                        type="radio"
                        name="decision"
                        checked={decision === 'rejected'}
                        onChange={() => setDecision('rejected')}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                    </div>
                    <p className="text-[10px] text-rose-700/90 leading-tight">
                      มีข้อทักท้วง ไม่เห็นชอบ หรือขอให้แก้ไขบันทึกมติ
                    </p>
                  </div>

                </div>
              </div>

              {/* Reason / Remarks */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ข้อสังเกต / เหตุผลประกอบการพิจารณา {decision === 'rejected' && <span className="text-rose-500">(แนะนำให้ระบุเหตุผลที่ไม่รับรอง)</span>}
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    decision === 'endorsed'
                      ? 'ระบุข้อเสนอแนะเพิ่มเติมสำหรับติดตามการดำเนินงาน (ถ้ามี)...'
                      : 'ระบุเหตุผลที่ไม่เห็นชอบ หรือข้อความที่ต้องการให้ปรับปรุงแก้ไขมติ...'
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs"
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEndorsementModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    decision === 'endorsed'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ยืนยันการลงนาม{decision === 'endorsed' ? 'รับรองมติ' : 'ไม่รับรองมติ'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
