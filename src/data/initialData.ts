import { Category, Project, Meeting, NotificationItem, AuthorizedUser } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'env',
    name: 'ด้านสิ่งแวดล้อม',
    nameEn: 'Environmental Management',
    icon: 'Leaf',
    description: 'การบริหารจัดการและพัฒนาระบบสิ่งแวดล้อมองค์รวมตามมาตรฐาน Green & Clean Hospital',
    color: 'emerald',
    standardKpis: ['มีนโยบายและแผนยุทธศาสตร์สิ่งแวดล้อม', 'ผ่านเกณฑ์ประเมิน Green Hospital ระดับดีมาก', 'ลดการปล่อยก๊าซเรือนกระจก (Carbon Footprint)']
  },
  {
    id: 'waste',
    name: 'การจัดการขยะ',
    nameEn: 'Waste Management',
    icon: 'Recycle',
    description: 'การคัดแยกขยะทั่วไป รีไซเคิล ขยะอันตราย และขยะมูลฝอยติดเชื้อตามมาตรฐานวิชาการ',
    color: 'teal',
    standardKpis: ['อัตราการคัดแยกขยะรีไซเคิล > 30%', 'ขยะติดเชื้อได้รับการเผาทำลายถูกต้อง 100%', 'ลดปริมาณขยะส่งฝังกลบ (Zero Waste to Landfill)']
  },
  {
    id: 'water',
    name: 'การจัดการน้ำ',
    nameEn: 'Water Management',
    icon: 'Droplets',
    description: 'การอนุรักษ์น้ำ การควบคุมคุณภาพน้ำบริโภค และระบบบำบัดน้ำเสียที่ได้มาตรฐานน้ำทิ้ง',
    color: 'sky',
    standardKpis: ['น้ำทิ้งผ่านเกณฑ์มาตรฐานกรมควบคุมมลพิษ 100%', 'นำน้ำทิ้งที่บำบัดแล้วกลับมารดน้ำต้นไม้ > 40%', 'ลดการใช้น้ำประปาเฉลี่ยต่อเตียง 5%']
  },
  {
    id: 'energy',
    name: 'การจัดการพลังงาน',
    nameEn: 'Energy Management',
    icon: 'Zap',
    description: 'การประหยัดพลังงานไฟฟ้า การใช้พลังงานทดแทน Solar Rooftop และระบบปรับอากาศประหยัดพลังงาน',
    color: 'amber',
    standardKpis: ['ลดการใช้พลังงานไฟฟ้าไม่น้อยกว่า 5% ต่อปี', 'สัดส่วนพลังงานแสงอาทิตย์ (Solar Rooftop) > 15%', 'ระบบปรับอากาศมีค่า SEER สูงและบำรุงรักษาตามรอบ']
  },
  {
    id: 'green',
    name: 'พื้นที่สีเขียว',
    nameEn: 'Green Area',
    icon: 'Trees',
    description: 'การเพิ่มพื้นที่สีเขียว สวนบำบัดผู้ป่วย (Healing Garden) สวนสมุนไพร และร่มเงาต้นไม้',
    color: 'green',
    standardKpis: ['สัดส่วนพื้นที่สีเขียวต่อพื้นที่โรงพยาบาล > 25%', 'มีสวนบำบัดเพื่อการฟื้นฟูสุขภาพผู้ป่วย', 'โครงการปลูกต้นไม้สะสมคาร์บอนเครดิต']
  },
  {
    id: 'hospital_env',
    name: 'การจัดการสิ่งแวดล้อมในโรงพยาบาล',
    nameEn: 'Hospital Environmental Health',
    icon: 'Building2',
    description: 'คุณภาพอากาศภายในอาคาร (IAQ) การควบคุมเสียง แสงสว่าง และการจัดการสารเคมีอันตราย',
    color: 'indigo',
    standardKpis: ['การระบายอากาศในห้องแยกโรค (Negative Pressure) ได้มาตรฐาน', 'ระบบจัดการสารเคมีรั่วไหลพร้อมใช้งาน 100%', 'ตรวจวัดแสงสว่างและเสียงตามเกณฑ์ทุกจุดบริการ']
  },
  {
    id: 'sanitation',
    name: 'การจัดการสุขาภิบาล',
    nameEn: 'Sanitation',
    icon: 'Sparkles',
    description: 'สุขาภิบาลโรงอาหาร โรงครัว มาตรฐาน SAN / Clean Food Good Taste และห้องน้ำสะอาด (HAS)',
    color: 'cyan',
    standardKpis: ['โรงครัวและโรงอาหารผ่านเกณฑ์มาตรฐาน SAN Plus 100%', 'ห้องน้ำโรงพยาบาลผ่านเกณฑ์มาตรฐาน HAS', 'การควบคุมสัตว์และแมลงนำโรคอย่างสม่ำเสมอ']
  },
  {
    id: 'participation',
    name: 'การมีส่วนร่วมของบุคลากร',
    nameEn: 'Staff Participation',
    icon: 'Users',
    description: 'การสร้างวัฒนธรรมสีเขียว กิจกรรม 5ส อบรมบุคลากร และทีม Green Health Volunteers',
    color: 'violet',
    standardKpis: ['บุคลากรผ่านการอบรม Green & Clean Hospital > 90%', 'มีกิจกรรม Green Day รณรงค์ทุกเดือน', 'การประกวดนวัตกรรมสีเขียวระดับหน่วยงาน']
  },
  {
    id: 'monitoring',
    name: 'การติดตามและประเมินผล',
    nameEn: 'Monitoring & Evaluation',
    icon: 'BarChart3',
    description: 'การตรวจประเมินภายใน (Internal Audit) รายงานผลต่อคณะกรรมการ และการตรวจรับรองภายนอก',
    color: 'rose',
    standardKpis: ['รายงานความก้าวหน้ารายไตรมาสต่อคณะกรรมการบริหาร', 'คะแนนประเมินตนเองผ่านเกณฑ์ระดับพัฒนาสู่ความยั่งยืน', 'Evidence Matrix ครบถ้วนพร้อมรับการตรวจประเมิน']
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    code: 'GCH-69-EN01',
    name: 'โครงการลดการใช้พลังงานไฟฟ้าในอาคารผู้ป่วยและติดตั้ง Solar Rooftop',
    categoryId: 'energy',
    department: 'กลุ่มงานบริหารทั่วไปและซ่อมบำรุง',
    responsiblePerson: 'นายพิชัย เกียรติสกุล',
    responsiblePosition: 'วิศวกรไฟฟ้าปฏิบัติการ',
    startDate: '1 ต.ค. 2569',
    endDate: '30 ก.ย. 2570',
    target: 'ลดการใช้พลังงานไฟฟ้าไม่น้อยกว่า 5% และผลิตไฟจากพลังงานแสงอาทิตย์ได้ 150 kW',
    progressPercent: 75,
    status: 'in_progress',
    workflowLevel: 2, // รอผู้รับรองตรวจสอบ
    fiscalYear: 2570,
    evidenceList: [
      {
        id: 'ev-01',
        type: 'photo',
        title: 'ภาพก่อนดำเนินการติดตั้งแผงโซลาร์เซลล์',
        description: 'สภาพดาดฟ้าอาคารเฉลิมพระเกียรติ 80 พรรษาก่อนการปรับปรุงโครงสร้าง',
        fileName: 'roof_before_solar.jpg',
        fileSize: '3.4 MB',
        fileUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: '5 ต.ค. 2569',
        uploadedBy: 'นายพิชัย เกียรติสกุล',
        phase: 'before'
      },
      {
        id: 'ev-02',
        type: 'photo',
        title: 'ภาพระหว่างการติดตั้งแผง Solar Rooftop และระบบ Inverter',
        description: 'การติดตั้งโครงเหล็กชุบกัลวาไนซ์และติดตั้งแผงโมโนคริสตัลไลน์ 320 แผง',
        fileName: 'solar_installation_during.jpg',
        fileSize: '4.1 MB',
        fileUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: '18 พ.ย. 2569',
        uploadedBy: 'นายพิชัย เกียรติสกุล',
        phase: 'during'
      },
      {
        id: 'ev-03',
        type: 'data',
        title: 'ตารางสถิติเปรียบเทียบค่าไฟฟ้าและหน่วยพลังงาน (kWh) ไตรมาส 1-2',
        description: 'รายงานบันทึกมิเตอร์ไฟฟ้ารายเดือน อาคารผู้ป่วยในและอาคารสนับสนุน',
        fileName: 'energy_consumption_q1_q2.xlsx',
        fileSize: '840 KB',
        fileUrl: '#',
        uploadedAt: '12 ก.พ. 2570',
        uploadedBy: 'นายพิชัย เกียรติสกุล',
        phase: 'general'
      },
      {
        id: 'ev-04',
        type: 'document',
        title: 'รายงานสรุปผลการลดใช้พลังงานครั้งที่ 2 และใบรับรองความปลอดภัย',
        description: 'รายงานทางวิศวกรรมพร้อมลายมือชื่อผู้ควบคุมงาน',
        fileName: 'energy_safety_inspection_report.pdf',
        fileSize: '2.8 MB',
        fileUrl: '#',
        uploadedAt: '1 มี.ค. 2570',
        uploadedBy: 'นายพิชัย เกียรติสกุล',
        phase: 'after'
      }
    ],
    timeline: [
      {
        id: 'tl-01',
        date: '01/10/2569',
        time: '09:00',
        title: 'เริ่มโครงการและจัดทำแผนปฏิบัติการ',
        description: 'เสนอแผนงานต่อคณะกรรมการบริหารโรงพยาบาลและอนุมัติงบประมาณ',
        statusBadge: 'in_progress',
        authorName: 'นายพิชัย เกียรติสกุล',
        authorRole: 'ผู้รับผิดชอบงาน'
      },
      {
        id: 'tl-02',
        date: '15/10/2569',
        time: '13:30',
        title: 'ประชุมทีมซ่อมบำรุงและผู้รับจ้างติดตั้ง',
        description: 'กำหนดแนวทางเซฟตี้ระหว่างการขนย้ายวัสดุขึ้นดาดฟ้า',
        statusBadge: 'in_progress',
        authorName: 'นายพิชัย เกียรติสกุล',
        authorRole: 'ผู้รับผิดชอบงาน',
        notes: 'มีการแจกจ่ายอุปกรณ์ PPE ครบถ้วน'
      },
      {
        id: 'tl-03',
        date: '18/11/2569',
        time: '16:00',
        title: 'ดำเนินการติดตั้งระบบโซลาร์เซลล์แล้วเสร็จ 60%',
        description: 'แนบรูปภาพหน้างานจำนวน 8 ภาพและผลทดสอบแรงดันวงจร',
        statusBadge: 'in_progress',
        authorName: 'นายพิชัย เกียรติสกุล',
        authorRole: 'ผู้รับผิดชอบงาน',
        evidenceIds: ['ev-02']
      },
      {
        id: 'tl-04',
        date: '05/03/2570',
        time: '11:00',
        title: 'รายงานความคืบหน้า 75% และส่งเอกสารเพื่อรับรอง',
        description: 'ส่งเอกสารหลักฐานผลการประหยัดพลังงานเข้าสู่ขั้นตอนรับรองของหัวหน้ากลุ่มงาน',
        statusBadge: 'pending_verify',
        authorName: 'นายพิชัย เกียรติสกุล',
        authorRole: 'ผู้รับผิดชอบงาน'
      }
    ],
    comments: [
      {
        id: 'c-01',
        authorName: 'นายพิชัย เกียรติสกุล',
        authorRole: 'ผู้รับผิดชอบ',
        content: 'ได้ส่งเอกสารผลการตรวจรับงานงวดที่ 2 และสถิติประหยัดค่าไฟลดลงเฉลี่ย 6.2% เรียบร้อยครับ',
        createdAt: '5 มี.ค. 2570 11:15',
        level: 1
      },
      {
        id: 'c-02',
        authorName: 'นพ.เกรียงศักดิ์ ธรรมรัตน์',
        authorRole: 'หัวหน้ากลุ่มงาน (ผู้รับรอง)',
        content: 'ตรวจสอบเอกสารเบื้องต้นแล้ว ขอให้แนบภาพตู้ควบคุม Inverter เพิ่มเติมเพื่อความครบถ้วนครับ',
        createdAt: '6 มี.ค. 2570 09:30',
        level: 2
      }
    ],
    lastUpdated: '10 มี.ค. 2570'
  },
  {
    id: 'proj-02',
    code: 'GCH-69-WS01',
    name: 'ระบบนวัตกรรมคัดแยกขยะมูลฝอยและลดขยะพลาสติกแบบครบวงจร (Zero Waste)',
    categoryId: 'waste',
    department: 'กลุ่มงานบริหารสิ่งแวดล้อมและอาชีวอนามัย',
    responsiblePerson: 'นางสาวกานดา สุวรรณฉัตร',
    responsiblePosition: 'นักวิชาการสาธารณสุขชำนาญการ',
    startDate: '1 ก.ค. 2569',
    endDate: '31 ธ.ค. 2569',
    target: 'ลดปริมาณขยะมูลฝอยทั่วไปลง 25% และคัดแยกขยะรีไซเคิลได้ถูกต้อง 100%',
    progressPercent: 100,
    status: 'completed',
    workflowLevel: 5, // รับรองเสร็จสมบูรณ์/ปิดงาน
    fiscalYear: 2569,
    evidenceList: [
      {
        id: 'ev-05',
        type: 'photo',
        title: 'ภาพกิจกรรมอบรมคัดแยกขยะ ณ อาคารผู้ป่วยใน',
        description: 'การสาธิตการทิ้งขยะ 4 ถัง: ทั่วไป รีไซเคิล อันตราย และขยะติดเชื้อ',
        fileName: 'waste_separation_training.jpg',
        fileSize: '3.8 MB',
        fileUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: '12 ก.ย. 2569',
        uploadedBy: 'นางสาวกานดา สุวรรณฉัตร',
        phase: 'during'
      },
      {
        id: 'ev-06',
        type: 'photo',
        title: 'จุดพักขยะกลางที่ปรับปรุงใหม่ได้มาตรฐานสุขาภิบาล',
        description: 'ภาพหลังดำเนินการก่อสร้างห้องพักขยะแยกสัดส่วน ป้องกันสัตว์พาหะ',
        fileName: 'waste_storage_after.jpg',
        fileSize: '4.2 MB',
        fileUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: '15 พ.ย. 2569',
        uploadedBy: 'นางสาวกานดา สุวรรณฉัตร',
        phase: 'after'
      },
      {
        id: 'ev-07',
        type: 'document',
        title: 'หนังสือราชการแต่งตั้งคณะทำงานคัดแยกขยะ และคู่มือแนวทางปฏิบัติ',
        description: 'คำสั่งโรงพยาบาลที่ 145/2569 เรื่อง มาตรการลดและคัดแยกขยะมูลฝอย',
        fileName: 'hospital_order_waste_145_2569.pdf',
        fileSize: '1.9 MB',
        fileUrl: '#',
        uploadedAt: '15 ก.ค. 2569',
        uploadedBy: 'นางสาวกานดา สุวรรณฉัตร',
        phase: 'before'
      },
      {
        id: 'ev-08',
        type: 'data',
        title: 'สถิติน้ำหนักขยะรายเดือนและรายได้จากการจำหน่ายขยะรีไซเคิล',
        description: 'ข้อมูลน้ำหนักขยะ (กิโลกรัม) ย้อนหลัง 6 เดือน บันทึกชั่งน้ำหนักจริง',
        fileName: 'monthly_waste_weight_record.xlsx',
        fileSize: '1.1 MB',
        fileUrl: '#',
        uploadedAt: '28 ธ.ค. 2569',
        uploadedBy: 'นางสาวกานดา สุวรรณฉัตร',
        phase: 'after'
      }
    ],
    timeline: [
      {
        id: 'tl-05',
        date: '01/07/2569',
        title: 'ประกาศนโยบายโรงพยาบาลปลอดโฟมและลดพลาสติก',
        description: 'เริ่มโครงการลดการใช้พลาสติกและโฟมบรรจุอาหารในโรงอาหาร',
        statusBadge: 'completed',
        authorName: 'นางสาวกานดา สุวรรณฉัตร',
        authorRole: 'ผู้รับผิดชอบงาน'
      },
      {
        id: 'tl-06',
        date: '15/07/2569',
        title: 'ประชุมทีมดำเนินงานและหัวหน้าหอผู้ป่วย',
        description: 'ชี้แจงเกณฑ์มาตรฐานและข้อปฏิบัติตามมาตรฐานกระทรวงสาธารณสุข',
        statusBadge: 'completed',
        authorName: 'นางสาวกานดา สุวรรณฉัตร',
        authorRole: 'ผู้รับผิดชอบงาน'
      },
      {
        id: 'tl-07',
        date: '12/09/2569',
        title: 'จัดกิจกรรม Kick-off และประกวดนวัตกรรมขยะ',
        description: 'อบรมเจ้าหน้าที่กว่า 180 คน และมอบถังขยะสีมาตรฐานแก่ทุกหน่วยงาน',
        statusBadge: 'completed',
        authorName: 'นางสาวกานดา สุวรรณฉัตร',
        authorRole: 'ผู้รับผิดชอบงาน',
        evidenceIds: ['ev-05']
      },
      {
        id: 'tl-08',
        date: '15/12/2569',
        title: 'หัวหน้ากลุ่มงานและผู้บริหารรับรองผลงาน 100%',
        description: 'ผ่านการประเมินปิดโครงการ ผลการคัดแยกขยะเกินเป้าหมายที่ตั้งไว้',
        statusBadge: 'completed',
        authorName: 'นพ.วิบูลย์ วัฒนกุล',
        authorRole: 'ผู้อำนวยการโรงพยาบาล'
      }
    ],
    comments: [
      {
        id: 'c-03',
        authorName: 'นพ.วิบูลย์ วัฒนกุล',
        authorRole: 'ผู้อำนวยการโรงพยาบาล',
        content: 'ผลการดำเนินงานยอดเยี่ยมมาก เป็นต้นแบบที่ดีในการเตรียมรับการตรวจ Green & Clean ระดับชาติครับ',
        createdAt: '16 ธ.ค. 2569 15:40',
        level: 4
      }
    ],
    lastUpdated: '20 ธ.ค. 2569'
  },
  {
    id: 'proj-03',
    code: 'GCH-69-WT01',
    name: 'การปรับปรุงระบบบำบัดน้ำเสียและนำน้ำทิ้งกลับมาใช้ประโยชน์ (Water Recycling)',
    categoryId: 'water',
    department: 'งานซ่อมบำรุงและสุขาภิบาลสิ่งแวดล้อม',
    responsiblePerson: 'นายสถาพร มีสุข',
    responsiblePosition: 'นายช่างเทคนิคอาวุโส',
    startDate: '1 พ.ย. 2569',
    endDate: '31 มี.ค. 2570',
    target: 'น้ำทิ้งผ่านมาตรฐาน 100% และนำน้ำรีไซเคิลมารดน้ำต้นไม้ไม่น้อยกว่า 50 ลบ.ม./วัน',
    progressPercent: 90,
    status: 'pending_exec', // รอผู้บริหารพิจารณา
    workflowLevel: 3, // ผู้บริหารขั้นต้นอนุมัติแล้ว ส่งถึงผู้บริหารขั้นสูง
    fiscalYear: 2570,
    evidenceList: [
      {
        id: 'ev-09',
        type: 'photo',
        title: 'ภาพบ่อบำบัดน้ำเสียและระบบเติมอากาศ Aeration Tank',
        description: 'ตรวจสอบการทำงานของมอเตอร์และใบพัดเติมอากาศความเร็วรอบสม่ำเสมอ',
        fileName: 'aeration_tank_inspection.jpg',
        fileSize: '3.1 MB',
        fileUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: '10 ม.ค. 2570',
        uploadedBy: 'นายสถาพร มีสุข',
        phase: 'during'
      },
      {
        id: 'ev-10',
        type: 'data',
        title: 'ผลการตรวจวิเคราะห์คุณภาพน้ำทิ้งจากห้องปฏิบัติการมาตรฐาน',
        description: 'ผลตรวจค่า BOD, COD, SS, TDS, pH และไขมัน ผ่านเกณฑ์มาตรฐานทุกพารามิเตอร์',
        fileName: 'water_lab_results_feb_2570.pdf',
        fileSize: '1.4 MB',
        fileUrl: '#',
        uploadedAt: '20 ก.พ. 2570',
        uploadedBy: 'นายสถาพร มีสุข',
        phase: 'after'
      }
    ],
    timeline: [
      {
        id: 'tl-09',
        date: '01/11/2569',
        title: 'ล้างทำความสะอาดถังดักไขมันและบ่อพักน้ำเสีย',
        description: 'ดำเนินการตามแผนการบำรุงรักษาเชิงป้องกันประจำปี',
        statusBadge: 'completed',
        authorName: 'นายสถาพร มีสุข',
        authorRole: 'ผู้รับผิดชอบงาน'
      },
      {
        id: 'tl-10',
        date: '25/02/2570',
        title: 'ส่งผลการตรวจวัดคุณภาพน้ำและรายงานต่อผู้บริหารขั้นต้น',
        description: 'หัวหน้ากลุ่มงานตรวจสอบรับรองผลเรียบร้อย เสนอรองผู้อำนวยการ',
        statusBadge: 'pending_exec',
        authorName: 'นางรัตนา ทรัพย์อุดม',
        authorRole: 'หัวหน้ากลุ่มงานบริหาร'
      }
    ],
    comments: [
      {
        id: 'c-04',
        authorName: 'นางรัตนา ทรัพย์อุดม',
        authorRole: 'หัวหน้ากลุ่มงานบริหาร',
        content: 'รับรองผลการดำเนินงาน คุณภาพน้ำผ่านเกณฑ์มาตรฐานอย่างสมบูรณ์ ขอเสนอผู้อำนวยการเพื่อรับทราบและปิดงานครับ',
        createdAt: '28 ก.พ. 2570 14:20',
        level: 3
      }
    ],
    lastUpdated: '1 มี.ค. 2570'
  },
  {
    id: 'proj-04',
    code: 'GCH-69-GR01',
    name: 'โครงการพัฒนาสวนบำบัดสีเขียว (Healing Garden) เพื่อฟื้นฟูสุขภาพผู้ป่วย',
    categoryId: 'green',
    department: 'กลุ่มงานกายภาพบำบัดและสิ่งแวดล้อม',
    responsiblePerson: 'แพทย์หญิงศศิธร วงศ์สวรรค์',
    responsiblePosition: 'แพทย์เวชศาสตร์ฟื้นฟู',
    startDate: '15 ต.ค. 2569',
    endDate: '15 พ.ค. 2570',
    target: 'เพิ่มพื้นที่สีเขียว 1,200 ตร.ม. พร้อมทางเดินฝึกเดินกายภาพบำบัดสำหรับผู้ป่วยโรคหลอดเลือดสมอง',
    progressPercent: 65,
    status: 'in_progress',
    workflowLevel: 1,
    fiscalYear: 2570,
    evidenceList: [
      {
        id: 'ev-11',
        type: 'photo',
        title: 'ภาพลานคอนกรีตเดิมก่อนการปรับเป็นสวนสมุนไพรและสวนบำบัด',
        description: 'สภาพพื้นที่ว่างหลังอาคารกายภาพบำบัด',
        fileName: 'garden_before_development.jpg',
        fileSize: '3.7 MB',
        fileUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: '20 ต.ค. 2569',
        uploadedBy: 'พญ.ศศิธร วงศ์สวรรค์',
        phase: 'before'
      },
      {
        id: 'ev-12',
        type: 'photo',
        title: 'ความคืบหน้าการปูหญ้า ปลูกต้นไม้ใหญ่ และทำทางลาดรองรับวีลแชร์',
        description: 'การติดตั้งราวจับสแตนเลสและพื้นผิวสัมผัสสำหรับผู้บกพร่องทางการมองเห็น',
        fileName: 'garden_during_planting.jpg',
        fileSize: '4.8 MB',
        fileUrl: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: '15 ม.ค. 2570',
        uploadedBy: 'พญ.ศศิธร วงศ์สวรรค์',
        phase: 'during'
      }
    ],
    timeline: [
      {
        id: 'tl-11',
        date: '15/10/2569',
        title: 'สำรวจพื้นที่และออกแบบ Universal Design ร่วมกับสถาปนิก',
        description: 'จัดทำแบบแปลนสวนบำบัดและคัดเลือกพันธุ์ไม้ที่ไม่มีพิษ ปลอดภัยต่อผู้ป่วย',
        statusBadge: 'completed',
        authorName: 'พญ.ศศิธร วงศ์สวรรค์',
        authorRole: 'ผู้รับผิดชอบงาน'
      },
      {
        id: 'tl-12',
        date: '20/01/2570',
        title: 'ปลูกต้นไม้ยืนต้น 45 ต้น และไม้พุ่มฟอกอากาศ',
        description: 'งานปรับภูมิทัศน์ดำเนินไปแล้ว 65% รอติดตั้งม้านั่งและป้ายชื่อพรรณไม้',
        statusBadge: 'in_progress',
        authorName: 'พญ.ศศิธร วงศ์สวรรค์',
        authorRole: 'ผู้รับผิดชอบงาน'
      }
    ],
    comments: [],
    lastUpdated: '22 ม.ค. 2570'
  },
  {
    id: 'proj-05',
    code: 'GCH-69-HE01',
    name: 'การตรวจวัดคุณภาพอากาศภายในอาคาร (IAQ) และความปลอดภัยของระบบระบายอากาศ',
    categoryId: 'hospital_env',
    department: 'งานอาชีวอนามัยและความปลอดภัยในโรงพยาบาล',
    responsiblePerson: 'นายธนกฤต ประเสริฐยิ่ง',
    responsiblePosition: 'เจ้าหน้าที่ความปลอดภัยในการทำงานวิชาชีพ (จป.วิชาชีพ)',
    startDate: '1 ธ.ค. 2569',
    endDate: '28 ก.พ. 2570',
    target: 'ตรวจวัด IAQ ครบ 18 จุดบริการหลัก ค่าฝุ่น PM2.5 และเชื้อจุลชีพไม่เกินเกณฑ์มาตรฐาน',
    progressPercent: 40,
    status: 'delayed', // ล่าช้ากว่ากำหนด 🔴
    workflowLevel: 1,
    fiscalYear: 2570,
    evidenceList: [
      {
        id: 'ev-13',
        type: 'document',
        title: 'แผนการสุ่มตรวจวัดคุณภาพอากาศรอบประจำปี 2570',
        description: 'ตารางการเข้าตรวจจุดบริการ ห้องผ่าตัด ห้องคลอด และแผนกผู้ป่วยนอก',
        fileName: 'iaq_measurement_plan_2570.pdf',
        fileSize: '1.2 MB',
        fileUrl: '#',
        uploadedAt: '5 ธ.ค. 2569',
        uploadedBy: 'นายธนกฤต ประเสริฐยิ่ง',
        phase: 'before'
      }
    ],
    timeline: [
      {
        id: 'tl-13',
        date: '01/12/2569',
        title: 'เริ่มโครงการและประสานศูนย์วิทยาศาสตร์การแพทย์',
        description: 'ส่งหนังสือขอความอนุเคราะห์เครื่องตรวจวัดอนุภาคฝุ่นและเชื้อรา',
        statusBadge: 'in_progress',
        authorName: 'นายธนกฤต ประเสริฐยิ่ง',
        authorRole: 'ผู้รับผิดชอบงาน'
      },
      {
        id: 'tl-14',
        date: '10/02/2570',
        title: 'เครื่องตรวจวัดจากภายนอกขัดข้อง อยู่ระหว่างการส่งซ่อม',
        description: 'แจ้งขอเลื่อนกำหนดการเก็บตัวอย่างรอบห้องผ่าตัดออกไป 15 วัน',
        statusBadge: 'delayed',
        authorName: 'นายธนกฤต ประเสริฐยิ่ง',
        authorRole: 'ผู้รับผิดชอบงาน'
      }
    ],
    comments: [
      {
        id: 'c-05',
        authorName: 'นายธนกฤต ประเสริฐยิ่ง',
        authorRole: 'ผู้รับผิดชอบ',
        content: 'เนื่องจากเครื่องวัด IAQ ของศูนย์ฯ ต้องส่งสอบเทียบประจำปี คาดว่าจะเข้าตรวจส่วนที่เหลือได้ภายในสัปดาห์หน้าครับ',
        createdAt: '12 ก.พ. 2570 10:00',
        level: 1
      }
    ],
    lastUpdated: '12 ก.พ. 2570'
  },
  {
    id: 'proj-06',
    code: 'GCH-69-SN01',
    name: 'การยกระดับสุขาภิบาลโรงครัวและโรงอาหารตามเกณฑ์ SAN Plus และ Clean Food Good Taste',
    categoryId: 'sanitation',
    department: 'กลุ่มงานโภชนาการและสุขาภิบาล',
    responsiblePerson: 'นางอรทัย โภคทรัพย์',
    responsiblePosition: 'นักโภชนาการชำนาญการพิเศษ',
    startDate: '1 พ.ย. 2569',
    endDate: '31 พ.ค. 2570',
    target: 'ผู้ประกอบการในโรงอาหารผ่านเกณฑ์สุขาภิบาล 100% ตรวจไม่พบแบคทีเรียโคลิฟอร์มในภาชนะ',
    progressPercent: 80,
    status: 'pending_verify', // รอตรวจสอบ
    workflowLevel: 2,
    fiscalYear: 2570,
    evidenceList: [
      {
        id: 'ev-14',
        type: 'photo',
        title: 'ภาพการตรวจสว็อบ (Swab Test) มือผู้ปรุงอาหารและเขียงหั่นเนื้อ',
        description: 'การทดสอบทางห้องปฏิบัติการหาการปนเปื้อนของเชื้อจุลินทรีย์',
        fileName: 'kitchen_swab_test_session.jpg',
        fileSize: '2.9 MB',
        fileUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: '14 ม.ค. 2570',
        uploadedBy: 'นางอรทัย โภคทรัพย์',
        phase: 'during'
      },
      {
        id: 'ev-15',
        type: 'document',
        title: 'ใบประกาศนียบัตรผ่านการอบรมผู้สัมผัสอาหารทุกคน',
        description: 'หลักฐานการผ่านการอบรมสุขาภิบาลอาหารตามหลักสูตรกรมอนามัย',
        fileName: 'food_handler_certificates.pdf',
        fileSize: '4.5 MB',
        fileUrl: '#',
        uploadedAt: '25 ม.ค. 2570',
        uploadedBy: 'นางอรทัย โภคทรัพย์',
        phase: 'general'
      }
    ],
    timeline: [
      {
        id: 'tl-15',
        date: '01/11/2569',
        title: 'เริ่มตรวจประเมินโรงอาหารและโรงครัวรอบที่ 1',
        description: 'พบจุดที่ต้องแก้ไขเรื่องการปิดฝาถังขยะเปียกและที่ล้างจาน',
        statusBadge: 'in_progress',
        authorName: 'นางอรทัย โภคทรัพย์',
        authorRole: 'ผู้รับผิดชอบงาน'
      },
      {
        id: 'tl-16',
        date: '10/02/2570',
        title: 'ตรวจประเมินซ้ำหลังปรับปรุงและเก็บตัวอย่างส่งแล็บ',
        description: 'ผลการตรวจผ่านเกณฑ์ 100% ส่งหลักฐานให้หัวหน้างานรับรอง',
        statusBadge: 'pending_verify',
        authorName: 'นางอรทัย โภคทรัพย์',
        authorRole: 'ผู้รับผิดชอบงาน',
        evidenceIds: ['ev-14', 'ev-15']
      }
    ],
    comments: [],
    lastUpdated: '15 ก.พ. 2570'
  },
  {
    id: 'proj-07',
    code: 'GCH-69-PT01',
    name: 'กิจกรรม Green Health Volunteers รณรงค์ลดใช้พลาสติกและปลูกต้นไม้ประจำปี',
    categoryId: 'participation',
    department: 'คณะกรรมการสิ่งแวดล้อมและความปลอดภัย (ENV)',
    responsiblePerson: 'นายณัฐพล ชูเกียรติ',
    responsiblePosition: 'พยาบาลวิชาชีพชำนาญการ',
    startDate: '1 ส.ค. 2569',
    endDate: '30 ก.ย. 2569',
    target: 'บุคลากรเข้าร่วมกิจกรรมไม่น้อยกว่า 85% เกิดนวัตกรรมสีเขียวจากหอผู้ป่วยอย่างน้อย 10 นวัตกรรม',
    progressPercent: 100,
    status: 'completed',
    workflowLevel: 5,
    fiscalYear: 2569,
    evidenceList: [
      {
        id: 'ev-16',
        type: 'photo',
        title: 'ภาพบรรยากาศวัน Kick-off กิจกรรม Big Cleaning Day & ปลูกต้นไม้',
        description: 'ผู้อำนวยการและบุคลากรร่วมกันทำความสะอาดและปลูกต้นพวงครามริมรั้ว',
        fileName: 'big_cleaning_day_2569.jpg',
        fileSize: '5.2 MB',
        fileUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: '12 ส.ค. 2569',
        uploadedBy: 'นายณัฐพล ชูเกียรติ',
        phase: 'after'
      },
      {
        id: 'ev-17',
        type: 'document',
        title: 'สรุปรายงานผลการประเมินความพึงพอใจและสถิติผู้เข้าร่วมกิจกรรม',
        description: 'แบบสอบถามความตระหนักรู้ด้านสิ่งแวดล้อมของบุคลากรโรงพยาบาล',
        fileName: 'green_volunteer_summary_report.pdf',
        fileSize: '2.1 MB',
        fileUrl: '#',
        uploadedAt: '25 ก.ย. 2569',
        uploadedBy: 'นายณัฐพล ชูเกียรติ',
        phase: 'after'
      }
    ],
    timeline: [
      {
        id: 'tl-17',
        date: '01/08/2569',
        title: 'ประชาสัมพันธ์กิจกรรมและเปิดรับสมัครจิตอาสา Green Volunteer',
        description: 'มีบุคลากรสมัครเข้าร่วมกว่า 240 คนจากทุกแผนก',
        statusBadge: 'completed',
        authorName: 'นายณัฐพล ชูเกียรติ',
        authorRole: 'ผู้รับผิดชอบงาน'
      },
      {
        id: 'tl-18',
        date: '12/08/2569',
        title: 'จัดกิจกรรมวันเฉลิมพระเกียรติ ปลูกต้นไม้ 100 ต้น',
        description: 'กิจกรรมสำเร็จลุล่วงด้วยดีและได้รับความร่วมมืออย่างดียิ่ง',
        statusBadge: 'completed',
        authorName: 'นายณัฐพล ชูเกียรติ',
        authorRole: 'ผู้รับผิดชอบงาน',
        evidenceIds: ['ev-16']
      }
    ],
    comments: [],
    lastUpdated: '30 ก.ย. 2569'
  },
  {
    id: 'proj-08',
    code: 'GCH-69-ME01',
    name: 'การตรวจประเมินตนเอง (Internal Audit) ตามเกณฑ์ Green & Clean Hospital Challenge ระดับดีเยี่ยม',
    categoryId: 'monitoring',
    department: 'คณะทำงานติดตามและประเมินผล GCH',
    responsiblePerson: 'นางจารุวรรณ สินธพ',
    responsiblePosition: 'หัวหน้างานพัฒนาคุณภาพ (HA & GCH)',
    startDate: '1 ม.ค. 2570',
    endDate: '30 มิ.ย. 2570',
    target: 'ผ่านเกณฑ์การประเมินตนเองระดับดีเยี่ยม (คะแนนไม่น้อยกว่า 90%) และจัดทำ Evidence Matrix ครบถ้วน',
    progressPercent: 70,
    status: 'in_progress',
    workflowLevel: 3,
    fiscalYear: 2570,
    evidenceList: [
      {
        id: 'ev-18',
        type: 'data',
        title: 'ตารางคะแนนประเมินตนเองรายหมวด (Self-Assessment Checklist)',
        description: 'ข้อมูลเกณฑ์มาตรฐาน 9 ด้าน พร้อมหลักฐานอ้างอิงประกอบการตรวจสอบ',
        fileName: 'self_assessment_scorecard_2570.xlsx',
        fileSize: '1.6 MB',
        fileUrl: '#',
        uploadedAt: '15 ก.พ. 2570',
        uploadedBy: 'นางจารุวรรณ สินธพ',
        phase: 'during'
      },
      {
        id: 'ev-19',
        type: 'document',
        title: 'รายงานผลการตรวจประเมินภายในรอบไตรมาสที่ 1 ประจำปีงบประมาณ 2570',
        description: 'ข้อเสนอแนะและจุดพัฒนาสำหรับแต่ละกลุ่มงาน',
        fileName: 'internal_audit_q1_report.pdf',
        fileSize: '3.4 MB',
        fileUrl: '#',
        uploadedAt: '28 ก.พ. 2570',
        uploadedBy: 'นางจารุวรรณ สินธพ',
        phase: 'during'
      }
    ],
    timeline: [
      {
        id: 'tl-19',
        date: '05/01/2570',
        title: 'ประชุมคณะทำงานทบทวนเกณฑ์ประเมิน GCH ฉบับปรับปรุงใหม่',
        description: 'มอบหมายผู้รับผิดชอบเก็บรวบรวมหลักฐานแยกตามหมวดหมู่',
        statusBadge: 'completed',
        authorName: 'นางจารุวรรณ สินธพ',
        authorRole: 'ผู้รับผิดชอบงาน'
      },
      {
        id: 'tl-20',
        date: '20/02/2570',
        title: 'ตรวจประเมินหน้างานจริง (Walk-through survey) ครบ 9 หมวด',
        description: 'รวบรวมข้อสังเกตและจัดทำ Evidence Matrix เข้าสู่ระบบสารสนเทศ',
        statusBadge: 'in_progress',
        authorName: 'นางจารุวรรณ สินธพ',
        authorRole: 'ผู้รับผิดชอบงาน',
        evidenceIds: ['ev-18', 'ev-19']
      }
    ],
    comments: [],
    lastUpdated: '1 มี.ค. 2570'
  },
  {
    id: 'proj-09',
    code: 'GCH-70-EV02',
    name: 'โครงการติดตั้งถังดักไขมันเพิ่มเติมในจุดบริการร้านค้าสวัสดิการ',
    categoryId: 'env',
    department: 'งานบริหารทั่วไปและร้านค้าสวัสดิการ',
    responsiblePerson: 'นายประสิทธิ์ มงคลชัย',
    responsiblePosition: 'เจ้าหน้าที่บริหารงานทั่วไป',
    startDate: '1 เม.ย. 2570',
    endDate: '31 ก.ค. 2570',
    target: 'ติดตั้งถังดักไขมันสแตนเลสขนาด 60 ลิตร ครบทุกร้านจำหน่ายอาหารและเครื่องดื่ม',
    progressPercent: 0,
    status: 'not_started', // ⚪ ยังไม่เริ่มดำเนินการ
    workflowLevel: 1,
    fiscalYear: 2570,
    meetingOriginId: 'meet-02',
    meetingResolutionTopic: 'ให้ดำเนินการจัดซื้อและติดตั้งถังดักไขมันเพิ่มเติม ณ ร้านค้าสวัสดิการโรงพยาบาล',
    evidenceList: [],
    timeline: [
      {
        id: 'tl-21',
        date: '01/03/2570',
        title: 'สร้างงานติดตามจากมติที่ประชุมคณะกรรมการ GCH ครั้งที่ 2/2570',
        description: 'ระบบแปลงมติที่ประชุมเป็นงานติดตาม กำหนดเริ่มดำเนินงานตามแผนเมษายน 2570',
        statusBadge: 'not_started',
        authorName: 'ระบบอัตโนมัติ (Green Care Track)',
        authorRole: 'System'
      }
    ],
    comments: [],
    lastUpdated: '1 มี.ค. 2570'
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-01',
    code: 'MT-GCH-2569-04',
    title: 'การประชุมคณะกรรมการพัฒนาโรงพยาบาล Green & Clean Hospital ครั้งที่ 4/2569',
    date: '15 ก.ย. 2569',
    time: '13:30 - 16:30 น.',
    location: 'ห้องประชุมชัยพฤกษ์ ชั้น 4 อาคารผู้ป่วยนอก',
    chairperson: 'นพ.วิบูลย์ วัฒนกุล (ผู้อำนวยการโรงพยาบาล)',
    attendeesCount: 28,
    attendeesSummary: 'คณะกรรมการบริหาร, หัวหน้ากลุ่มงาน, คณะทำงานทั้ง 9 ด้าน',
    agenda: [
      '1. เรื่องแจ้งเพื่อทราบ: ผลการตรวจประเมินเบื้องต้นจากศูนย์อนามัยที่ 10',
      '2. รับรองรายงานการประชุมครั้งที่ 3/2569',
      '3. ติดตามความก้าวหน้าโครงการลดการใช้พลังงานไฟฟ้าและระบบโซลาร์เซลล์',
      '4. สรุปผลการคัดแยกขยะ Zero Waste และการจัดการขยะติดเชื้อ',
      '5. การเตรียมความพร้อมงบประมาณปี 2570'
    ],
    minutesSummary: 'ที่ประชุมรับทราบผลการดำเนินงานในภาพรวม บรรลุเป้าหมายตามเกณฑ์ 82% มีมติเห็นชอบให้เร่งรัดโครงการปรับปรุงคุณภาพน้ำทิ้งและขยายผลสวนบำบัดผู้ป่วย พร้อมทั้งอนุมัติหลักการจัดซื้อถังดักไขมันสำหรับร้านค้าสวัสดิการ',
    resolutions: [
      {
        id: 'res-01',
        topic: 'ให้ดำเนินการปรับปรุงและซ่อมบำรุงระบบเติมอากาศบ่อบำบัดน้ำเสียให้แล้วเสร็จภายในไตรมาส 1/2570',
        responsiblePerson: 'นายสถาพร มีสุข',
        department: 'งานซ่อมบำรุงและสุขาภิบาลสิ่งแวดล้อม',
        deadline: '31 ม.ค. 2570',
        status: 'completed',
        progress: 100,
        linkedProjectId: 'proj-03'
      },
      {
        id: 'res-02',
        topic: 'ให้จัดทำสื่อประชาสัมพันธ์และจัดประกวดนวัตกรรม Green Innovation ระดับหน่วยงาน',
        responsiblePerson: 'นายณัฐพล ชูเกียรติ',
        department: 'คณะกรรมการสิ่งแวดล้อมและความปลอดภัย (ENV)',
        deadline: '30 ก.ย. 2569',
        status: 'completed',
        progress: 100,
        linkedProjectId: 'proj-07'
      },
      {
        id: 'res-03',
        topic: 'ปรับปรุงทางลาดและราวจับในสวนบำบัดผู้ป่วยให้ตรงตามมาตรฐาน Universal Design',
        responsiblePerson: 'แพทย์หญิงศศิธร วงศ์สวรรค์',
        department: 'กลุ่มงานกายภาพบำบัดและสิ่งแวดล้อม',
        deadline: '15 พ.ค. 2570',
        status: 'in_progress',
        progress: 65,
        linkedProjectId: 'proj-04'
      }
    ],
    attachments: [
      {
        name: 'รายงานการประชุม_GCH_4_2569.pdf',
        type: 'pdf',
        size: '3.2 MB',
        url: '#'
      },
      {
        name: 'เอกสารประกอบวาระที่_3_สรุปผลพลังงาน.pdf',
        type: 'pdf',
        size: '1.8 MB',
        url: '#'
      }
    ],
    endorsements: [
      {
        id: 'end-01',
        memberName: 'นพ.เกรียงศักดิ์ ธรรมรัตน์',
        memberRole: 'ประธานกรรมการ GCH / ผู้อำนวยการ',
        decision: 'endorsed',
        reason: 'รับรองรายงานการประชุมและมติทุกข้อ ให้เร่งรัดระบบเติมอากาศบ่อบำบัดน้ำเสียให้แล้วเสร็จตามกำหนด',
        timestamp: '16 ก.ค. 2569 เวลา 10:30 น.'
      },
      {
        id: 'end-02',
        memberName: 'นางสาวกานดา สุวรรณฉัตร',
        memberRole: 'กรรมการและเลขานุการ / งานสิ่งแวดล้อม',
        decision: 'endorsed',
        reason: 'รับรองมติการประชุม มีความสอดคล้องกับแผนยุทธศาสตร์ Green Hospital',
        timestamp: '16 ก.ค. 2569 เวลา 14:15 น.'
      }
    ],
    photosCount: 6
  },
  {
    id: 'meet-02',
    code: 'MT-GCH-2570-01',
    title: 'การประชุมคณะกรรมการพัฒนาโรงพยาบาล Green & Clean Hospital ครั้งที่ 1/2570',
    date: '20 ม.ค. 2570',
    time: '09:00 - 12:00 น.',
    location: 'ห้องประชุมเฉลิมราชย์ ชั้น 5 อาคารอำนวยการ',
    chairperson: 'นพ.สมศักดิ์ ปรีชาชาญ (รองผู้อำนวยการฝ่ายการแพทย์)',
    attendeesCount: 32,
    attendeesSummary: 'คณะกรรมการ GCH, ตัวแทนกลุ่มงานพยาบาล, งานพัสดุและจัดซื้อ',
    agenda: [
      '1. ติดตามการเตรียมความพร้อมรับการตรวจประเมิน Green & Clean Hospital ระดับดีเยี่ยม',
      '2. รายงานความคืบหน้าระบบ Solar Rooftop และข้อเสนอการลดค่าไฟหอผู้ป่วย',
      '3. การตรวจวัด IAQ ในห้องผ่าตัดและห้องแยกโรค',
      '4. พิจารณาข้อเสนอปรับปรุงสุขาภิบาลร้านค้าสวัสดิการโรงพยาบาล'
    ],
    minutesSummary: 'ที่ประชุมเน้นย้ำเรื่องความถูกต้องของเอกสารหลักฐาน (Evidence Based) ในระบบ GREEN CARE TRACK กำชับให้ทุกหน่วยงานอัปโหลดรูปภาพเปรียบเทียบก่อน-หลัง พร้อมผลตรวจวัดทางห้องปฏิบัติการ และมอบหมายให้จัดซื้อถังดักไขมันเพิ่มเติมสำหรับร้านค้าสวัสดิการ',
    resolutions: [
      {
        id: 'res-04',
        topic: 'ให้ดำเนินการจัดซื้อและติดตั้งถังดักไขมันเพิ่มเติม ณ ร้านค้าสวัสดิการโรงพยาบาล',
        responsiblePerson: 'นายประสิทธิ์ มงคลชัย',
        department: 'งานบริหารทั่วไปและร้านค้าสวัสดิการ',
        deadline: '31 ก.ค. 2570',
        status: 'not_started',
        progress: 0,
        linkedProjectId: 'proj-09'
      },
      {
        id: 'res-05',
        topic: 'เร่งรัดการส่งซ่อมเครื่องมือตรวจวัดอนุภาคอากาศ (IAQ) และประสานตรวจวัดให้ครบทุกจุด',
        responsiblePerson: 'นายธนกฤต ประเสริฐยิ่ง',
        department: 'งานอาชีวอนามัยและความปลอดภัยในโรงพยาบาล',
        deadline: '28 ก.พ. 2570',
        status: 'delayed',
        progress: 40,
        linkedProjectId: 'proj-05'
      },
      {
        id: 'res-06',
        topic: 'จัดทำระบบ Evidence Matrix เพื่อใช้รองรับการตรวจประเมินของคณะกรรมการภายนอก',
        responsiblePerson: 'นางจารุวรรณ สินธพ',
        department: 'คณะทำงานติดตามและประเมินผล GCH',
        deadline: '30 เม.ย. 2570',
        status: 'in_progress',
        progress: 70,
        linkedProjectId: 'proj-08'
      },
      {
        id: 'res-07',
        topic: 'สำรวจพื้นที่จอดรถจักรยานและสถานีชาร์จยานยนต์ไฟฟ้า (EV Charging Station) ภายในโรงพยาบาล',
        responsiblePerson: 'นายพิชัย เกียรติสกุล',
        department: 'กลุ่มงานบริหารทั่วไปและซ่อมบำรุง',
        deadline: '30 พ.ค. 2570',
        status: 'not_started',
        progress: 0
        // No linked project yet! Perfect for demonstrating the [สร้างงานติดตาม] button!
      }
    ],
    attachments: [
      {
        name: 'รายงานการประชุม_GCH_1_2570.pdf',
        type: 'pdf',
        size: '4.1 MB',
        url: '#'
      }
    ],
    endorsements: [
      {
        id: 'end-03',
        memberName: 'นพ.สมศักดิ์ ปรีชาชาญ',
        memberRole: 'ประธานในที่ประชุม / รองผู้อำนวยการฝ่ายการแพทย์',
        decision: 'endorsed',
        reason: 'รับรองมติการประชุม มอบหมายให้กลุ่มงานพัสดุและร้านค้าสวัสดิการดำเนินการติดตั้งถังดักไขมันทันที',
        timestamp: '21 ม.ค. 2570 เวลา 11:00 น.'
      },
      {
        id: 'end-04',
        memberName: 'นายธนกฤต ประเสริฐยิ่ง',
        memberRole: 'กรรมการ / งานอาชีวอนามัยและความปลอดภัย',
        decision: 'rejected',
        reason: 'ขอให้ปรับแก้วาระที่ 3 ในส่วนกำหนดส่งซ่อมเครื่องมือตรวจวัด IAQ เป็นวันที่ 15 มี.ค. 2570 เนื่องจากต้องรออะไหล่จากต่างประเทศ',
        timestamp: '22 ม.ค. 2570 เวลา 09:40 น.'
      }
    ],
    photosCount: 8
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    type: 'overdue',
    title: '🔴 โครงการเกินกำหนดรายงานผล 5 วัน',
    message: 'งานตรวจวัดคุณภาพอากาศภายในอาคาร (IAQ) เกินกำหนดรายงานผลแล้ว กรุณาอัปเดตความคืบหน้า',
    projectId: 'proj-05',
    date: 'เมื่อวานนี้ 08:30',
    targetRole: 'officer',
    isRead: false,
    severity: 'high'
  },
  {
    id: 'notif-02',
    type: 'due_soon',
    title: '🔔 แจ้งเตือน: เหลืออีก 7 วันจะครบกำหนดรายงานผล',
    message: 'โครงการลดการใช้พลังงานไฟฟ้าในอาคารผู้ป่วยและติดตั้ง Solar Rooftop ครบกำหนดส่งรายงานผลรอบที่ 3',
    projectId: 'proj-01',
    date: 'วันนี้ 09:15',
    targetRole: 'officer',
    isRead: false,
    severity: 'medium'
  },
  {
    id: 'notif-03',
    type: 'pending_approval',
    title: '🟠 มีโครงการรอการรับรองจากท่าน',
    message: 'นางอรทัย โภคทรัพย์ ส่งหลักฐานโครงการยกระดับสุขาภิบาลโรงครัวและโรงอาหาร รอหัวหน้ากลุ่มงานรับรอง',
    projectId: 'proj-06',
    date: 'วันนี้ 10:45',
    targetRole: 'supervisor',
    isRead: false,
    severity: 'medium'
  },
  {
    id: 'notif-04',
    type: 'pending_approval',
    title: '🔵 โครงการรอผู้บริหารพิจารณาอนุมัติ',
    message: 'โครงการปรับปรุงระบบบำบัดน้ำเสีย (Water Recycling) ผ่านการรับรองจากหัวหน้ากลุ่มงานแล้ว รอผู้บริหารเห็นชอบ',
    projectId: 'proj-03',
    date: '2 วันก่อน 14:00',
    targetRole: 'middle_exec',
    isRead: false,
    severity: 'info'
  },
  {
    id: 'notif-05',
    type: 'approved',
    title: '🟢 โครงการได้รับการรับรองระดับโรงพยาบาลแล้ว',
    message: 'ระบบนวัตกรรมคัดแยกขยะมูลฝอย (Zero Waste) ได้รับการรับรองปิดงานโดยผู้อำนวยการโรงพยาบาล',
    projectId: 'proj-02',
    date: '3 วันก่อน 16:20',
    targetRole: 'all',
    isRead: true,
    severity: 'info'
  }
];

