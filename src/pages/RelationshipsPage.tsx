import React from 'react';
import { RelationshipsList } from '../components/RelationshipsList';

interface RelationshipsPageProps {
  onNavigateToERD: (entityId: string) => void;
}

export const RelationshipsPage: React.FC<RelationshipsPageProps> = ({ onNavigateToERD }) => {
  return (
    <div className="space-y-6">
      <RelationshipsList onNavigateToERD={onNavigateToERD} />
    </div>
  );
};
