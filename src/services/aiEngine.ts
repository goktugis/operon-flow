import { AIExtractionResult, Task, TaskCategory, TaskPriority, TeamMember } from '../types';
import { maskSensitiveData, sanitizeInput } from '../utils/security';

interface KeywordRule<T> {
  keywords: string[];
  value: T;
  weight: number;
}

const PRIORITY_RULES: KeywordRule<TaskPriority>[] = [
  {
    keywords: ['çöktü', 'crash', '500 hatası', 'kesinti', 'acil', 'derhal', 'kritik', 'veri kaybı', 'güvenlik açığı', 'istismar', 'ödeme geçmiyor', 'production down', 'bloke'],
    value: 'critical',
    weight: 10,
  },
  {
    keywords: ['hata', 'bug', 'aksama', 'yavaşlık', 'timeout', 'müşteri şikayeti', 'önemli', 'yarına kadar', 'sprint sonu', 'yüksek öncelik'],
    value: 'high',
    weight: 5,
  },
  {
    keywords: ['güncelleme', 'iyileştirme', 'refactor', 'yeni özellik', 'feature', 'optimizasyon', 'entegrasyon', 'tasarım revizesi'],
    value: 'medium',
    weight: 2,
  },
  {
    keywords: ['dokümantasyon', 'readme', 'renk değişimi', 'küçük typo', 'metin düzeltme', 'opsiyonel', 'ileride'],
    value: 'low',
    weight: 1,
  },
];

const CATEGORY_RULES: KeywordRule<TaskCategory>[] = [
  {
    keywords: ['güvenlik', 'token', 'xss', 'jwt', 'şifreleme', 'rbac', 'yetkilendirme', 'firewall', 'sızma', 'cors', 'auth'],
    value: 'security',
    weight: 6,
  },
  {
    keywords: ['docker', 'kubernetes', 'k8s', 'ci/cd', 'deploy', 'aws', 'sunucu', 'nginx', 'helm', 'pipeline', 'linux', 'bulut'],
    value: 'devops',
    weight: 5,
  },
  {
    keywords: ['api', 'rest', 'graphql', 'veritabanı', 'postgres', 'sql', 'redis', 'servis', 'backend', 'node', 'express', 'endpoint', 'migration'],
    value: 'backend',
    weight: 5,
  },
  {
    keywords: ['ui', 'ux', 'css', 'tailwind', 'tasarım', 'figma', 'renk', 'font', 'ikon', 'wireframe', 'prototip'],
    value: 'design',
    weight: 4,
  },
  {
    keywords: ['react', 'vue', 'component', 'frontend', 'arayüz', 'ekran', 'buton', 'modal', 'dashboard', 'animasyon', 'mobil uyum', 'responsive'],
    value: 'frontend',
    weight: 5,
  },
  {
    keywords: ['flutter', 'react native', 'ios', 'android', 'mobil', 'apk', 'app store'],
    value: 'mobile',
    weight: 5,
  },
  {
    keywords: ['test', 'vitest', 'jest', 'cypress', 'otomasyon', 'qa', 'kalite', 'e2e'],
    value: 'qa',
    weight: 4,
  },
];

/**
 * Intelligent Turkish Natural Language Task Extractor
 */
