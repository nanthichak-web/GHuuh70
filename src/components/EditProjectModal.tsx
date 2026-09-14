import React, { useState } from 'react';
import {
  X,
  Save,
  Trash2,
  FolderKanban,
  User,
  Calendar,
  Layers,
  AlertTriangle,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { Project, Category, StatusType, WorkflowLevel } from '../types';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  categories: Category[];
  isAdmin: boolean;
  onSave: (updatedProject: Project) => void;
  onDelete?: (projectId: string) => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  categories,
  isAdmin,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState(project.name);
  const [code, setCode] = useState(project.code);
  const [categoryId, setCategoryId] = useState(project.categoryId);
  const [department, setDepartment] = useState(project.department);
  const [responsiblePerson, setResponsiblePerson] = useState(project.responsiblePerson);
  const [responsiblePosition, setResponsiblePosition] = useState(project.responsiblePosition || '');
  const [startDate, setStartDate] = useState(project.startDate);
  const [endDate, setEndDate] = useState(project.endDate);
  const [target, setTarget] = useState(project.target);
  const [progressPercent, setProgressPercent] = useState(project.progressPercent);
  const [status, setStatus] = useState<StatusType>(project.status);
  const [workflowLevel, setWorkflowLevel] = useState<WorkflowLevel>(project.workflowLevel);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Project = {
      ...project,
      name: name.trim(),
      code: code.trim(),
      categoryId,
      department: department.trim(),
      responsiblePerson: responsiblePerson.trim(),
      responsiblePosition: responsiblePosition.trim(),
      startDate,
      endDate,
      target: target.trim(),
      progressPercent: Number(progressPercent),
      status,
      workflowLevel,
      lastUpdated: 'วันนี้'
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {isAdmin ? '👑 สิทธิ์ Admin จัดการโครงการ' : 'แก้ไขข้อมูลโครงการ'}
                </span>
                <span className="text-xs text-slate-400">{project.code}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                แก้ไขข้อมูลโครงการ Green & Clean
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ชื่อโครงการ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                รหัสโครงการ
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                หมวดมาตรฐาน Green & Clean <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                กลุ่มงาน / ฝ่ายรับผิดชอบ
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ผู้รับผิดชอบหลัก
              </label>
              <input
                type="text"
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                required
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ตำแหน่ง
              </label>
              <input
                type="text"
                value={responsiblePosition}
                onChange={(e) => setResponsiblePosition(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              เป้าหมาย / ตัวชี้วัดความสำเร็จ (Target KPI)
            </label>
            <textarea
              rows={2}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                สถานะการดำเนินงาน
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusType)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              >
                <option value="not_started">⚪ ยังไม่เริ่มดำเนินการ</option>
                <option value="in_progress">🟡 อยู่ระหว่างดำเนินการ</option>
                <option value="pending_verify">🟠 รอตรวจสอบ/รับรอง (ระดับ 2)</option>
                <option value="pending_exec">🔵 รอผู้บริหารพิจารณา (ระดับ 3-4)</option>
                <option value="completed">🟢 ดำเนินการแล้ว / ผ่าน (ระดับ 5)</option>
                <option value="delayed">🔴 ล่าช้ากว่ากำหนด / ต้องแก้ไข</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ความก้าวหน้า (%): {progressPercent}%
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={progressPercent}
                onChange={(e) => setProgressPercent(Number(e.target.value))}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ระดับ Workflow (1-5) {isAdmin && '👑 Admin กำหนดได้อิสระ'}
              </label>
              <select
                value={workflowLevel}
                onChange={(e) => setWorkflowLevel(Number(e.target.value) as WorkflowLevel)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800 font-semibold"
              >
                <option value={1}>ระดับ 1: ผู้รับผิดชอบ</option>
                <option value={2}>ระดับ 2: ผู้รับรอง/หัวหน้างาน</option>
                <option value={3}>ระดับ 3: ผู้บริหารขั้นต้น</option>
                <option value={4}>ระดับ 4: ผู้บริหารขั้นสูง</option>
                <option value={5}>ระดับ 5: รับรองสมบูรณ์/ปิดงาน</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                วันเริ่มต้น
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="เช่น 1 ต.ค. 2569"
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                วันสิ้นสุด
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="เช่น 30 ก.ย. 2570"
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
          </div>

          {/* Delete Section for Admin */}
          {isAdmin && onDelete && (
            <div className="pt-4 border-t border-slate-200 mt-4">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-rose-50 border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบโครงการนี้ออกจากระบบ (สิทธิ์ Admin)</span>
                </button>
              ) : (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>ยืนยันการลบโครงการ &quot;{project.name}&quot; หรือไม่?</span>
                  </div>
                  <p className="text-[11px] text-rose-700">
                    การลบโครงการจะลบข้อมูลออกจากระบบคลาวด์และไม่สามารถกู้คืนได้
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(project.id);
                        onClose();
                      }}
                      className="text-xs py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors shadow-xs"
                    >
                      ยืนยันลบโครงการถาวร
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-xs py-1.5 px-3 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการแก้ไข</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
