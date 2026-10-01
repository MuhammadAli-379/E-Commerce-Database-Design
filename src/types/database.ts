export type DomainType = 
  | 'Customer' 
  | 'Address' 
  | 'Product' 
  | 'Inventory' 
  | 'Orders' 
  | 'Payments' 
  | 'Shipping' 
  | 'Lookup';

export type Cardinality = '1:1' | '1:M' | 'M:1' | 'M:M';

export interface Attribute {
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
  references?: string; // e.g. "Customers.CustomerID"
  nullable?: boolean;
  description?: string;
}

export interface Entity {
  id: string;
  name: string;
  domain: DomainType;
  purpose: string;
  isDocumentedExtra?: boolean; // For Inventory and Suppliers (part of 21-entity schema)
  isLookup?: boolean;
  attributes: Attribute[];
  x: number;
  y: number;
}

export interface Relationship {
  id: string;
  parent: string;
  child: string;
  cardinality: Cardinality;
  description: string;
  businessRule: string;
  parentKey: string;
  childKey: string;
}

export interface BaseTableTransformation {
  id: string;
  name: string;
  domain: DomainType;
  originalPurpose: string;
  originalColumns: string[];
  anomalies: string[];
  nf1Explanation: string;
  nf2Explanation: string;
  nf3Explanation: string;
  resultingEntities: string[];
}

export interface FunctionalDependency {
  entityId: string;
  entityName: string;
  determinant: string;
  dependents: string[];
  transitiveDependencies?: {
    via: string;
    target: string;
    solution: string;
  }[];
  partialDependencies?: {
    compositeKey: string[];
    partialKey: string;
    dependent: string;
    solution: string;
  }[];
  normalFormAchieved: string;
}