export function extractTaskWithAI(rawText: string, teamMembers: TeamMember[]): AIExtractionResult {
  // First layer: Sanitize and mask any sensitive keys
  const sanitized = sanitizeInput(rawText);
  const safeText = maskSensitiveData(sanitized);
  const lowerText = safeText.toLowerCase();

  // 1. Determine Priority
  let detectedPriority: TaskPriority = 'medium';
  let maxPriorityScore = 0;

  for (const rule of PRIORITY_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (lowerText.includes(kw)) {
        score += rule.weight;
      }
    }
    if (score > maxPriorityScore) {
      maxPriorityScore = score;
      detectedPriority = rule.value;
    }
  }

  // 2. Determine Category
  let detectedCategory: TaskCategory = 'frontend';
  let maxCatScore = 0;

  for (const rule of CATEGORY_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (lowerText.includes(kw)) {
        score += rule.weight;
      }
    }
    if (score > maxCatScore) {
      maxCatScore = score;
      detectedCategory = rule.value;
    }
  }

  // 3. Extract Keywords / Tags
  const allKeywords = [
    'React', 'TypeScript', 'Tailwind', 'Next.js', 'PostgreSQL', 'Redis',
    'Docker', 'Kubernetes', 'CI/CD', 'Security', 'API', 'UI/UX',
    'Performance', 'Auth', 'Mobile', 'BugFix', 'Audit'
  ];
  const matchedKeywords = allKeywords.filter((kw) => lowerText.includes(kw.toLowerCase()));
  if (matchedKeywords.length === 0) {
    matchedKeywords.push(detectedCategory.toUpperCase(), detectedPriority.toUpperCase());
  }

  // 4. Extract Risks
  const detectedRisks: string[] = [];
  if (lowerText.includes('canlı') || lowerText.includes('production') || lowerText.includes('ödeme')) {
    detectedRisks.push('Canlı servis ve kullanıcı etkilenme riski');
  }
  if (lowerText.includes('veritabanı') || lowerText.includes('migration') || lowerText.includes('veri')) {
    detectedRisks.push('Veritabanı migration & veri kaybı riski - Yedekleme zorunlu');
  }
  if (lowerText.includes('üçüncü taraf') || lowerText.includes('api') || lowerText.includes('entegrasyon')) {
    detectedRisks.push('Harici sağlayıcı bağımlılığı ve timeout riski');
  }
  if (detectedPriority === 'critical') {
    detectedRisks.push('SLA ihlali riski - Acil müdahale gerektirir');
  }
  if (detectedRisks.length === 0) {
    detectedRisks.push('Standart geliştirme süreci - Düşük risk faktörü');
  }

  // 5. Calculate Estimated Hours
  let estimatedHours = 6;
  if (detectedPriority === 'critical') estimatedHours = 4; // Fast turnaround
  else if (detectedPriority === 'high') estimatedHours = 12;
  else if (detectedPriority === 'medium') estimatedHours = 8;
  else estimatedHours = 3;

  if (lowerText.includes('mimari') || lowerText.includes('refactor') || lowerText.includes('sıfırdan')) {
    estimatedHours += 10;
  }

  // 6. Generate Clean Title
  const lines = safeText.split('\n').map((l) => l.trim()).filter(Boolean);
  let title = lines[0] || 'Yeni Akıllı Görev';
  if (title.length > 70) {
    title = title.substring(0, 67) + '...';
  }
  // Remove markdown prefixes if any
  title = title.replace(/^[#\-*\d.]+\s*/, '');

  // 7. Match Assignee by skill and category
  let suggestedAssignee = teamMembers[0]?.id || '';
  const eligibleMembers = teamMembers.filter((m) => {
    const roleLower = m.role.toLowerCase();
    const skillsLower = m.skills.map((s) => s.toLowerCase());

    if (detectedCategory === 'frontend' && (roleLower.includes('frontend') || skillsLower.includes('react'))) return true;
    if (detectedCategory === 'backend' && (roleLower.includes('backend') || skillsLower.includes('node') || skillsLower.includes('api'))) return true;
    if (detectedCategory === 'devops' && (roleLower.includes('devops') || roleLower.includes('cloud') || skillsLower.includes('docker') || skillsLower.includes('kubernetes'))) return true;
    if (detectedCategory === 'security' && (roleLower.includes('güvenlik') || roleLower.includes('security') || skillsLower.includes('security') || skillsLower.includes('owasp') || skillsLower.includes('jwt'))) return true;
    if (detectedCategory === 'design' && (roleLower.includes('tasarım') || roleLower.includes('designer') || roleLower.includes('ui/ux'))) return true;
    if (detectedCategory === 'qa' && (roleLower.includes('qa') || roleLower.includes('test'))) return true;
    if (detectedCategory === 'mobile' && (roleLower.includes('mobile') || roleLower.includes('mobil'))) return true;
    return false;
  });

  if (eligibleMembers.length > 0) {
    // Pick the one with lowest current load
    eligibleMembers.sort((a, b) => a.currentLoad - b.currentLoad);
    suggestedAssignee = eligibleMembers[0].id;
  }

  // Confidence score
  const confidenceScore = Math.min(98, 75 + (matchedKeywords.length * 5));

  return {
    title,
    description: safeText,
    priority: detectedPriority,
    category: detectedCategory,
    estimatedHours,
    suggestedAssigneeId: suggestedAssignee,
    extractedKeywords: matchedKeywords.slice(0, 5),
    detectedRisks,
    confidenceScore,
  };
}

export interface SprintHealthSummary {
  healthScore: number; // 0-100
  status: 'excellent' | 'good' | 'warning' | 'critical';
  headline: string;
  bottlenecks: string[];
  recommendations: string[];
  metrics: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    criticalPending: number;
    completionPercentage: number;
  };
}

