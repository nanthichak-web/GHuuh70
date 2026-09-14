import React, { useState } from 'react';
import { X, Plus, Calendar, Trash2 } from 'lucide-react';
import { Meeting, MeetingResolution } from '../types';

interface NewMeetingModalProps {
  onClose: () => void;
  onSave: (meeting: Meeting) => void;
}

export const NewMeetingModal: React.FC<NewMeetingModalProps> = ({
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('15 มี.ค. 2570');
  const [time, setTime] = useState('13:30 - 16:30 น.');
  const [location, setLocation] = useState('ห้องประชุมชัยพฤกษ์ ชั้น 4');
  const [chairperson, setChairperson] = useState('นพ.วิบูลย์ วัฒนกุล (ผู้อำนวยการโรงพยาบาล)');
  const [attendeesCount, setAttendeesCount] = useState(25);
  const [attendeesSummary, setAttendeesSummary] = useState('คณะกรรมการ Green & Clean Hospital และหัวหน้ากลุ่มงาน');
  const [minutesSummary, setMinutesSummary] = useState('');

  // Resolutions list
  const [resolutions, setResolutions] = useState<{
    topic: string;
    responsiblePerson: string;
    department: string;
    deadline: string;
  }[]>([
    {
      topic: 'ให้ดำเนินการปรับปรุงพื้นที่คัดแยกขยะมูลฝอย ณ อาคารผู้ป่วยใน 4',
      responsiblePerson: 'งานบริหารสิ่งแวดล้อม',
      department: 'กลุ่มงานบริหารทั่วไป',
      deadline: '30 เม.ย. 2570'
    }
  ]);

  const addResolutionRow = () => {
    setResolutions([
      ...resolutions,
      {
        topic: '',
        responsiblePerson: '',
        department: '',
        deadline: '30 มิ.ย. 2570'
      }
    ]);
  };

  const removeResolutionRow = (index: number) => {
    setResolutions(resolutions.filter((_, i) => i !== index));
  };

  const updateResolution = (index: number, field: string, val: string) => {
    const updated = [...resolutions];
    (updated[index] as any)[field] = val;
    setResolutions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedResolutions: MeetingResolution[] = resolutions
      .filter(r => r.topic.trim())
      .map((r, idx) => ({
        id: `res-${Date.now()}-${idx}`,
        topic: r.topic.trim(),
        responsiblePerson: r.responsiblePerson.trim() || 'ผู้รับผิดชอบตามมติ',
        department: r.department.trim() || 'หน่วยงานที่เกี่ยวข้อง',
        deadline: r.deadline || '30 ก.ย. 2570',
        status: 'not_started',
        progress: 0
      }));

    const newMeeting: Meeting = {
      id: `meet-${Date.now()}`,
      code: `MT-GCH-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      date,
      time,
      location,
      chairperson,
      attendeesCount: Number(attendeesCount),
      attendeesSummary,
      agenda: ['1. เรื่องแจ้งเพื่อทราบ', '2. ติดตามความก้าวหน้าโครงการ Green & Clean Hospital', '3. พิจารณาข้อเสนอแนะและมาตรการเพิ่มเติม'],
      minutesSummary: minutesSummary.trim() || 'ที่ประชุมมีมติเห็นชอบตามรายงานความก้าวหน้าและมอบหมายผู้รับผิดชอบดำเนินการตามมติที่ประชุม',
      resolutions: formattedResolutions,
      attachments: [
        {
          name: `รายงานการประชุม_${title.slice(0, 20)}.pdf`,
          type: 'pdf',
          size: '2.4 MB',
          url: '#'
        }
      ],
      photosCount: 2
    };

    onSave(newMeeting);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              📅 บันทึกการประชุม Green & Clean Hospital
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              บันทึกวาระ, มติที่ประชุม, และผู้รับผิดชอบเพื่อติดตามผลการดำเนินงาน
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
              ชื่อการประชุม *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น การประชุมคณะกรรมการพัฒนาโรงพยาบาล Green & Clean Hospital ครั้งที่ 2/2570"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">วันที่ประชุม</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">เวลา</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">สถานที่ประชุม</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ประธานการประชุม</label>
              <input
                type="text"
                value={chairperson}
                onChange={(e) => setChairperson(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">สรุปสาระสำคัญของมติการประชุม</label>
            <textarea
              rows={2}
              value={minutesSummary}
              onChange={(e) => setMinutesSummary(e.target.value)}
              placeholder="ที่ประชุมมีมติเห็นชอบในเรื่องใดบ้าง..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {/* Resolutions Builder */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                มติที่ประชุมที่ต้องติดตาม (Resolutions)
              </span>
              <button
                type="button"
                onClick={addResolutionRow}
                className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มมติ</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {resolutions.map((res, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-600">มติที่ {idx + 1}</span>
                    {resolutions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResolutionRow(idx)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={res.topic}
                    onChange={(e) => updateResolution(idx, 'topic', e.target.value)}
                    placeholder="ระบุมติที่ประชุม เช่น ให้จัดซื้อถังขยะแยกประเภทเพิ่มเติม..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={res.responsiblePerson}
                      onChange={(e) => updateResolution(idx, 'responsiblePerson', e.target.value)}
                      placeholder="ผู้รับผิดชอบ"
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      value={res.department}
                      onChange={(e) => updateResolution(idx, 'department', e.target.value)}
                      placeholder="หน่วยงาน"
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      value={res.deadline}
                      onChange={(e) => updateResolution(idx, 'deadline', e.target.value)}
                      placeholder="กำหนดแล้วเสร็จ"
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
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
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              บันทึกการประชุม
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
