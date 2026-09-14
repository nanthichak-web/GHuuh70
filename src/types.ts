export type StatusType =
  | 'completed'       // 🟢 ดำเนินการแล้ว / ผ่าน
  | 'in_progress'     // 🟡 อยู่ระหว่างดำเนินการ
  | 'pending_verify'  // 🟠 รอตรวจสอบ/รับรอง (ผู้รับรอง)
  | 'pending_exec'    // 🔵 รอผู้บริหารพิจารณา (ผู้บริหาร)
  | 'delayed'         // 🔴 ล่าช้ากว่ากำหนด / ต้องแก้ไข
  | 'not_started';    // ⚪ ยังไม่เริ่มดำเนินการ

export type WorkflowLevel = 1 | 2 | 3 | 4 | 5;
// Level 1: 👤 ผู้รับผิดชอบ (Responsible Staff)
// Level 2: 👨‍💼 ผู้รับรอง/หัวหน้างาน (Supervisor/Verifier)
// Level 3: 👔 ผู้บริหารขั้นต้น (Middle Management - หัวหน้าฝ่าย/กลุ่มงาน)
// Level 4: 🏥 ผู้บริหารขั้นสูง (Executive - รอง ผอ./ผอ. รพ.)
// Level 5: ✅ รับรองเสร็จสมบูรณ์/ปิดงาน (Completed & Certified)

export type UserRole =
  | 'officer'        // ผู้รับผิดชอบ (ระดับ 1)
  | 'supervisor'     // ผู้รับรอง / หัวหน้างาน (ระดับ 2)
  | 'middle_exec'    // ผู้บริหารขั้นต้น (ระดับ 3)
  | 'senior_exec'    // ผู้บริหารขั้นสูง (ระดับ 4)
  | 'evaluator'      // ผู้ประเมินภายนอก / กรรมการ GCH (ระดับ 5)
  | 'admin';         // ผู้ดูแลระบบสูงสุด (Admin)

export type AccessLevel = '1' | '2' | '3' | '4' | '5' | 'admin';

export const LEVEL_PASSWORDS: Record<AccessLevel, string> = {
  '1': '01',
  '2': '012',
  '3': '0123',
  '4': '01234',
  '5': '012345',
  'admin': '353909'
};

export interface AuthorizedUser {
  id: string;
  name: string;
  position: string;
  department: string;
  allowedLevels: AccessLevel[];
  createdAt: string;
  status: 'active' | 'suspended';
  note?: string;
}

export interface AccessLogEntry {
  id: string;
  userName: string;
  level: AccessLevel;
  levelLabel: string;
  loginTime: string;
  timestampMs: number;
  deviceInfo?: string;
  status: 'success' | 'failed';
}

export interface UserSession {
  userName: string;
  level: AccessLevel;
  levelLabel: string;
  loginTime: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  color: string;
  standardKpis: string[];
}

export type EvidenceType = 'photo' | 'document' | 'data' | 'video';
export type EvidencePhase = 'before' | 'during' | 'after' | 'general';

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  fileName: string;
  fileSize?: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  phase?: EvidencePhase;
}

export interface TimelineEntry {
  id: string;
  date: string; // e.g., '01/07/2569'
  time?: string;
  title: string;
  description: string;
  statusBadge: StatusType;
  authorName: string;
  authorRole: string;
  evidenceIds?: string[];
  notes?: string;
}

export interface ProjectComment {
  id: string;
  authorName: string;
  authorRole: string;
  avatar?: string;
  content: string;
  createdAt: string;
  level: WorkflowLevel;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  department: string;
  responsiblePerson: string;
  responsiblePosition: string;
  startDate: string; // Format: 'YYYY-MM-DD' or '1 ต.ค. 2569'
  endDate: string;   // Format: 'YYYY-MM-DD' or '30 ก.ย. 2570'
  target: string;
  progressPercent: number; // 0 - 100
  status: StatusType;
  workflowLevel: WorkflowLevel;
  fiscalYear: number; // e.g., 2569 or 2570
  evidenceList: EvidenceItem[];
  timeline: TimelineEntry[];
  comments: ProjectComment[];
  meetingOriginId?: string; // If spawned from a meeting resolution
  meetingResolutionTopic?: string;
  lastUpdated: string;
}

export interface MeetingEndorsement {
  id: string;
  memberName: string;
  memberRole: string; // เช่น 'กรรมการ/หัวหน้ากลุ่มงานบริหาร', 'กรรมการ/ผู้แทนฝ่ายการพยาบาล'
  decision: 'endorsed' | 'rejected'; // 'รับรองมติการประชุม' | 'ไม่รับรองมติที่ประชุม'
  reason?: string; // ข้อสังเกต / เหตุผลประกอบ
  timestamp: string; // วันเวลาที่ลงนาม เช่น '14 ก.ย. 2569 เวลา 14:30 น.'
}

export interface MeetingResolution {
  id: string;
  topic: string;
  responsiblePerson: string;
  department: string;
  deadline: string;
  status: StatusType;
  progress: number;
  linkedProjectId?: string; // ID of the project created from this resolution
}

export interface Meeting {
  id: string;
  code: string;
  title: string;
  date: string; // '15 ก.ค. 2569'
  time: string;
  location: string;
  chairperson: string;
  attendeesCount: number;
  attendeesSummary: string;
  agenda: string[];
  minutesSummary: string;
  resolutions: MeetingResolution[];
  endorsements?: MeetingEndorsement[]; // การลงนามรับรองมติของกรรมการ
  attachments: {
    name: string;
    type: 'pdf' | 'doc' | 'image';
    size: string;
    url: string;
  }[];
  photosCount: number;
}

export interface NotificationItem {
  id: string;
  type: 'overdue' | 'due_soon' | 'pending_approval' | 'needs_revision' | 'approved';
  title: string;
  message: string;
  projectId?: string;
  date: string;
  targetRole: UserRole | 'all';
  isRead: boolean;
  severity: 'high' | 'medium' | 'info';
}
