import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { ReportComponent } from './ReportComponent';

type ReportsWidgetProps = {
  reports: string[] | null;
  logs: any[];
  retrainData: () => Promise<void>;
};

export const ReportsWidget: React.FC<ReportsWidgetProps> = ({ reports, logs, retrainData }) => (
  <div className='intersection-reports shadow'>
    <div className='intersection-reports-label'>
      <h1>Reports Received <span>{reports?.length || '-'}</span></h1>
      <button onClick={retrainData}>
        <FontAwesomeIcon icon={faScrewdriverWrench} className='text-xl text-muted-foreground text-white' />
      </button>
    </div>
    {reports && reports.length > 0 ? (
      reports.map((report, idx) => {
        const logItem = logs.find(log => String(log.logid).trim() === String(report).trim());
        return <ReportComponent key={idx} report={report} logItem={logItem} index={idx} />;
      })
    ) : (
      <p>No reports found for this intersection.</p>
    )}
  </div>
);
