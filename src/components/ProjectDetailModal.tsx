import React, { useState } from 'react';
import {
  X,
  Calendar,
  Layers,
  Building,
  User,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  FileText,
  FileSpreadsheet,
  Plus,
  Send,
  CornerDownRight,
  MessageSquare,
  ShieldCheck,
  Award,
  Upload,
  ExternalLink,
  ChevronDown,
  Trash2,
  Loader2,
  Cloud
} from 'lucide-react';
import { Project, Category, EvidenceItem, TimelineEntry, UserRole, WorkflowLevel, StatusType } from '../types';
import { getStatusConfig, getWorkflowLevelInfo } from '../utils/helpers';
import { uploadEvidenceFile } from '../lib/firebase';

interface ProjectDetailModalProps {
  project: Project;
  categories: Category[];
  activeRole: UserRole;
  onClose: () => void;
  onUpdateProject: (updated: Project) => void;
  onPreviewEvidence: (ev: EvidenceItem, projectName: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  categories,
  activeRole,
  onClose,
  onUpdateProject,
  onPreviewEvidence
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'evidence' | 'timeline' | 'workflow'>('evidence');
  
  // Progress edit state
  const [editProgress, setEditProgress] = useState(project.progressPercent);
  const [editStatus, setEditStatus] = useState<StatusType>(project.status);

  // New Evidence Form State
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [newEvTitle, setNewEvTitle] = useState('');
  const [newEvDesc, setNewEvDesc] = useState('');
  const [newEvType, setNewEvType] = useState<'photo' | 'document' | 'data' | 'video'>('photo');
  const [newEvPhase, setNewEvPhase] = useState<'before' | 'during' | 'after' | 'general'>('during');
  const [newEvFileName, setNewEvFileName] = useState('');
  const [newEvFileUrl, setNewEvFileUrl] = useState('');
  const [newEvFileSize, setNewEvFileSize] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // New Timeline Form State
  const [showAddTimeline, setShowAddTimeline] = useState(false);
  const [newTlTitle, setNewTlTitle] = useState('');
  const [newTlDesc, setNewTlDesc] = useState('');
  const [newTlNotes, setNewTlNotes] = useState('');

  // Comment State
  const [newComment, setNewComment] = useState('');

  const statusCfg = getStatusConfig(project.status);
  const workflowCfg = getWorkflowLevelInfo(project.workflowLevel);
  const category = categories.find(c => c.id === project.categoryId);

  // Handle Quick Save of Progress/Status
  const handleSaveProgress = () => {
    const updated: Project = {
      ...project,
      progressPercent: editProgress,
      status: editStatus,
      lastUpdated: 'เมื่อสักครู่'
    };
    onUpdateProject(updated);
  };

  // Handle Real Cloud File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingFile(true);
      setNewEvFileName(file.name);
      try {
        const uploadResult = await uploadEvidenceFile(file, project.id);
        setNewEvFileUrl(uploadResult.url);
        setNewEvFileSize(uploadResult.fileSize);
        if (!newEvTitle) {
          // Auto-suggest title based on file name without extension
          const autoTitle = file.name.replace(/\.[^/.]+$/, "");
          setNewEvTitle(autoTitle);
        }
      } catch (err) {
        console.error('Error uploading evidence file:', err);
      } finally {
        setIsUploadingFile(false);
      }
    }
  };

  // Handle Add Evidence
  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvTitle.trim()) return;

    const newEvidence: EvidenceItem = {
      id: `ev-${Date.now()}`,
      type: newEvType,
      title: newEvTitle,
      description: newEvDesc,
      fileName: newEvFileName || (newEvType === 'photo' ? 'evidence_photo.jpg' : 'evidence_doc.pdf'),
      fileSize: newEvFileSize || '1.8 MB',
      fileUrl: newEvFileUrl || (newEvType === 'photo' ? 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80' : '#'),
      uploadedAt: 'วันนี้',
      uploadedBy: project.responsiblePerson,
      phase: newEvPhase
    };

    const updated: Project = {
      ...project,
      evidenceList: [newEvidence, ...project.evidenceList],
      lastUpdated: 'วันนี้'
    };

    onUpdateProject(updated);
    setNewEvTitle('');
    setNewEvDesc('');
    setNewEvFileName('');
    setNewEvFileUrl('');
    setShowAddEvidence(false);
  };

  // Handle Add Timeline Checkpoint
  const handleAddTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTlTitle.trim()) return;

    const newEntry: TimelineEntry = {
      id: `tl-${Date.now()}`,
      date: 'วันนี้',
      title: newTlTitle,
      description: newTlDesc,
      statusBadge: project.status,
      authorName: project.responsiblePerson,
      authorRole: 'ผู้รับผิดชอบงาน',
      notes: newTlNotes
    };

    const updated: Project = {
      ...project,
      timeline: [...project.timeline, newEntry],
      lastUpdated: 'วันนี้'
    };

    onUpdateProject(updated);
    setNewTlTitle('');
    setNewTlDesc('');
    setNewTlNotes('');
    setShowAddTimeline(false);
  };

  // Handle Workflow Status Transition Actions (Level 1 -> 2 -> 3 -> 4 -> 5)
  const handleWorkflowAction = (action: 'submit' | 'approve' | 'revise' | 'reject' | 'executive_close') => {
    let nextLevel: WorkflowLevel = project.workflowLevel;
    let nextStatus: StatusType = project.status;
    let logTitle = '';
    let authorRole = '';

    if (action === 'submit') {
      // Officer sends to supervisor
      nextLevel = 2;
      nextStatus = 'pending_verify';
      logTitle = 'ผู้รับผิดชอบส่งงานเพื่อรอการรับรองจากหัวหน้างาน';
      authorRole = 'ผู้รับผิดชอบงาน';
    } else if (action === 'approve') {
      if (project.workflowLevel === 2) {
        // Supervisor approves -> sends to middle exec
        nextLevel = 3;
        nextStatus = 'pending_exec';
        logTitle = 'หัวหน้างาน/ผู้รับรอง ตรวจสอบความถูกต้องและรับรองงานเรียบร้อย';
        authorRole = 'ผู้รับรอง / หัวหน้างาน';
      } else if (project.workflowLevel === 3) {
        // Middle exec approves -> sends to senior exec
        nextLevel = 4;
        nextStatus = 'pending_exec';
        logTitle = 'ผู้บริหารขั้นต้น (หัวหน้ากลุ่มงาน/ฝ่าย) อนุมัติและเสนอผู้บริหารขั้นสูง';
        authorRole = 'ผู้บริหารขั้นต้น';
      } else if (project.workflowLevel >= 4) {
        // Executive final approval / close
        nextLevel = 5;
        nextStatus = 'completed';
        logTitle = 'ผู้อำนวยการ/ผู้บริหารขั้นสูง รับรองระดับโรงพยาบาลและปิดงานเสร็จสมบูรณ์';
        authorRole = 'ผู้บริหารขั้นสูง';
      }
    } else if (action === 'revise') {
      // Send back for revision
      nextLevel = 1;
      nextStatus = 'delayed';
      logTitle = 'ส่งกลับแก้ไข: ตรวจสอบพบหลักฐานไม่ครบถ้วน ส่งคืนให้ผู้รับผิดชอบปรับปรุง';
      authorRole = activeRole === 'supervisor' ? 'ผู้รับรอง' : 'ผู้บริหาร';
    } else if (action === 'executive_close') {
      nextLevel = 5;
      nextStatus = 'completed';
      logTitle = 'ผู้บริหารขั้นสูง รับรองระดับโรงพยาบาลและปิดงาน (Completed & Certified)';
      authorRole = 'ผู้บริหารขั้นสูง';
    }

    const newTimelineEntry: TimelineEntry = {
      id: `tl-${Date.now()}`,
      date: 'วันนี้',
      time: '14:30',
      title: logTitle,
      description: newComment || 'ดำเนินการผ่านระบบ Workflow ลำดับขั้น Green Care Track',
      statusBadge: nextStatus,
      authorName: activeRole === 'supervisor' ? 'นพ.เกรียงศักดิ์ ธรรมรัตน์' : activeRole === 'middle_exec' ? 'นางรัตนา ทรัพย์อุดม' : 'นพ.วิบูลย์ วัฒนกุล',
      authorRole: authorRole
    };

    const newCommentEntry = newComment.trim() ? {
      id: `c-${Date.now()}`,
      authorName: authorRole,
      authorRole: authorRole,
      content: newComment,
      createdAt: 'วันนี้ 14:30',
      level: project.workflowLevel
    } : null;

    const updated: Project = {
      ...project,
      workflowLevel: nextLevel,
      status: nextStatus,
      progressPercent: nextLevel === 5 ? 100 : project.progressPercent,
      timeline: [...project.timeline, newTimelineEntry],
      comments: newCommentEntry ? [...project.comments, newCommentEntry] : project.comments,
      lastUpdated: 'วันนี้'
    };

    onUpdateProject(updated);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                {project.code}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badgeClass}`}>
                <span>{statusCfg.iconEmoji}</span>
                <span>{statusCfg.label}</span>
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${workflowCfg.badgeClass}`}>
                <span>{workflowCfg.iconEmoji}</span>
                <span>{workflowCfg.title}</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              {project.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              หมวด: <strong>{category?.name}</strong> • หน่วยงาน: <strong>{project.department}</strong> • ผู้รับผิดชอบ: <strong>{project.responsiblePerson}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-2 text-xs font-semibold bg-white">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>📎 หลักฐานประกอบผลงาน ({project.evidenceList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>🕒 Timeline ความก้าวหน้า ({project.timeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>⚡ ลำดับขั้นการรับรอง (Workflow 5 ระดับ)</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>ข้อมูลโครงการและเป้าหมาย</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: EVIDENCE REPOSITORY & UPLOAD */}
          {activeTab === 'evidence' && (
            <div className="space-y-6">
              
              {/* Evidence Action Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>หลักฐานประกอบผลการดำเนินงาน (Evidence-Based System)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    รองรับภาพถ่ายก่อน-ระหว่าง-หลัง เอกสารราชการ ผลตรวจทางแล็บ และตารางสถิติ
                  </p>
                </div>

                <button
                  onClick={() => setShowAddEvidence(!showAddEvidence)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddEvidence ? 'ยกเลิก' : 'แนบหลักฐานใหม่'}</span>
                </button>
              </div>

              {/* Add Evidence Form */}
              {showAddEvidence && (
                <form onSubmit={handleAddEvidenceSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 animate-in fade-in">
                  <div className="text-xs font-bold text-slate-800">
                    ➕ แนบหลักฐานประกอบผลงานใหม่
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">ประเภทหลักฐาน *</label>
                      <select
                        value={newEvType}
                        onChange={(e) => setNewEvType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      >
                        <option value="photo">📷 รูปภาพ (Before / During / After)</option>
                        <option value="document">📄 เอกสาร / รายงาน / คำสั่ง / ประกาศ</option>
                        <option value="data">📊 ข้อมูลสถิติ / Excel / ผลตรวจวัด</option>
                        <option value="video">🎥 วิดีโอ / มัลติมีเดีย</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">ช่วงเวลาการดำเนินงาน</label>
                      <select
                        value={newEvPhase}
                        onChange={(e) => setNewEvPhase(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      >
                        <option value="before">ภาพก่อนดำเนินการ (Before)</option>
                        <option value="during">ภาพระหว่างดำเนินการ (During)</option>
                        <option value="after">ภาพหลังดำเนินการ (After)</option>
                        <option value="general">ทั่วไป / เอกสารสรุป</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-medium text-slate-700">เลือกไฟล์จากเครื่อง</label>
                        {isUploadingFile && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" /> อัปโหลดขึ้น Cloud...
                          </span>
                        )}
                        {!isUploadingFile && newEvFileUrl && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                            <Cloud className="w-3 h-3" /> พร้อมแนบ
                          </span>
                        )}
                      </div>
                      <input
                        type="file"
                        disabled={isUploadingFile}
                        onChange={handleFileUpload}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-60"
                      />
                      {newEvFileName && (
                        <p className="text-[10px] text-slate-500 mt-1 truncate">
                          ไฟล์: <span className="text-slate-800 font-medium">{newEvFileName}</span> {newEvFileSize && `(${newEvFileSize})`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">ชื่อหลักฐาน *</label>
                      <input
                        type="text"
                        required
                        value={newEvTitle}
                        onChange={(e) => setNewEvTitle(e.target.value)}
                        placeholder="เช่น ภาพกิจกรรมการคัดแยกขยะ ณ อาคารผู้ป่วยใน"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">คำอธิบายหลักฐานเชิงลึก</label>
                      <textarea
                        rows={2}
                        value={newEvDesc}
                        onChange={(e) => setNewEvDesc(e.target.value)}
                        placeholder="ระบุรายละเอียด เช่น ดำเนินการเมื่อวันที่... โดยมีบุคลากรเข้าร่วม..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddEvidence(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      บันทึกหลักฐาน
                    </button>
                  </div>
                </form>
              )}

              {/* Evidence Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.evidenceList.length === 0 ? (
                  <div className="col-span-2 text-center py-12 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    ยังไม่มีหลักฐานแนบในโครงการนี้ กด "แนบหลักฐานใหม่" เพื่อเริ่มบันทึก
                  </div>
                ) : (
                  project.evidenceList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all text-xs flex flex-col justify-between"
                    >
                      <div>
                        {/* Evidence Badge & Phase */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                            {item.type === 'photo' ? '📷 ภาพถ่าย' : item.type === 'data' ? '📊 ตาราง/Excel' : '📄 เอกสาร'}
                          </span>
                          {item.phase && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.phase === 'before'
                                ? 'bg-amber-100 text-amber-800'
                                : item.phase === 'during'
                                ? 'bg-sky-100 text-sky-800'
                                : item.phase === 'after'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {item.phase === 'before' ? 'ก่อนดำเนินการ (Before)' : item.phase === 'during' ? 'ระหว่างดำเนินการ (During)' : item.phase === 'after' ? 'หลังดำเนินการ (After)' : 'ทั่วไป'}
                            </span>
                          )}
                        </div>

                        {/* Image Preview if photo */}
                        {item.type === 'photo' && item.fileUrl && (
                          <div className="w-full h-40 rounded-lg overflow-hidden mb-3 bg-slate-100 group relative">
                            <img
                              src={item.fileUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => onPreviewEvidence(item, project.name)}
                                className="px-3 py-1.5 bg-white/90 text-slate-900 rounded-lg font-bold text-xs shadow-md"
                              >
                                ขยายภาพ
                              </button>
                            </div>
                          </div>
                        )}

                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {item.title}
                        </h4>

                        <p className="text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="mt-3 text-[11px] text-slate-400 space-y-0.5 border-t border-slate-100 pt-2">
                          <div>ไฟล์: {item.fileName} ({item.fileSize || '2.1 MB'})</div>
                          <div>ผู้อัปโหลด: {item.uploadedBy} ({item.uploadedAt})</div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end">
                        <button
                          onClick={() => onPreviewEvidence(item, project.name)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>เปิดดูหลักฐานเต็มจอ</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE SYSTEM */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Timeline รายงานความก้าวหน้า (Audit Trail)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    บันทึกประวัติการดำเนินงาน ใครทำอะไร เมื่อไหร่ และมีหลักฐานใดประกอบ
                  </p>
                </div>

                <button
                  onClick={() => setShowAddTimeline(!showAddTimeline)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddTimeline ? 'ยกเลิก' : 'เพิ่มบันทึกความก้าวหน้า'}</span>
                </button>
              </div>

              {/* Add Timeline Form */}
              {showAddTimeline && (
                <form onSubmit={handleAddTimelineSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs animate-in fade-in">
                  <div className="font-bold text-slate-800">➕ เพิ่มเหตุการณ์ / หมุดหมายความก้าวหน้า</div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">หัวข้อเหตุการณ์ *</label>
                    <input
                      type="text"
                      required
                      value={newTlTitle}
                      onChange={(e) => setNewTlTitle(e.target.value)}
                      placeholder="เช่น ประชุมทีมดำเนินงาน, อบรมเจ้าหน้าที่, ส่งรายงานผล..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">รายละเอียด</label>
                    <textarea
                      rows={2}
                      value={newTlDesc}
                      onChange={(e) => setNewTlDesc(e.target.value)}
                      placeholder="อธิบายกิจกรรมที่ได้ทำลงไป..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">หมายเหตุ / ข้อมูลเพิ่มเติม</label>
                    <input
                      type="text"
                      value={newTlNotes}
                      onChange={(e) => setNewTlNotes(e.target.value)}
                      placeholder="เช่น มีการตรวจเช็คระบบ PPE ครบถ้วน"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddTimeline(false)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      บันทึกหมุดหมาย
                    </button>
                  </div>
                </form>
              )}

              {/* Stepper Timeline List */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {project.timeline.map((entry, idx) => {
                  const entryStatus = getStatusConfig(entry.statusBadge);
                  return (
                    <div key={entry.id} className="relative group">
                      {/* Stepper Dot */}
                      <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white ${entryStatus.dotClass}`} />
                      
                      <div className="bg-white p-4 rounded-xl border border-slate-200 group-hover:border-emerald-300 transition-all text-xs space-y-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {entry.title}
                          </span>
                          <span className="font-mono text-slate-400 text-[11px]">
                            📅 {entry.date} {entry.time && `(${entry.time})`}
                          </span>
                        </div>

                        <p className="text-slate-600 leading-relaxed">
                          {entry.description}
                        </p>

                        {entry.notes && (
                          <div className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                            📝 {entry.notes}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                          <span>👤 บันทึกโดย: <strong>{entry.authorName}</strong> ({entry.authorRole})</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${entryStatus.badgeClass}`}>
                            {entryStatus.iconEmoji} {entryStatus.shortLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: WORKFLOW 5 LEVELS */}
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>ระบบ Workflow ลำดับขั้นการรับรอง 5 ระดับ</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  เป็นหัวใจสำคัญของโปรแกรม เพื่อให้การรายงานผลมีความน่าเชื่อถือและผ่านการตรวจสอบอย่างเป็นลำดับขั้น
                </p>
              </div>

              {/* 5 Levels Stepper Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const wf = getWorkflowLevelInfo(lvl as WorkflowLevel);
                  const isCurrent = project.workflowLevel === lvl;
                  const isPassed = project.workflowLevel > lvl;

                  return (
                    <div
                      key={lvl}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-md ring-2 ring-emerald-300'
                          : isPassed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <div className="text-lg">{wf.iconEmoji}</div>
                      <div className="font-semibold text-xs mt-1">{wf.shortTitle}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        {isPassed ? '✓ ผ่านแล้ว' : isCurrent ? '● ขั้นตอนนี้' : 'รอการส่งต่อ'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Role Action Controls */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="text-xs font-bold text-slate-800">
                  ⚡ จัดการตามบทบาทปัจจุบันของท่าน: <span className="text-emerald-700 font-extrabold">{activeRole}</span>
                </div>

                {/* Comment / Note input for approval audit trail */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    บันทึกความเห็น / ข้อเสนอแนะ / หมายเหตุการรับรอง:
                  </label>
                  <textarea
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="ระบุข้อเสนอแนะ หรือเหตุผลการรับรอง/ส่งกลับแก้ไข..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                {/* Action Buttons based on Level */}
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  
                  {/* Level 1 Actions (ผู้รับผิดชอบ) */}
                  {project.workflowLevel === 1 && (
                    <button
                      onClick={() => handleWorkflowAction('submit')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>ส่งงานเพื่อขอการรับรองจากหัวหน้างาน (ส่งต่อระดับ 2)</span>
                    </button>
                  )}

                  {/* Level 2 Actions (ผู้รับรอง / หัวหน้างาน) */}
                  {project.workflowLevel === 2 && (
                    <>
                      <button
                        onClick={() => handleWorkflowAction('approve')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>🟢 ให้การรับรองงาน (ส่งต่อผู้บริหารขั้นต้น)</span>
                      </button>

                      <button
                        onClick={() => handleWorkflowAction('revise')}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>🟡 ส่งกลับแก้ไข (หลักฐานยังไม่ครบ)</span>
                      </button>
                    </>
                  )}

                  {/* Level 3 Actions (ผู้บริหารขั้นต้น) */}
                  {project.workflowLevel === 3 && (
                    <>
                      <button
                        onClick={() => handleWorkflowAction('approve')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>👔 อนุมัติ/รับทราบ (เสนอผู้บริหารขั้นสูง)</span>
                      </button>

                      <button
                        onClick={() => handleWorkflowAction('revise')}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>🟡 ส่งกลับแก้ไข</span>
                      </button>
                    </>
                  )}

                  {/* Level 4 Actions (ผู้บริหารขั้นสูง) */}
                  {project.workflowLevel >= 4 && project.workflowLevel < 5 && (
                    <button
                      onClick={() => handleWorkflowAction('executive_close')}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>🏥 รับรองระดับโรงพยาบาลและปิดงานเสร็จสมบูรณ์ (Certified)</span>
                    </button>
                  )}

                  {project.workflowLevel === 5 && (
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>โครงการได้รับการรับรองระดับโรงพยาบาลและปิดงานเสร็จสมบูรณ์เรียบร้อย</span>
                    </div>
                  )}

                </div>
              </div>

              {/* Audit Comments History */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800">
                  ประวัติความคิดเห็นและคำสั่งการ ({project.comments.length} รายการ):
                </div>

                {project.comments.length === 0 ? (
                  <div className="text-xs text-slate-400 py-3 text-center border border-dashed rounded-xl">
                    ยังไม่มีความเห็นบันทึกไว้
                  </div>
                ) : (
                  project.comments.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-bold text-slate-800">{c.authorName}</span>
                        <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-700">{c.content}</p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 4: GENERAL INFO & TARGETS */}
          {activeTab === 'info' && (
            <div className="space-y-5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <span className="font-semibold text-slate-400">ชื่อโครงการ:</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{project.name}</div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-400">หมวดมาตรฐาน GCH:</span>
                    <div className="font-bold text-emerald-800 mt-0.5">{category?.name} ({category?.nameEn})</div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-400">หน่วยงานที่รับผิดชอบ:</span>
                    <div className="font-medium text-slate-800 mt-0.5">{project.department}</div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-400">ผู้รับผิดชอบงาน:</span>
                    <div className="font-medium text-slate-800 mt-0.5">{project.responsiblePerson} ({project.responsiblePosition})</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <span className="font-semibold text-slate-400">เป้าหมายโครงการ (Target KPI):</span>
                    <div className="font-bold text-slate-900 mt-0.5">{project.target}</div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-400">ระยะเวลาดำเนินงาน:</span>
                    <div className="font-medium text-slate-800 mt-0.5">{project.startDate} ถึง {project.endDate} (ปีงบประมาณ {project.fiscalYear})</div>
                  </div>

                  {project.meetingResolutionTopic && (
                    <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200">
                      <span className="font-bold text-teal-900">🔗 สร้างจากมติการประชุม:</span>
                      <div className="text-teal-800 mt-0.5">{project.meetingResolutionTopic}</div>
                    </div>
                  )}

                  {/* Quick Edit Progress Slider */}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-700">อัปเดตความก้าวหน้า:</span>
                      <span className="font-bold text-emerald-700">{editProgress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editProgress}
                      onChange={(e) => setEditProgress(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    
                    <div className="flex justify-between items-center mt-3">
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as StatusType)}
                        className="px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                      >
                        <option value="in_progress">🟡 อยู่ระหว่างดำเนินการ</option>
                        <option value="pending_verify">🟠 รอตรวจสอบ/รับรอง</option>
                        <option value="pending_exec">🔵 รอผู้บริหารพิจารณา</option>
                        <option value="completed">🟢 ดำเนินการแล้ว/ผ่าน</option>
                        <option value="delayed">🔴 ล่าช้ากว่ากำหนด</option>
                        <option value="not_started">⚪ ยังไม่เริ่ม</option>
                      </select>

                      <button
                        onClick={handleSaveProgress}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold"
                      >
                        บันทึกผล
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            อัปเดตล่าสุด: {project.lastUpdated}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-900 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