export const INITIAL_AUTHORIZED_USERS: AuthorizedUser[] = [
  {
    id: 'user-01',
    name: 'นพ.เกรียงศักดิ์ ธรรมรัตน์',
    position: 'ผู้อำนวยการโรงพยาบาล / ประธานกรรมการ GCH',
    department: 'คณะกรรมการบริหารโรงพยาบาล',
    allowedLevels: ['3', '4', '5'],
    createdAt: '1 ก.ค. 2569',
    status: 'active',
    note: 'ผู้บริหารสูงสุด / ประธานอนุมัติโครงการและรับรองระดับ 4-5'
  },
  {
    id: 'user-02',
    name: 'นพ.สมศักดิ์ ปรีชาชาญ',
    position: 'รองผู้อำนวยการฝ่ายการแพทย์ / ประธานที่ประชุม',
    department: 'กลุ่มงานการแพทย์และพัฒนาคุณภาพ',
    allowedLevels: ['3', '4', '5'],
    createdAt: '1 ก.ค. 2569',
    status: 'active',
    note: 'ประธานคณะกรรมการตรวจประเมิน GCH'
  },
  {
    id: 'user-03',
    name: 'นางสาวกานดา สุวรรณฉัตร',
    position: 'นักวิชาการสาธารณสุขชำนาญการ / เลขานุการ GCH',
    department: 'กลุ่มงานบริหารสิ่งแวดล้อมและอาชีวอนามัย',
    allowedLevels: ['1', '2'],
    createdAt: '1 ก.ค. 2569',
    status: 'active',
    note: 'ผู้รับผิดชอบงาน Zero Waste และเลขานุการคณะกรรมการ'
  },
  {
    id: 'user-04',
    name: 'นายพิชัย เกียรติสกุล',
    position: 'นายช่างเทคนิคชำนาญงาน',
    department: 'กลุ่มงานบริหารทั่วไปและซ่อมบำรุง',
    allowedLevels: ['1'],
    createdAt: '1 ก.ค. 2569',
    status: 'active',
    note: 'ผู้รับผิดชอบโครงการ Solar Rooftop และประหยัดพลังงาน'
  },
  {
    id: 'user-05',
    name: 'ผู้ดูแลระบบไอที (Super Admin)',
    position: 'นักวิชาการคอมพิวเตอร์ / ผู้ดูแลระบบ GCH',
    department: 'ศูนย์เทคโนโลยีสารสนเทศทางการแพทย์',
    allowedLevels: ['admin', '1', '2', '3', '4', '5'],
    createdAt: '1 ก.ค. 2569',
    status: 'active',
    note: 'ผู้ดูแลระบบสูงสุด สิทธิ์จัดการข้อมูลและคอนฟิกูเรชันทั้งหมด'
  }
];

