import { describe, it, expect } from 'vitest';
import { 
  sanitizeInput, 
  maskSensitiveData, 
  containsExposedSecrets, 
  runSecurityAudit 
} from '../utils/security';
import { Task } from '../types';

describe('Siber Güvenlik & XSS Önleme Testleri (Security Suite)', () => {
  it('Zararlı script etiketlerini ve XSS enjeksiyonlarını başarıyla temizlemelidir', () => {
    const maliciousInput = '<script>alert("Hacked!");</script>Normal Metin';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert(');
    expect(sanitized).toContain('Normal Metin');
  });

  it('HTML olay yöneticilerini (onerror, onload) ve javascript: protokollerini temizlemelidir', () => {
    const maliciousImg = '<img src="x" onerror="stealData()" />Test';
    const sanitized = sanitizeInput(maliciousImg);
    expect(sanitized).not.toContain('onerror=');

    const maliciousLink = 'javascript:evilFunction()';
    const sanitizedLink = sanitizeInput(maliciousLink);
    expect(sanitizedLink).not.toContain('javascript:');
  });

  it('Açıkta duran OpenAI API anahtarını tespit etmelidir', () => {
    const textWithOpenAI = 'Config: sk-proj-1234567890abcdef1234567890';
    const result = containsExposedSecrets(textWithOpenAI);
    expect(result.exposed).toBe(true);
    expect(result.secretTypes).toContain('OpenAI API Anahtarı');
  });

  it('Açıkta duran GitHub tokenlarını (ghp_) tespit etmelidir', () => {
    const textWithGH = 'Yetki: ghp_123456789012345678901234567890123456';
    const result = containsExposedSecrets(textWithGH);
    expect(result.exposed).toBe(true);
    expect(result.secretTypes).toContain('GitHub Token');
  });

  it('Hassas API anahtarlarını maskeleyerek sızıntıyı engellemelidir', () => {
    const secret = 'sk-proj-1234567890abcdef1234567890';
    const masked = maskSensitiveData(`API anahtarım: ${secret}`);
    expect(masked).not.toContain(secret);
    expect(masked).toContain('[KORUMALI_OPENAI_API_ANAHTARI]');
  });

  it('Temiz görev listesi için güvenlik denetiminin geçtiğini doğrulamalıdır', () => {
    const mockTasks: Task[] = [
      {
        id: 'tsk-1',
        title: 'Önbellekleme Katmanı',
        description: 'Redis önbellekleme mimarisi',
        status: 'todo',
        priority: 'high',
        category: 'backend',
        assigneeId: 'usr-1',
        dueDate: '2026-10-20',
        estimatedHours: 8,
        loggedHours: 0,
        subtasks: [],
        tags: ['Redis'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const audit = runSecurityAudit(mockTasks);
    const apiCheck = audit.find((a) => a.id === 'sec-api-leak');
    expect(apiCheck?.status).toBe('passed');
  });
});
