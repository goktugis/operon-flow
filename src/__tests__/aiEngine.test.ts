import { describe, it, expect } from 'vitest';
import { extractTaskWithAI, generateSprintHealthReport } from '../services/aiEngine';
import { INITIAL_TEAM_MEMBERS, INITIAL_TASKS } from '../services/mockData';

describe('Operon AI Doğal Dil & Sprint Sağlık Motoru Testleri', () => {
  it('Kritik çökme ve 500 hatalarını "critical" öncelik olarak sınıflandırmalıdır', () => {
    const prompt = 'Acil: Ödeme sunucusu çöktü ve 500 hatası veriyor, derhal müdahale edilmeli!';
    const result = extractTaskWithAI(prompt, INITIAL_TEAM_MEMBERS);

    expect(result.priority).toBe('critical');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(75);
    expect(result.detectedRisks.length).toBeGreaterThan(0);
  });

  it('Kubernetes ve DevOps terimlerini "devops" kategorisine atamalıdır', () => {
    const prompt = 'Kubernetes kümesinde Docker container deploy pipeline oluşturulsun.';
    const result = extractTaskWithAI(prompt, INITIAL_TEAM_MEMBERS);

    expect(result.category).toBe('devops');
  });

  it('Siber güvenlik ve token taleplerini güvenlik mühendisine önermelidir', () => {
    const prompt = 'Güvenlik incelemesi: JWT token yetkilendirme ve OWASP açığı kapatılsın.';
    const result = extractTaskWithAI(prompt, INITIAL_TEAM_MEMBERS);

    expect(result.category).toBe('security');
    // usr-4 is the security specialist in INITIAL_TEAM_MEMBERS
    expect(result.suggestedAssigneeId).toBe('usr-4');
  });

  it('Sprint Sağlık Raporunu görev metriklerine göre doğru hesaplamalıdır', () => {
    const report = generateSprintHealthReport(INITIAL_TASKS);

    expect(report.healthScore).toBeGreaterThan(0);
    expect(report.healthScore).toBeLessThanOrEqual(100);
    expect(report.metrics.totalTasks).toBe(INITIAL_TASKS.length);
    expect(report.recommendations.length).toBeGreaterThan(0);
  });
});
