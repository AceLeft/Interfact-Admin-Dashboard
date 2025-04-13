import { deleteFromDB } from '@/app/DAOs/Firebase/intersectionsDAO';

export const confirmReport = async (
  fileName: string,
  path: string,
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

    deleteFromDB(logID);

    const confirmResponse = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: path, fileName: fileName }),
    });

    const confirmData = await confirmResponse.json();

    if (!confirmResponse.ok) {
      console.error("Error confirming report:", confirmData.message);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};
