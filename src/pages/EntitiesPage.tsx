import React from 'react';
import { EntitiesBrowser } from '../components/EntitiesBrowser';

interface EntitiesPageProps {
  schemaCountMode: 19 | 21;
  onNavigateToERD: (entityId: string) => void;
}

export const EntitiesPage: React.FC<EntitiesPageProps> = ({
  schemaCountMode,
  onNavigateToERD,
}) => {
  return (
    <div className="space-y-6">
      <EntitiesBrowser
        schemaCountMode={schemaCountMode}
        onNavigateToERD={onNavigateToERD}
      />
    </div>
  );
};
