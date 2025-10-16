import { StepId } from './constants';

export interface Step {
  id: StepId;
  name: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputType: 'input' | 'textarea';
  userDataKey: keyof UserData;
}

export interface UserData {
  brandName: string;
  niche: string;
  targetAudience: string;
  subNiche: string;
  brandIdentity: string;
  personaDetailLevel: 'brief' | 'detailed';
}

export interface HistoryItem {
  content: string;
  timestamp: number;
}

// Fix: Changed GeneratedContent to a mapped type to improve type inference for Object.values.
export type GeneratedContent = {
  [key in StepId]: HistoryItem[] | null;
};

export type LoadingStates = {
  [key in StepId]: boolean;
};
