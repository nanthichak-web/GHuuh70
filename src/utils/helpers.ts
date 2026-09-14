import { StatusType, WorkflowLevel, UserRole, AccessLevel } from '../types';

export function getStatusConfig(status: StatusType) {
  switch (status) {
    case 'completed':
      return {
        label: 'ดำเนินการแล้ว/ผ่าน',
        shortLabel: 'สำเร็จ',
        color: 'emerald',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotClass: 'bg-emerald-500',
        iconEmoji: '🟢',
        textColor: 'text-emerald-700',
        bgProgress: 'bg-emerald-500'
      };
    case 'in_progress':
      return {
        label: 'อยู่ระหว่างดำเนินการ',
        shortLabel: 'ดำเนินการ',
        color: 'amber',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        dotClass: 'bg-amber-500',
        iconEmoji: '🟡',
        textColor: 'text-amber-700',
        bgProgress: 'bg-amber-500'
      };
    case 'pending_verify':
      return {
        label: 'รอตรวจสอบ/รับรอง',
        shortLabel: 'รอรับรอง',
        color: 'orange',
        badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
        dotClass: 'bg-orange-500',
        iconEmoji: '🟠',
        textColor: 'text-orange-700',
        bgProgress: 'bg-orange-500'
      };
    case 'pending_exec':
      return {
        label: 'รอผู้บริหารพิจารณา',
        shortLabel: 'รอผู้บริหาร',
        color: 'blue',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        dotClass: 'bg-blue-500',
        iconEmoji: '🔵',
        textColor: 'text-blue-700',
        bgProgress: 'bg-blue-500'
      };
    case 'delayed':
      return {
        label: 'ล่าช้ากว่ากำหนด/ต้องแก้ไข',
        shortLabel: 'ล่าช้า',
        color: 'rose',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        dotClass: 'bg-rose-500',
        iconEmoji: '🔴',
        textColor: 'text-rose-700',
        bgProgress: 'bg-rose-500'
      };
    case 'not_started':
    default:
      return {
        label: 'ยังไม่เริ่มดำเนินการ',
        shortLabel: 'ยังไม่เริ่ม',
        color: 'slate',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
        dotClass: 'bg-slate-400',
        iconEmoji: '⚪',
        textColor: 'text-slate-600',
        bgProgress: 'bg-slate-400'
      };
  }
}

