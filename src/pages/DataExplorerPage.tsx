import React from 'react';
import { DataExplorer } from '../components/DataExplorer';

interface DataExplorerPageProps {
  onNavigateToSQL: (sql: string) => void;
}

export const DataExplorerPage: React.FC<DataExplorerPageProps> = ({ onNavigateToSQL }) => {
  return (
    <div className="space-y-6">
      <DataExplorer onNavigateToSQL={onNavigateToSQL} />
    </div>
  );
};
