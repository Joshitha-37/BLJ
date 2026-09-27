import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  getDocFromServer,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with the provisioned named database
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface InquiryData {
  id?: string;
  garmentType: string;
  isPrinted: string;
  printMethod: string;
  quantity: string;
  deliveryType: string;
  customerName: string;
  customerPhone: string;
  customerNote?: string;
  status?: string;
  createdAt?: string;
}

export interface ContactData {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  createdAt?: string;
}

/**
 * Save new order inquiry into Firestore
 */
export async function saveInquiryToFirestore(data: InquiryData) {
  const refId = data.id || `BLJ-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const record = {
    ...data,
    id: refId,
    status: data.status || 'received',
    createdAt: data.createdAt || now,
    timestamp: serverTimestamp(),
  };

  const docRef = doc(db, 'inquiries', refId);
  await setDoc(docRef, record);
  return { ...record, id: refId };
}

/**
 * Save customer contact message into Firestore
 */
export async function saveContactToFirestore(data: ContactData) {
  const ticketId = data.id || `BLJ-MSG-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const record = {
    ...data,
    id: ticketId,
    createdAt: data.createdAt || now,
    status: 'new',
    timestamp: serverTimestamp(),
  };

  const docRef = doc(db, 'contacts', ticketId);
  await setDoc(docRef, record);
  return { ...record, id: ticketId };
}

/**
 * Fetch recent inquiries for tracking desk
 */
export async function getRecentInquiriesFromFirestore(maxResults: number = 20) {
  try {
    const q = query(
      collection(db, 'inquiries'),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as InquiryData);
  } catch (error) {
    console.warn('Error fetching inquiries from Firestore:', error);
    // Fallback simple collection fetch
    const snap = await getDocs(collection(db, 'inquiries'));
    return snap.docs.map((d) => d.data() as InquiryData);
  }
}

/**
 * Fetch single inquiry by Reference ID
 */
export async function getInquiryById(id: string): Promise<InquiryData | null> {
  try {
    const docRef = doc(db, 'inquiries', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as InquiryData;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Subscribe to real-time incoming inquiries from Firestore
 */
export function subscribeToInquiries(
  onData: (inquiries: InquiryData[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(
      collection(db, 'inquiries'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => d.data() as InquiryData);
        onData(items);
      },
      (error) => {
        console.warn('Realtime inquiries error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('subscribeToInquiries fallback error:', err);
    return () => {};
  }
}

/**
 * Subscribe to real-time customer contacts from Firestore
 */
export function subscribeToContacts(
  onData: (contacts: ContactData[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(
      collection(db, 'contacts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => d.data() as ContactData);
        onData(items);
      },
      (error) => {
        console.warn('Realtime contacts error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('subscribeToContacts fallback error:', err);
    return () => {};
  }
}

/**
 * Update the status of an inquiry in Firestore
 */
export async function updateInquiryStatus(id: string, status: string) {
  const docRef = doc(db, 'inquiries', id);
  await updateDoc(docRef, { status });
}

/**
 * Validate Firestore connection
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline:', error.message);
    }
    return false;
  }
}
