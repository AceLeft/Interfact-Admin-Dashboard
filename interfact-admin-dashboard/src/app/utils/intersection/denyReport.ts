import { deleteFromDB } from '@/app/DAOs/Firebase/intersectionsDAO';

export const denyReport = async (logID: string): Promise<void> => {
  try {
    deleteFromDB(logID);
  } catch (error) {
    console.error('Error removing report:', error);
  }
};
