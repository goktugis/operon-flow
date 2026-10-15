import { TaskCategory, TaskPriority, TaskStatus } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTR(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatTimeTR(isoString: string): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  critical: 'Kritik Acil',
};

export const PRIORITY_COLORS: Record<TaskPriority, { bg: string; text: string; border: string }> = {
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  medium: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
  high: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  critical: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  frontend: 'Frontend & UI',
  backend: 'Backend API',
  devops: 'DevOps & Bulut',
  design: 'UI/UX Tasarım',
  security: 'Siber Güvenlik',
  mobile: 'Mobil Uygulama',
  qa: 'QA & Test',
};

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  frontend: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  backend: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  devops: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  design: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  security: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  mobile: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  qa: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Bekleme Havuzu',
  todo: 'Yapılacaklar',
  in_progress: 'Devam Eden',
  review: 'İnceleme & QA',
  done: 'Tamamlandı',
};