/**
 * Generate intelligent Sprint Health Assessment
 */
export function generateSprintHealthReport(tasks: Task[]): SprintHealthSummary {
  const total = tasks.length;
  if (total === 0) {
    return {
      healthScore: 100,
      status: 'excellent',
      headline: 'Sprint henüz başlatılmadı veya görev bulunmuyor.',
      bottlenecks: [],
      recommendations: ['Sprint planlama toplantısı yapıp yeni hedefleri ekleyin.'],
      metrics: {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        criticalPending: 0,
        completionPercentage: 0,
      },
    };
  }

  const completed = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const review = tasks.filter((t) => t.status === 'review').length;
  const criticalPending = tasks.filter((t) => t.priority === 'critical' && t.status !== 'done').length;
  const completionPercentage = Math.round((completed / total) * 100);

  const bottlenecks: string[] = [];
  const recommendations: string[] = [];
  let healthScore = 85;

  if (criticalPending > 0) {
    healthScore -= criticalPending * 15;
    bottlenecks.push(`${criticalPending} adet kritik acil görev hala tamamlanmayı bekliyor.`);
    recommendations.push('Kritik görevlere acil mühendis tahsis edin veya swarm çalışması başlatın.');
  }

  if (review >= 3) {
    healthScore -= 10;
    bottlenecks.push(`İnceleme (QA/Review) sütununda ${review} görev yığılmış durumda.`);
    recommendations.push('Code review ve QA süreçlerine öncelik vererek tıkanıklığı açın.');
  }

  if (inProgress > total * 0.5) {
    healthScore -= 10;
    bottlenecks.push('Ekip aynı anda çok fazla görevi yürütmeye çalışıyor (WIP limiti aşımı).');
    recommendations.push('Work In Progress limitini 3 görev ile sınırlandırarak tamamlanma oranını artırın.');
  }

  healthScore = Math.max(25, Math.min(100, healthScore));

  let status: 'excellent' | 'good' | 'warning' | 'critical' = 'good';
  let headline = 'Sprint dengeli ilerliyor ve hedeflere ulaşılabilir.';

  if (healthScore >= 85) {
    status = 'excellent';
    headline = 'Mükemmel Sprint Ritmi! Takım hedefleri zamanından önce tamamlayabilir.';
  } else if (healthScore >= 70) {
    status = 'good';
    headline = 'Sprint istikrarlı. Küçük optimizasyonlarla hız artırılabilir.';
  } else if (healthScore >= 50) {
    status = 'warning';
    headline = 'Dikkat: Bazı operasyonel darboğazlar sprint hızını yavaşlatıyor.';
  } else {
    status = 'critical';
    headline = 'Kritik Uyarı: Acil müdahale ve önceliklendirme revizyonu gerekiyor!';
  }

  if (recommendations.length === 0) {
    recommendations.push('Mevcut hızınızı koruyun, sonraki sprint hazırlıklarına başlayabilirsiniz.');
  }

  return {
    healthScore,
    status,
    headline,
    bottlenecks,
    recommendations,
    metrics: {
      totalTasks: total,
      completedTasks: completed,
      inProgressTasks: inProgress,
      criticalPending,
      completionPercentage,
    },
  };
}
