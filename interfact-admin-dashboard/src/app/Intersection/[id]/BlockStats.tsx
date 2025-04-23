import React from 'react';

type BlockStatsProps = {
  avgBlockTime: number;
  blockedDayTime: number;
  blockedWeekTime: number;
};

export const BlockStats: React.FC<BlockStatsProps> = ({ avgBlockTime, blockedDayTime, blockedWeekTime }) => (
  <div className='log-overall-time shadow'>
    <div className='total-block-time'><h1>Average Time Blocked:</h1> <h2>{avgBlockTime} minutes</h2></div>
    <div className='total-block-time'><h1>Total Time Blocked (Last 24 hours):</h1> <h2>{blockedDayTime} minutes</h2></div>
    <div className='total-block-time'><h1>Total Time Blocked (Last Week):</h1> <h2>{blockedWeekTime} minutes</h2></div>
  </div>
);
