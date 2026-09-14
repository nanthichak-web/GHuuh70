import React, { useState } from 'react';
import { X, Plus, Calendar, Layers, Building, User, Target, CheckCircle2 } from 'lucide-react';
import { Project, Category, StatusType, WorkflowLevel } from '../types';

interface NewProjectModalProps {
  categories: Category[];
  preselectedCategoryId?: string;
  onClose: () => void;
  onSave: (newProject: Project) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  categories,
  preselectedCategoryId,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(preselectedCategoryId || categories[0]?.id || 'energy');
  const [department, setDepartment] = useState('กลุ่มงานบริหารทั่วไปและซ่อมบำรุง');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [responsiblePosition, setResponsiblePosition] = useState('นักวิชาการสาธารณสุข');
  const [startDate, setStartDate] = useState('1 ต.ค. 2569');
  const [endDate, setEndDate] = useState('30 ก.ย. 2570');
  const [target, setTarget] = useState('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [status, setStatus] = useState<StatusType>('in_progress');
  const [fiscalYear, setFiscalYear] = useState<number>(2570);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !responsiblePerson.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      code: `GCH-${fiscalYear.toString().slice(-2)}-${categoryId.slice(0, 2).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`,
      name: name.trim(),
      categoryId,
      department: department.trim(),
      responsiblePerson: responsiblePerson.trim(),
      responsiblePosition: responsiblePosition.trim(),
      startDate,
      endDate,
      target: target.trim() || 'บรรลุเกณฑ์ตามมาตรฐาน Green & Clean Hospital',
      progressPercent: Number(progressPercent),
      status,
      workflowLevel: 1, // Start at Level 1 (ผู้รับผิดชอบ)
      fiscalYear,
      evidenceList: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          date: 'วันนี้',
          title: 'สร้างโครงการในระบบ GREEN CARE TRACK',
          description: `สร้างโครงการโดย ${responsiblePerson} กำหนดแล้วเสร็จ ${endDate}`,
          statusBadge: status,
          authorName: responsiblePerson,
          authorRole: 'ผู้รับผิดชอบงาน'
        }
      ],
      comments: [],
      lastUpdated: 'วันนี้'
    };

    onSave(newProject);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              ➕ บันทึกงาน / โครงการ Green & Clean Hospital ใหม่
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              กรอกข้อมูลเพื่อเริ่มต้นติดตามความก้าวหน้าและแนบหลักฐาน
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ชื่อโครงการ / กิจกรรม *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น โครงการลดการใช้พลังงานไฟฟ้าในอาคารผู้ป่วย, การปรับปรุงระบบคัดแยกขยะ"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                หมวดมาตรฐาน GCH (9 ด้าน) *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ปีงบประมาณ *
              </label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
              >
                <option value={2569}>ปีงบประมาณ 2569</option>
                <option value={2570}>ปีงบประมาณ 2570</option>
                <option value={2571}>ปีงบประมาณ 2571</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                หน่วยงานที่รับผิดชอบ *
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="เช่น งานบริหารสิ่งแวดล้อม, กลุ่มงานการพยาบาล"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ผู้รับผิดชอบ *
              </label>
              <input
                type="text"
                required
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                placeholder="นาย/นาง/นางสาว..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                วันที่เริ่มดำเนินการ
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="เช่น 1 ตุลาคม 2569"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                กำหนดแล้วเสร็จ *
              </label>
              <input
                type="text"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="เช่น 30 กันยายน 2570"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              เป้าหมาย / ตัวชี้วัดความสำเร็จ (Target KPI) *
            </label>
            <input
              type="text"
              required
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="เช่น ลดการใช้พลังงานไฟฟ้าไม่น้อยกว่า 5%, คัดแยกขยะถูกต้อง 100%"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">
                  ความคืบหน้าเริ่มต้น (%)
                </label>
                <span className="font-bold text-emerald-700">{progressPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercent}
                onChange={(e) => setProgressPercent(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                สถานะการดำเนินงาน
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusType)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <option value="in_progress">🟡 อยู่ระหว่างดำเนินการ</option>
                <option value="pending_verify">🟠 รอตรวจสอบ/รับรอง</option>
                <option value="pending_exec">🔵 รอผู้บริหารพิจารณา</option>
                <option value="completed">🟢 ดำเนินการแล้ว/ผ่าน</option>
                <option value="delayed">🔴 ล่าช้ากว่ากำหนด</option>
                <option value="not_started">⚪ ยังไม่เริ่มดำเนินการ</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              บันทึกโครงการ
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
