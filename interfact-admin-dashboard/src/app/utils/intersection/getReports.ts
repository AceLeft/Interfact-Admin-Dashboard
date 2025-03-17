export const getReports = (userFeedback: { reports?: string[] }[]): { logID: string }[] => {
    return userFeedback.flatMap((user) => {
      if (Array.isArray(user.reports)) {
        return user.reports.map((logID: string) => ({ logID }));
      }
      return [];
    });
  };
  