import React from 'react';
import { Overview } from '../components/Overview';

interface OverviewPageProps {
  schemaCountMode: 19 | 21;
  setSchemaCountMode: (mode: 19 | 21) => void;
  setActiveTab: (tab: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  schemaCountMode,
  setSchemaCountMode,
  setActiveTab,
}) => {
  return (
    <div className="space-y-6">
      <Overview
        schemaCountMode={schemaCountMode}
        setSchemaCountMode={setSchemaCountMode}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};
