import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Leaf } from 'lucide-react';
import { Project, Category, Meeting } from '../types';
import { getStatusConfig } from '../utils/helpers';

interface ReportPrintModalProps {
  projects: Project[];
  categories: Category[];
  meetings: Meeting[];
  onClose: () => void;
}

export const ReportPrintModal: React.FC<ReportPrintModalProps> = ({
  projects,
  categories,
  meetings,
  onClose
}) => {
  const totalProjects = projects.length || 1;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const inProgressCount = projects.filter(p => p.status === 'in_progress').length;
  const pendingVerifyCount = projects.filter(p => p.status === 'pending_verify').length;
  const pendingExecCount = projects.filter(p => p.status === 'pending_exec').length;
  const delayedCount = projects.filter(p => p.status === 'delayed').length;
  const notStartedCount = projects.filter(p => p.status === 'not_started').length;
  const totalProgress = Math.round(projects.reduce((acc, p) => acc + p.progressPercent, 0) / totalProjects);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800 text-sm">
              ตัวอย่างรายงานสรุปผลการดำเนินงาน Green & Clean Hospital (Executive Report)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ / บันทึกเป็น PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-6 text-slate-900 bg-white font-sans">
          
          {/* Document Header */}
          <div className="text-center border-b-2 border-slate-800 pb-6 space-y-1">
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-base mb-1">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <span>GREEN CARE TRACK • GREEN & CLEAN HOSPITAL</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              รายงานสรุปผลการดำเนินงานและติดตามเกณฑ์มาตรฐาน Green & Clean Hospital
            </h1>
            <p className="text-xs text-slate-600">
              ตามเกณฑ์มาตรฐานการพัฒนาโรงพยาบาลที่เป็นมิตรกับสิ่งแวดล้อม กรมอนามัย กระทรวงสาธารณสุข
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Section 1: Executive KPI Overview */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-l-4 border-emerald-600 pl-2">
              1. สรุปภาพรวมความก้าวหน้า (Executive Overview)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-slate-500 text-[11px]">ความก้าวหน้ารวม</div>
                <div className="text-2xl font-black text-emerald-700 mt-0.5">{totalProgress}%</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-slate-500 text-[11px]">โครงการทั้งหมด</div>
                <div className="text-2xl font-black text-slate-800 mt-0.5">{projects.length} งาน</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-slate-500 text-[11px]">ดำเนินการสำเร็จแล้ว</div>
                <div className="text-2xl font-black text-emerald-600 mt-0.5">{completedCount} งาน</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-slate-500 text-[11px]">อยู่ระหว่างดำเนินการ/รอรับรอง</div>
                <div className="text-2xl font-black text-amber-600 mt-0.5">{inProgressCount + pendingVerifyCount + pendingExecCount} งาน</div>
              </div>
            </div>

            {/* Status Breakdown Bar */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>🟢 สำเร็จ: {completedCount}</span>
                <span>🟡 ดำเนินการ: {inProgressCount}</span>
                <span>🟠 รอตรวจสอบ: {pendingVerifyCount}</span>
                <span>🔵 รอผู้บริหาร: {pendingExecCount}</span>
                <span>🔴 ล่าช้า: {delayedCount}</span>
                <span>⚪ ยังไม่เริ่ม: {notStartedCount}</span>
              </div>
            </div>
          </div>

          {/* Section 2: 9 Categories Performance */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-l-4 border-emerald-600 pl-2">
              2. ผลการดำเนินงานแยกตาม 9 หมวดมาตรฐาน Green & Clean Hospital
            </h2>

            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-2">หมวดมาตรฐาน</th>
                  <th className="p-2 text-center">จำนวนงาน</th>
                  <th className="p-2">ความก้าวหน้า (%)</th>
                  <th className="p-2 text-center">หลักฐานประกอบ</th>
                  <th className="p-2 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {categories.map((cat) => {
                  const catProjects = projects.filter(p => p.categoryId === cat.id);
                  const count = catProjects.length;
                  const avg = count > 0 ? Math.round(catProjects.reduce((acc, p) => acc + p.progressPercent, 0) / count) : 0;
                  const totalEv = catProjects.reduce((acc, p) => acc + p.evidenceList.length, 0);

                  return (
                    <tr key={cat.id}>
                      <td className="p-2 font-semibold text-slate-900">{cat.name}</td>
                      <td className="p-2 text-center">{count}</td>
                      <td className="p-2 font-bold">{avg}%</td>
                      <td className="p-2 text-center">{totalEv} รายการ</td>
                      <td className="p-2 text-center">
                        {avg >= 80 ? '🟢 ผ่านเกณฑ์' : avg >= 50 ? '🟡 กำลังดำเนินงาน' : '🔴 ต้องเร่งรัด'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section 3: Project Detail Summary List */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-l-4 border-emerald-600 pl-2">
              3. รายละเอียดโครงการและกิจกรรมที่อยู่ระหว่างติดตาม
            </h2>

            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-2">รหัส</th>
                  <th className="p-2">ชื่อโครงการ</th>
                  <th className="p-2">หน่วยงาน/ผู้รับผิดชอบ</th>
                  <th className="p-2">เป้าหมาย</th>
                  <th className="p-2 text-center">คืบหน้า</th>
                  <th className="p-2 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {projects.map((p) => {
                  const statusCfg = getStatusConfig(p.status);
                  return (
                    <tr key={p.id}>
                      <td className="p-2 font-mono text-[11px] text-slate-500">{p.code}</td>
                      <td className="p-2 font-semibold text-slate-900">{p.name}</td>
                      <td className="p-2 text-slate-600">{p.department} ({p.responsiblePerson})</td>
                      <td className="p-2 text-slate-600 max-w-xs">{p.target}</td>
                      <td className="p-2 text-center font-bold">{p.progressPercent}%</td>
                      <td className="p-2 text-center">{statusCfg.label}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signatures Section */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs text-slate-700">
            <div className="space-y-12">
              <div>ลงชื่อ........................................................</div>
              <div>
                <p className="font-bold">( นายพิชัย เกียรติสกุล )</p>
                <p className="text-slate-500">ผู้รับผิดชอบงาน GCH</p>
              </div>
            </div>

            <div className="space-y-12">
              <div>ลงชื่อ........................................................</div>
              <div>
                <p className="font-bold">( นางรัตนา ทรัพย์อุดม )</p>
                <p className="text-slate-500">หัวหน้ากลุ่มงานบริหาร</p>
              </div>
            </div>

            <div className="space-y-12">
              <div>ลงชื่อ........................................................</div>
              <div>
                <p className="font-bold">( นพ.วิบูลย์ วัฒนกุล )</p>
                <p className="text-slate-500">ผู้อำนวยการโรงพยาบาล</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
