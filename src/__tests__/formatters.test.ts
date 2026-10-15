import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDateTR, PRIORITY_LABELS, CATEGORY_LABELS } from '../utils/formatters';

describe('Formatlayıcılar & Dil Çeviri Testleri', () => {
  it('Para birimini Türk Lirası (TRY) olarak formatlamalıdır', () => {
    const formatted = formatCurrency(45000);
    expect(formatted).toContain('45.000');
  });

  it('Tarihleri Türkçe ay isimleriyle formatlamalıdır', () => {
    const date = '2026-10-18';
    const formatted = formatDateTR(date);
    expect(formatted).toBeDefined();
    expect(formatted).toContain('Eki');
  });

  it('Öncelik ve kategori etiketlerinin Türkçe karşılıklarını içermelidir', () => {
    expect(PRIORITY_LABELS.critical).toBe('Kritik Acil');
    expect(CATEGORY_LABELS.security).toBe('Siber Güvenlik');
    expect(CATEGORY_LABELS.frontend).toBe('Frontend & UI');
  });
});
