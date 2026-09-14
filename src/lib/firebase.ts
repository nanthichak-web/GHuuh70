import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDocFromServer,
  writeBatch,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Project, Meeting, NotificationItem, AuthorizedUser, AccessLogEntry } from '../types';
import { INITIAL_PROJECTS, INITIAL_MEETINGS, INITIAL_NOTIFICATIONS, INITIAL_AUTHORIZED_USERS } from '../data/initialData';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific Database ID if provisioned
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Storage and Auth
export const storage = getStorage(app);
export const auth = getAuth(app);

// Test Firestore Connection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is currently offline or connecting...');
      return false;
    }
    // Any other response (like doc not found) means the connection to server succeeded
    return true;
  }
}

/**
 * Recursively cleans any object/array before persisting to Cloud Firestore.
 * Removes keys whose value is undefined, strips undefined from arrays, and handles nested objects.
 * This completely prevents "Function setDoc() called with invalid data. Unsupported field value: undefined".
 */
export function cleanFirestoreData<T>(data: T): any {
  if (data === null || data === undefined) {
    return null;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item));
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned;
  }
  return data;
}

/**
 * Seed initial data if cloud database is empty
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    if (projectsSnapshot.empty) {
      console.log('Seeding initial Green & Clean projects to Cloud Firestore...');
      const batch = writeBatch(db);

      // Seed projects
      INITIAL_PROJECTS.forEach(proj => {
        const docRef = doc(db, 'projects', proj.id);
        batch.set(docRef, cleanFirestoreData(proj));
      });

      // Seed meetings
      INITIAL_MEETINGS.forEach(meet => {
        const docRef = doc(db, 'meetings', meet.id);
        batch.set(docRef, cleanFirestoreData(meet));
      });

      // Seed notifications
      INITIAL_NOTIFICATIONS.forEach(notif => {
        const docRef = doc(db, 'notifications', notif.id);
        batch.set(docRef, cleanFirestoreData(notif));
      });

      // Seed authorized users
      INITIAL_AUTHORIZED_USERS.forEach(user => {
        const docRef = doc(db, 'authorized_users', user.id);
        batch.set(docRef, cleanFirestoreData(user));
      });

      await batch.commit();
      console.log('Cloud database initialized with Green & Clean Hospital seed data successfully.');
    } else {
      // Also check if authorized_users is empty
      const usersSnap = await getDocs(collection(db, 'authorized_users'));
      if (usersSnap.empty) {
        const batchUsers = writeBatch(db);
        INITIAL_AUTHORIZED_USERS.forEach(user => {
          const docRef = doc(db, 'authorized_users', user.id);
          batchUsers.set(docRef, cleanFirestoreData(user));
        });
        await batchUsers.commit();
        console.log('Authorized users initialized in Cloud Firestore.');
      }
    }
  } catch (err) {
    console.error('Error checking/seeding Firestore initial data:', err);
  }
}

/**
 * Subscribe to real-time Projects
 */
