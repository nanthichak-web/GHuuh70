import React, { useState, useEffect } from 'react';
import {
  CATEGORIES,
  INITIAL_PROJECTS,
  INITIAL_MEETINGS,
  INITIAL_NOTIFICATIONS
} from './data/initialData';
import { Project, Category, Meeting, NotificationItem, UserRole, StatusType, EvidenceItem, MeetingResolution } from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CategoryListView } from './components/CategoryListView';
import { ProjectsView } from './components/ProjectsView';
import { EvidenceMatrixView } from './components/EvidenceMatrixView';
import { MeetingTrackingView } from './components/MeetingTrackingView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { NewProjectModal } from './components/NewProjectModal';
import { NewMeetingModal } from './components/NewMeetingModal';
import { EvidenceLightboxModal } from './components/EvidenceLightboxModal';
import { ReportPrintModal } from './components/ReportPrintModal';
import {
  testFirestoreConnection,
  seedInitialDataIfEmpty,
  subscribeToProjects,
  subscribeToMeetings,
  subscribeToNotifications,
  saveProjectToFirestore,
  saveMeetingToFirestore,
  saveNotificationToFirestore,
  markNotificationReadInFirestore
} from './lib/firebase';

export default function App() {
  // Main Data States
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Cloud Real-time Sync States
  const [cloudConnected, setCloudConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Navigation & Role States
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeRole, setActiveRole] = useState<UserRole>('senior_exec');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [projectListFilterStatus, setProjectListFilterStatus] = useState<StatusType | undefined>(undefined);

  // Modal Dialog States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [previewEvidence, setPreviewEvidence] = useState<{ item: EvidenceItem; projectName: string } | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [newProjectCategoryPrefill, setNewProjectCategoryPrefill] = useState<string | undefined>(undefined);
  const [showNewMeetingModal, setShowNewMeetingModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Initialize and Subscribe to Firestore in Real-time
  useEffect(() => {
    let unsubProjects: (() => void) | undefined;
    let unsubMeetings: (() => void) | undefined;
    let unsubNotifications: (() => void) | undefined;

    async function initCloudDatabase() {
      try {
        setIsSyncing(true);
        const isOk = await testFirestoreConnection();
        setCloudConnected(isOk);

        if (isOk) {
          await seedInitialDataIfEmpty();

          unsubProjects = subscribeToProjects((cloudProjects) => {
            if (cloudProjects && cloudProjects.length > 0) {
              setProjects(cloudProjects);
            }
            setIsSyncing(false);
          });

          unsubMeetings = subscribeToMeetings((cloudMeetings) => {
            if (cloudMeetings && cloudMeetings.length > 0) {
              setMeetings(cloudMeetings);
            }
          });

          unsubNotifications = subscribeToNotifications((cloudNotifs) => {
            if (cloudNotifs && cloudNotifs.length > 0) {
              setNotifications(cloudNotifs);
            }
          });
        } else {
          setIsSyncing(false);
        }
      } catch (err) {
        console.error('Failed to initialize cloud database sync:', err);
        setIsSyncing(false);
      }
    }

    initCloudDatabase();

    return () => {
      if (unsubProjects) unsubProjects();
      if (unsubMeetings) unsubMeetings();
      if (unsubNotifications) unsubNotifications();
    };
  }, []);

  // Notification Handler
  const handleMarkNotificationAsRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, isRead: true } : n))
    );
    markNotificationReadInFirestore(notifId);
  };

  // Create Project
  const handleCreateProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    setShowNewProjectModal(false);
    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'สร้างโครงการใหม่สำเร็จ',
      message: `${newProject.name} โดย ${newProject.responsiblePerson}`,
      date: 'เมื่อสักครู่',
      isRead: false,
      type: 'approved',
      targetRole: 'all',
      severity: 'info',
      projectId: newProject.id
    };
    setNotifications(prev => [newNotif, ...prev]);
    // Navigate and open
    setSelectedProject(newProject);
    // Save to Cloud
    saveProjectToFirestore(newProject);
    saveNotificationToFirestore(newNotif);
  };

  // Update Project (Timeline, Evidence, Workflow, Progress)
  const handleUpdateProject = (updated: Project) => {
    setProjects(prev =>
      prev.map(p => (p.id === updated.id ? updated : p))
    );
    setSelectedProject(updated);
    saveProjectToFirestore(updated);

    // If meeting was linked, update meeting resolution status if completed
    if (updated.meetingOriginId) {
      setMeetings(prev =>
        prev.map(m => {
          if (m.id === updated.meetingOriginId) {
            const updatedMeeting = {
              ...m,
              resolutions: m.resolutions.map(r =>
                r.linkedProjectId === updated.id
                  ? { ...r, status: updated.status, progress: updated.progressPercent }
                  : r
              )
            };
            saveMeetingToFirestore(updatedMeeting);
            return updatedMeeting;
          }
          return m;
        })
      );
    }
  };

  // Create Meeting
  const handleCreateMeeting = (newMeeting: Meeting) => {
    setMeetings(prev => [newMeeting, ...prev]);
    setShowNewMeetingModal(false);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'บันทึกการประชุมใหม่',
      message: `${newMeeting.title} (${newMeeting.resolutions.length} มติ)`,
      date: 'เมื่อสักครู่',
      isRead: false,
      type: 'approved',
      targetRole: 'all',
      severity: 'info'
    };
    setNotifications(prev => [newNotif, ...prev]);
    saveMeetingToFirestore(newMeeting);
    saveNotificationToFirestore(newNotif);
  };

  // Update Meeting (Endorsements, Resolutions, etc.)
  const handleUpdateMeeting = (updatedMeeting: Meeting) => {
    setMeetings(prev =>
      prev.map(m => (m.id === updatedMeeting.id ? updatedMeeting : m))
    );
    saveMeetingToFirestore(updatedMeeting);

    // If an endorsement was newly recorded, trigger a notification
    const latestEndorsement = updatedMeeting.endorsements?.[updatedMeeting.endorsements.length - 1];
    if (latestEndorsement) {
      const isEndorsed = latestEndorsement.decision === 'endorsed';
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: isEndorsed ? 'กรรมการลงนามรับรองมติ' : 'กรรมการไม่รับรองมติ (มีข้อทักท้วง)',
        message: `${latestEndorsement.memberName} ได้${isEndorsed ? 'รับรองมติ' : 'ไม่รับรองมติ'} ใน ${updatedMeeting.title}`,
        date: 'เมื่อสักครู่',
        isRead: false,
        type: isEndorsed ? 'approved' : 'needs_revision',
        targetRole: 'all',
        severity: isEndorsed ? 'info' : 'high'
      };
      setNotifications(prev => [newNotif, ...prev]);
      saveNotificationToFirestore(newNotif);
    }
  };

  // Convert Meeting Resolution -> Follow-up Project (Req #9)
  const handleConvertResolutionToProject = (meeting: Meeting, res: MeetingResolution) => {
    // Generate new follow-up project linked to this resolution
    const newProjId = `proj-res-${Date.now()}`;
    const newProjCode = `GCH-69-MT${Math.floor(Math.random() * 900 + 100)}`;
    
    const newProject: Project = {
      id: newProjId,
      code: newProjCode,
      name: `[ติดตามมติ] ${res.topic}`,
      categoryId: 'waste', // default or contextual
      department: res.department || 'งานบริหารสิ่งแวดล้อม',
      responsiblePerson: res.responsiblePerson || 'ผู้รับผิดชอบตามมติ',
      responsiblePosition: 'ผู้รับผิดชอบตามมติที่ประชุม',
      startDate: meeting.date,
      endDate: res.deadline,
      target: res.topic,
      progressPercent: res.progress || 0,
      status: res.status === 'completed' ? 'completed' : 'in_progress',
      workflowLevel: 1,
      fiscalYear: 2569,
      meetingOriginId: meeting.id,
      meetingResolutionTopic: res.topic,
      evidenceList: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          date: meeting.date,
          title: `สร้างงานติดตามจากมติที่ประชุม (${meeting.code})`,
          description: `มติที่ประชุม: ${res.topic} โดยมอบหมาย ${res.responsiblePerson} กำหนดเสร็จ ${res.deadline}`,
          statusBadge: 'in_progress',
          authorName: meeting.chairperson,
          authorRole: 'ประธานที่ประชุม'
        }
      ],
      comments: [
        {
          id: `c-${Date.now()}`,
          authorName: meeting.chairperson,
          authorRole: 'ประธานที่ประชุม',
          content: `มอบหมายติดตามผลการดำเนินงานให้แล้วเสร็จภายในวันที่ ${res.deadline}`,
          createdAt: meeting.date,
          level: 3
        }
      ],
      lastUpdated: 'เมื่อสักครู่'
    };

    // Update meeting resolution with linkedProjectId
    const updatedMeeting = {
      ...meeting,
      resolutions: meeting.resolutions.map(r =>
        r.id === res.id ? { ...r, linkedProjectId: newProjId } : r
      )
    };

    setMeetings(prev =>
      prev.map(m => (m.id === meeting.id ? updatedMeeting : m))
    );

    // Add to project list
    setProjects(prev => [newProject, ...prev]);

    // Save to Firestore
    saveProjectToFirestore(newProject);
    saveMeetingToFirestore(updatedMeeting);

    // Open project modal so user can immediately inspect and add evidence/timeline
    setSelectedProject(newProject);
  };

  // Navigation helper from dashboard cards
  const handleDashboardNavigate = (tab: string, filterStatus?: StatusType) => {
    setCurrentTab(tab);
    if (filterStatus) {
      setProjectListFilterStatus(filterStatus);
    } else {
      setProjectListFilterStatus(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Persistent Navigation Bar with Role Switcher & Notifications */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        cloudConnected={cloudConnected}
        isSyncing={isSyncing}
        onOpenNewProjectModal={() => {
          setNewProjectCategoryPrefill(undefined);
          setShowNewProjectModal(true);
        }}
        onPrint={() => setShowPrintModal(true)}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q.trim() && currentTab !== 'projects') {
            setCurrentTab('projects');
          }
        }}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {currentTab === 'dashboard' && (
          <DashboardView
            projects={projects}
            categories={categories}
            meetings={meetings}
            activeRole={activeRole}
            onSelectProject={(p) => setSelectedProject(p)}
            onSelectCategory={(catId) => {
              setSelectedCategoryId(catId);
              setCurrentTab('categories');
            }}
            onNavigateToTab={handleDashboardNavigate}
          />
        )}

        {/* TAB 2: PROJECTS & TASKS LIST */}
        {currentTab === 'projects' && (
          <ProjectsView
            projects={projects}
            categories={categories}
            initialFilterStatus={projectListFilterStatus}
            onSelectProject={(p) => setSelectedProject(p)}
            onOpenNewProjectModal={() => {
              setNewProjectCategoryPrefill(undefined);
              setShowNewProjectModal(true);
            }}
          />
        )}

        {/* TAB 3: 9 STANDARD GCH CATEGORIES */}
        {currentTab === 'categories' && (
          <CategoryListView
            categories={categories}
            projects={projects}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(catId) => setSelectedCategoryId(catId)}
            onSelectProject={(p) => setSelectedProject(p)}
            onOpenNewProjectModal={(catId) => {
              setNewProjectCategoryPrefill(catId);
              setShowNewProjectModal(true);
            }}
          />
        )}

        {/* TAB 4: EVIDENCE MATRIX FOR AUDITORS & COMMITTEE */}
        {currentTab === 'evidence-matrix' && (
          <EvidenceMatrixView
            categories={categories}
            projects={projects}
            onSelectProject={(p) => setSelectedProject(p)}
            onPreviewEvidence={(ev, projectName) => setPreviewEvidence({ item: ev, projectName })}
            onPrint={() => setShowPrintModal(true)}
          />
        )}

        {/* TAB 5: MEETING TRACKING & RESOLUTIONS */}
        {currentTab === 'meetings' && (
          <MeetingTrackingView
            meetings={meetings}
            projects={projects}
            currentUserRole={activeRole}
            onSelectProject={(p) => setSelectedProject(p)}
            onConvertResolutionToProject={handleConvertResolutionToProject}
            onOpenNewMeetingModal={() => setShowNewMeetingModal(true)}
            onUpdateMeeting={handleUpdateMeeting}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200/80 bg-white text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="font-semibold text-slate-700">🌱 GREEN CARE TRACK</span>
            <span>— ระบบติดตามและรายงานผลการดำเนินงาน Green & Clean Hospital</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            มาตรฐานโรงพยาบาลที่เป็นมิตรกับสิ่งแวดล้อม กรมอนามัย กระทรวงสาธารณสุข
          </div>
        </div>
      </footer>

      {/* Project Detail Modal (Timeline, Evidence, 5-Level Workflow) */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          categories={categories}
          activeRole={activeRole}
          onClose={() => setSelectedProject(null)}
          onUpdateProject={handleUpdateProject}
          onPreviewEvidence={(ev, projectName) => setPreviewEvidence({ item: ev, projectName })}
        />
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <NewProjectModal
          categories={categories}
          preselectedCategoryId={newProjectCategoryPrefill}
          onClose={() => setShowNewProjectModal(false)}
          onSave={handleCreateProject}
        />
      )}

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <NewMeetingModal
          onClose={() => setShowNewMeetingModal(false)}
          onSave={handleCreateMeeting}
        />
      )}

      {/* Evidence Lightbox Modal */}
      {previewEvidence && (
        <EvidenceLightboxModal
          evidence={previewEvidence.item}
          projectName={previewEvidence.projectName}
          onClose={() => setPreviewEvidence(null)}
        />
      )}

      {/* Report Print Modal (PDF / Printing format) */}
      {showPrintModal && (
        <ReportPrintModal
          projects={projects}
          categories={categories}
          meetings={meetings}
          onClose={() => setShowPrintModal(false)}
        />
      )}

    </div>
  );
}
