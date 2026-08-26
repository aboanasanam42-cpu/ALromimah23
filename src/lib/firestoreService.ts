import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  Opportunity,
  ActiveProject,
  PaymentMethod,
  Transaction,
  SyncLog
} from '../types';

// Real-time Listeners
export function subscribeToOpportunities(
  userId: string,
  onData: (data: Opportunity[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'opportunities';
  try {
    const q = query(collection(db, colPath), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: Opportunity[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Opportunity);
        });
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
  }
}

export function subscribeToProjects(
  userId: string,
  onData: (data: ActiveProject[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'projects';
  try {
    const q = query(collection(db, colPath), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: ActiveProject[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as ActiveProject);
        });
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
  }
}

export function subscribeToPaymentMethods(
  userId: string,
  onData: (data: PaymentMethod[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'paymentMethods';
  try {
    const q = query(collection(db, colPath), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: PaymentMethod[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as PaymentMethod);
        });
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
  }
}

export function subscribeToTransactions(
  userId: string,
  onData: (data: Transaction[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'transactions';
  try {
    const q = query(collection(db, colPath), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: Transaction[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Transaction);
        });
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
  }
}

export function subscribeToSyncLogs(
  userId: string,
  onData: (data: SyncLog[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'syncLogs';
  try {
    const q = query(collection(db, colPath), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: SyncLog[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as SyncLog);
        });
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
  }
}

// Write Operations
export async function saveOpportunity(userId: string, opp: Opportunity): Promise<void> {
  const path = `opportunities/${opp.id}`;
  try {
    await setDoc(doc(db, 'opportunities', opp.id), {
      ...opp,
      userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateOpportunityStatusInCloud(
  userId: string,
  id: string,
  status: Opportunity['status']
): Promise<void> {
  const path = `opportunities/${id}`;
  try {
    await updateDoc(doc(db, 'opportunities', id), {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveProject(userId: string, project: ActiveProject): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    await setDoc(doc(db, 'projects', project.id), {
      ...project,
      userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateProjectInCloud(
  userId: string,
  projectId: string,
  updates: Partial<ActiveProject>
): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function savePaymentMethod(userId: string, pm: PaymentMethod): Promise<void> {
  const path = `paymentMethods/${pm.id}`;
  try {
    await setDoc(doc(db, 'paymentMethods', pm.id), {
      ...pm,
      userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveTransaction(userId: string, tx: Transaction): Promise<void> {
  const path = `transactions/${tx.id}`;
  try {
    await setDoc(doc(db, 'transactions', tx.id), {
      ...tx,
      userId,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveSyncLog(userId: string, log: SyncLog): Promise<void> {
  const path = `syncLogs/${log.id}`;
  try {
    await setDoc(doc(db, 'syncLogs', log.id), {
      ...log,
      userId,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Bulk Sync Initial Data to Cloud
export async function syncAllToCloud(
  userId: string,
  data: {
    opportunities: Opportunity[];
    projects: ActiveProject[];
    paymentMethods: PaymentMethod[];
    transactions: Transaction[];
  }
): Promise<number> {
  let count = 0;
  const batch = writeBatch(db);

  data.opportunities.forEach((opp) => {
    const ref = doc(db, 'opportunities', opp.id);
    batch.set(ref, { ...opp, userId, updatedAt: new Date().toISOString() });
    count++;
  });

  data.projects.forEach((proj) => {
    const ref = doc(db, 'projects', proj.id);
    batch.set(ref, { ...proj, userId, updatedAt: new Date().toISOString() });
    count++;
  });

  data.paymentMethods.forEach((pm) => {
    const ref = doc(db, 'paymentMethods', pm.id);
    batch.set(ref, { ...pm, userId, updatedAt: new Date().toISOString() });
    count++;
  });

  data.transactions.forEach((tx) => {
    const ref = doc(db, 'transactions', tx.id);
    batch.set(ref, { ...tx, userId, createdAt: new Date().toISOString() });
    count++;
  });

  await batch.commit();
  return count;
}
