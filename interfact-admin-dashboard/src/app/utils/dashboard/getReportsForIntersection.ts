
export const getReportsForIntersection = (
    intersectionId: string,
    userFeedback: Array<{ reports?: string[] }>,
    logs: Array<{ logid: string | number; cameraid: string | number }>
  ): number => {
    return userFeedback.reduce((total, user) => {
      if (!Array.isArray(user.reports) || user.reports.length === 0) {
        return total;
      }
  
      const matchingReports = user.reports.filter((reportLogID) => {
        const matchingLog = logs.find((log) => {
          const logIdMatch = String(log.logid) === String(reportLogID);
          const intersectionMatch = String(log.cameraid) === String(intersectionId);
          if (logIdMatch && intersectionMatch) {
            console.log(
              `Matching log found: Log ID ${log.logid}, Camera ID ${log.cameraid}`
            );
          }
          return logIdMatch && intersectionMatch;
        });
        return !!matchingLog;
      });
      return total + matchingReports.length;
    }, 0);
  };
  