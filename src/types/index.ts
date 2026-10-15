export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type TaskCategory = 
  | 'frontend' 
  | 'backend' 
  | 'devops' 
  | 'design' 
  | 'security' 
  | 'mobile' 
  | 'qa';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  accessLevel: 'admin' | 'lead' | 'developer' | 'viewer';
  hourlyRate: number; // TRY
  currentLoad: number; // 0-100%
  skills: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  assigneeId: string;
  dueDate: string; // YYYY-MM-DD
  estimatedHours: number;
  loggedHours: number;
  subtasks: Subtask[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  riskScore?: number; // 0-100
  aiGenerated?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  action: 'TASK_CREATE' | 'TASK_UPDATE' | 'TASK_DELETE' | 'STATUS_CHANGE' | 'SECURITY_SCAN' | 'DATA_EXPORT' | 'AI_EXTRACT';
  details: string;
  severity: 'info' | 'success' | 'warning' | 'alert';
}

export interface AIExtractionResult {
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  estimatedHours: number;
  suggestedAssigneeId: string;
  extractedKeywords: string[];
  detectedRisks: string[];
  confidenceScore: number;
}

export interface SecurityAuditItem {
  id: string;
  title: string;
  status: 'passed' | 'warning' | 'critical';
  category: 'api_protection' | 'xss_sanitization' | 'storage_integrity' | 'rbac' | 'dependency_check';
  details: string;
  recommendation?: string;
}

export type ActiveTab = 'dashboard' | 'kanban' | 'ai_assistant' | 'time_finance' | 'security_team';
