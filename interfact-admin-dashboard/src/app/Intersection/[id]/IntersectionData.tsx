import React from 'react';
import { Intersection } from '@/app/types/Firebase/intersectionTypeFB';

type IntersectionDataProps = {
  intersection: Intersection | null;
  id: string;
};

export const IntersectionData: React.FC<IntersectionDataProps> = ({ intersection, id }) => (
  <div className='intersection-info'>
    <div className='intersection-info-left shadow'>
      <h1 className='intersection-info-name shadow'>
        {intersection?.name || ''} <span>({id})</span>
      </h1>
      <img src={intersection?.imagepath || '/no-image.webp'} alt='Intersection' />
    </div>
    <div className='intersection-info-right shadow'>
      <h1>Camera Details</h1>
      <div>Id | <span>{intersection?.id}</span></div>
      <div>Imagepath | <span>{intersection?.imagepath}</span></div>
      <div>Latitude | <span>{intersection?.latitude}</span></div>
      <div>Longitude | <span>{intersection?.longitude}</span></div>
      <div>Name | <span>{intersection?.name}</span></div>
      <div>Status | <span>{intersection?.status}</span></div>
      <div>Timestamp | <span>{intersection?.timestamp}</span></div>
    </div>
  </div>
);
