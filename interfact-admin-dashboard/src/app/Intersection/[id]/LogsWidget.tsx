import React from 'react';
import { Intersection } from '@/app/types/Firebase/intersectionTypeFB';

type LogsSectionProps = {
  intersection: Intersection | null;
  logs: any[];
  loading: boolean;
  error: string | null;
  currentLogs: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const LogsSection: React.FC<LogsSectionProps> = ({ intersection, logs, loading, error, currentLogs, currentPage, totalPages, onPageChange }) => (
  <div className='intersection-logs shadow'>
    <h1>Camera Logs</h1>
    <div className='pagination-controls'>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
    </div>
    <div className='intersection-logs-list'>
      {loading && <p>Loading logs...</p>}
      {error && <p className='error'>{error}</p>}
      {!intersection ? (
        <p>Loading intersection data...</p>
      ) : logs.length === 0 ? (
        <p>No logs available.</p>
      ) : currentLogs.length === 0 ? (
        <p>No logs available for this intersection.</p>
      ) : (
        <div className='log-container'>
          {currentLogs.map((log, idx) => (
            <div key={idx} className='log-entry'>
              <div className='log-row'><strong>Log ID:</strong> {log.logid}</div>
              <div className='log-row'><strong>Camera ID:</strong> {log.cameraid}</div>
              <div className='log-row'><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</div>
              <div className='log-row'><strong>Filename:</strong> {log.filename}</div>
              <div className='log-row'><strong>Status:</strong> {log.status}</div>
              <div className='log-row'><strong>Path:</strong> {log.path}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