export function getWorkflowLevelInfo(level: WorkflowLevel) {
  switch (level) {
    case 1:
      return {
        level: 1,
        title: 'ระดับ 1: ผู้รับผิดชอบ',
        shortTitle: 'ผู้รับผิดชอบ',
        roleKey: 'officer',
        description: 'จัดทำแผน ดำเนินงาน บันทึกความก้าวหน้า แนบหลักฐาน และส่งงาน',
        iconEmoji: '👤',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200'
      };
    case 2:
      return {
        level: 2,
        title: 'ระดับ 2: ผู้รับรอง / หัวหน้างาน',
        shortTitle: 'ผู้รับรอง',
        roleKey: 'supervisor',
        description: 'ตรวจสอบความถูกต้อง ความครบถ้วนของหลักฐาน และให้การรับรอง',
        iconEmoji: '👨‍💼',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
      };
    case 3:
      return {
        level: 3,
        title: 'ระดับ 3: ผู้บริหารขั้นต้น',
        shortTitle: 'ผู้บริหารขั้นต้น',
        roleKey: 'middle_exec',
        description: 'หัวหน้ากลุ่มงาน/ฝ่าย ตรวจสอบงานที่รับรองแล้ว อนุมัติ/ให้ความเห็น',
        iconEmoji: '👔',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
      };
    case 4:
      return {
        level: 4,
        title: 'ระดับ 4: ผู้บริหารขั้นสูง',
        shortTitle: 'ผู้บริหารขั้นสูง',
        roleKey: 'senior_exec',
        description: 'ผู้อำนวยการ/รองผู้อำนวยการ รับทราบ ติดตามงานล่าช้า และรับรองระดับ รพ.',
        iconEmoji: '🏥',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
      };
    case 5:
      return {
        level: 5,
        title: 'ระดับ 5: รับรองสมบูรณ์ / ปิดงาน',
        shortTitle: 'รับรองสมบูรณ์',
        roleKey: 'completed',
        description: 'โครงการผ่านการตรวจรับรองครบทุกขั้นตอนและปิดงานสำเร็จ',
        iconEmoji: '✅',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
  }
}

export function getUserRoleLabel(role: UserRole): string {
  switch (role) {
    case 'officer':
      return '👤 ผู้รับผิดชอบงาน';
    case 'supervisor':
      return '👨‍💼 ผู้รับรอง / หัวหน้างาน';
    case 'middle_exec':
      return '👔 ผู้บริหารขั้นต้น (หน.กลุ่มงาน/ฝ่าย)';
    case 'senior_exec':
      return '🏥 ผู้บริหารขั้นสูง (ผอ./รอง ผอ.)';
    case 'evaluator':
      return '📋 ผู้ประเมินภายนอก (กรรมการ GCH)';
    case 'admin':
      return '👑 ผู้ดูแลระบบสูงสุด (Super Admin)';
  }
}

export function getAccessLevelConfig(level: AccessLevel) {
  switch (level) {
    case '1':
      return {
        level: '1' as AccessLevel,
        title: 'ระดับ 1: ผู้รับผิดชอบงาน',
        shortTitle: 'ระดับ 1 (ผู้รับผิดชอบ)',
        role: 'officer' as UserRole,
        iconEmoji: '👤',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200'
      };
    case '2':
      return {
        level: '2' as AccessLevel,
        title: 'ระดับ 2: ผู้รับรอง / หัวหน้างาน',
        shortTitle: 'ระดับ 2 (ผู้รับรอง)',
        role: 'supervisor' as UserRole,
        iconEmoji: '👨‍💼',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
      };
    case '3':
      return {
        level: '3' as AccessLevel,
        title: 'ระดับ 3: ผู้บริหารขั้นต้น',
        shortTitle: 'ระดับ 3 (ผู้บริหารขั้นต้น)',
        role: 'middle_exec' as UserRole,
        iconEmoji: '👔',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
      };
    case '4':
      return {
        level: '4' as AccessLevel,
        title: 'ระดับ 4: ผู้บริหารขั้นสูง (ผอ./รอง ผอ.)',
        shortTitle: 'ระดับ 4 (ผู้บริหารขั้นสูง)',
        role: 'senior_exec' as UserRole,
        iconEmoji: '🏥',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
      };
    case '5':
      return {
        level: '5' as AccessLevel,
        title: 'ระดับ 5: รับรองสมบูรณ์ / ปิดงาน / กรรมการ GCH',
        shortTitle: 'ระดับ 5 (รับรองสมบูรณ์)',
        role: 'evaluator' as UserRole,
        iconEmoji: '✅',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
    case 'admin':
      return {
        level: 'admin' as AccessLevel,
        title: '👑 ผู้ดูแลระบบสูงสุด (Super Admin)',
        shortTitle: 'Admin (ผู้ดูแลระบบ)',
        role: 'admin' as UserRole,
        iconEmoji: '👑',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
      };
  }
}

export function exportToExcel(filename: string, rows: Record<string, unknown>[]) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  
  // Create CSV with UTF-8 BOM so Excel on Windows/Mac renders Thai characters cleanly
  let csvContent = '\uFEFF';
  csvContent += headers.map(h => `"${h}"`).join(',') + '\r\n';

  rows.forEach(row => {
    const line = headers.map(h => {
      let val = row[h];
      if (val === null || val === undefined) val = '';
      const strVal = String(val).replace(/"/g, '""');
      return `"${strVal}"`;
    }).join(',');
    csvContent += line + '\r\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
