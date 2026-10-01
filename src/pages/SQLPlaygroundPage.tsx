import React from 'react';
import { SQLPlayground } from '../components/SQLPlayground';

interface SQLPlaygroundPageProps {
  initialQuery?: string;
}

export const SQLPlaygroundPage: React.FC<SQLPlaygroundPageProps> = ({ initialQuery }) => {
  return (
    <div className="space-y-6">
      <SQLPlayground initialQuery={initialQuery} />
    </div>
  );
};
