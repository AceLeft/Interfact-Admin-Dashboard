import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { dbFB } from '../../../../FirebaseConfig';

export const confirmReport = async (
  url: string,
  logID: string,
  currentStatus: string
): Promise<void> => {
  try {
    const newStatus = currentStatus === "BLOCKED" ? "OPEN" : "BLOCKED";
    const updateStatusResponse = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logid: logID, status: newStatus }),
    });

    const updateStatusData = await updateStatusResponse.json();

    if (updateStatusResponse.ok) {
      console.log(`Status updated to ${newStatus} for logID: ${logID}`);
    } else {
      console.error("Error updating status:", updateStatusData.message);
      return;
    }

    const usersRef = collection(dbFB, 'users');
    const snapshot = await getDocs(usersRef);
    const updates = snapshot.docs.map(async (docSnap) => {
      const userData = docSnap.data();
      if (Array.isArray(userData.reports)) {
        const filteredReports = userData.reports.filter(
          (report: string) => String(report) !== String(logID)
        );
        if (filteredReports.length !== userData.reports.length) {
          return updateDoc(docSnap.ref, { reports: filteredReports });
        }
      }
    });

    await Promise.all(updates);
    console.log(`Report ${logID} removed from users' reports`);

    const confirmResponse = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const confirmData = await confirmResponse.json();

    if (!confirmResponse.ok) {
      console.error("Error confirming report:", confirmData.message);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};
