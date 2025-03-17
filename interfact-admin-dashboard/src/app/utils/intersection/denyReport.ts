import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { dbFB } from '../../../../FirebaseConfig';

export const denyReport = async (logID: string): Promise<void> => {
  try {
    const usersRef = collection(dbFB, 'users');
    const snapshot = await getDocs(usersRef);
    const updates = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      if (Array.isArray(data.reports)) {
        const filteredReports = data.reports.filter(
          (report: string) => String(report) !== String(logID)
        );
        if (filteredReports.length !== data.reports.length) {
          return updateDoc(docSnap.ref, { reports: filteredReports });
        }
      }
      return null;
    });
    await Promise.all(updates);
    console.log(`Reports with logID ${logID} removed.`);
  } catch (error) {
    console.error('Error removing report:', error);
  }
};