export function subscribeToProjects(
  onUpdate: (projects: Project[]) => void,
  onError?: (error: Error) => void
) {
  const collRef = collection(db, 'projects');
  return onSnapshot(
    collRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => doc.data() as Project);
        onUpdate(items);
      }
    },
    (err) => {
      console.error('Firestore project subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Subscribe to real-time Meetings
 */
export function subscribeToMeetings(
  onUpdate: (meetings: Meeting[]) => void,
  onError?: (error: Error) => void
) {
  const collRef = collection(db, 'meetings');
  return onSnapshot(
    collRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => doc.data() as Meeting);
        onUpdate(items);
      }
    },
    (err) => {
      console.error('Firestore meeting subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Subscribe to real-time Notifications
 */
export function subscribeToNotifications(
  onUpdate: (notifications: NotificationItem[]) => void,
  onError?: (error: Error) => void
) {
  const collRef = collection(db, 'notifications');
  return onSnapshot(
    collRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => doc.data() as NotificationItem);
        // Sort descending by date or id
        items.sort((a, b) => b.id.localeCompare(a.id));
        onUpdate(items);
      }
    },
    (err) => {
      console.error('Firestore notifications subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save / Update Project in Firestore
 */
export async function saveProjectToFirestore(project: Project): Promise<void> {
  try {
    const docRef = doc(db, 'projects', project.id);
    const cleaned = cleanFirestoreData(project);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (err) {
    console.error('Error saving project to Firestore:', err);
    throw err;
  }
}

/**
 * Save / Update Meeting in Firestore
 */
export async function saveMeetingToFirestore(meeting: Meeting): Promise<void> {
  try {
    const docRef = doc(db, 'meetings', meeting.id);
    const cleaned = cleanFirestoreData(meeting);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (err) {
    console.error('Error saving meeting to Firestore:', err);
    throw err;
  }
}

/**
 * Save Notification to Firestore
 */
export async function saveNotificationToFirestore(notif: NotificationItem): Promise<void> {
  try {
    const docRef = doc(db, 'notifications', notif.id);
    const cleaned = cleanFirestoreData(notif);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (err) {
    console.error('Error saving notification to Firestore:', err);
    throw err;
  }
}

/**
 * Mark Notification as read in Firestore
 */
export async function markNotificationReadInFirestore(notifId: string): Promise<void> {
  try {
    const docRef = doc(db, 'notifications', notifId);
    await updateDoc(docRef, { isRead: true });
  } catch (err) {
    console.error('Error updating notification in Firestore:', err);
  }
}

/**
 * Upload Evidence File to Cloud Storage (with DataURL fallback)
 */
export async function uploadEvidenceFile(
  file: File,
  projectId: string
): Promise<{ url: string; fileName: string; fileSize: string }> {
  const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
  const fileName = file.name;

  try {
    // Try Cloud Storage
    const storagePath = `evidence/${projectId}/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, storagePath);
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    return {
      url: downloadUrl,
      fileName,
      fileSize: sizeMB
    };
  } catch (err) {
    console.warn('Firebase Storage direct upload fallback to base64 DataURL:', err);
    // If Firebase storage rules or bucket CORS doesn't allow direct public upload,
    // read as Base64 Data URL so user's image is never lost and renders immediately!
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          url: (e.target?.result as string) || '#',
          fileName,
          fileSize: sizeMB
        });
      };
      reader.onerror = () => {
        resolve({
          url: '#',
          fileName,
          fileSize: sizeMB
        });
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Delete Project from Firestore
 */
export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  try {
    const docRef = doc(db, 'projects', projectId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting project from Firestore:', err);
    throw err;
  }
}

/**
 * Delete Meeting from Firestore
 */
export async function deleteMeetingFromFirestore(meetingId: string): Promise<void> {
  try {
    const docRef = doc(db, 'meetings', meetingId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting meeting from Firestore:', err);
    throw err;
  }
}

/**
 * Subscribe to Authorized Users
 */
export function subscribeToAuthorizedUsers(callback: (users: AuthorizedUser[]) => void): () => void {
  const usersRef = collection(db, 'authorized_users');
  return onSnapshot(
    usersRef,
    (snapshot) => {
      const users: AuthorizedUser[] = [];
      snapshot.forEach((docSnap) => {
        users.push(docSnap.data() as AuthorizedUser);
      });
      callback(users);
    },
    (error) => {
      console.error('Error in authorized_users subscription:', error);
      callback(INITIAL_AUTHORIZED_USERS);
    }
  );
}

/**
 * Save / Update Authorized User in Firestore
 */
export async function saveAuthorizedUserToFirestore(user: AuthorizedUser): Promise<void> {
  try {
    const docRef = doc(db, 'authorized_users', user.id);
    const cleaned = cleanFirestoreData(user);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (err) {
    console.error('Error saving authorized user to Firestore:', err);
    throw err;
  }
}

/**
 * Delete Authorized User from Firestore
 */
export async function deleteAuthorizedUserFromFirestore(userId: string): Promise<void> {
  try {
    const docRef = doc(db, 'authorized_users', userId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting authorized user from Firestore:', err);
    throw err;
  }
}

/**
 * Record Access / Login Log in Firestore
 */
export async function recordAccessLog(log: AccessLogEntry): Promise<void> {
  try {
    const docRef = doc(db, 'access_logs', log.id);
    const cleaned = cleanFirestoreData(log);
    await setDoc(docRef, cleaned);
  } catch (err) {
    console.error('Error recording access log to Firestore:', err);
  }
}

/**
 * Subscribe to Access Logs (ordered by timestamp descending)
 */
export function subscribeToAccessLogs(callback: (logs: AccessLogEntry[]) => void): () => void {
  const logsRef = collection(db, 'access_logs');
  const q = query(logsRef, orderBy('timestampMs', 'desc'), limit(150));
  return onSnapshot(
    q,
    (snapshot) => {
      const logs: AccessLogEntry[] = [];
      snapshot.forEach((docSnap) => {
        logs.push(docSnap.data() as AccessLogEntry);
      });
      callback(logs);
    },
    (error) => {
      console.warn('Falling back to un-ordered access_logs query (no index needed yet):', error);
      // Fallback in case orderBy requires composite index
      const unsub = onSnapshot(collection(db, 'access_logs'), (snap) => {
        const logs: AccessLogEntry[] = [];
        snap.forEach((d) => logs.push(d.data() as AccessLogEntry));
        logs.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
        callback(logs);
      });
      return unsub;
    }
  );
}

/**
 * Delete Access Log from Firestore
 */
export async function deleteAccessLogFromFirestore(logId: string): Promise<void> {
  try {
    const docRef = doc(db, 'access_logs', logId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting access log from Firestore:', err);
    throw err;
  }
}

/**
 * Clear All Access Logs from Firestore
 */
export async function clearAccessLogsFromFirestore(logs: AccessLogEntry[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    logs.forEach((log) => {
      const docRef = doc(db, 'access_logs', log.id);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (err) {
    console.error('Error clearing access logs:', err);
    throw err;
  }
}
