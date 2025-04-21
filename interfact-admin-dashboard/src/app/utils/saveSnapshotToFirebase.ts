import { collection, doc, setDoc } from "firebase/firestore";
import { dbFB } from "../../../FirebaseConfig";
import { SnapshotCategoryData } from "../types/Firebase/snapshotFB";

export const saveSnapshotDataToFirebase = async (
  snapshotId: string,
  data: SnapshotCategoryData
): Promise<void> => {
  const snapshotRef = doc(collection(dbFB, "Snapshots"), snapshotId);

  const formattedData: any = {};

  Object.entries(data).forEach(([category, entries]) => {
    formattedData[category] = entries.map((entry) => {
      const key = category === "hourly" ? "hour" : "day";
      return { [key]: entry.label, percent: entry.percent };
    });
  });

  await setDoc(snapshotRef, formattedData, { merge: true });
};
