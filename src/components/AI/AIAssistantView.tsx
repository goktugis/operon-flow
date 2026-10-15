import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { extractTaskWithAI } from '../../services/aiEngine';
import { AIExtractionResult } from '../../types';
import { SprintHealthSummary } from './SprintHealthSummary';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Tag, 
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { 
  PRIORITY_COLORS, 
  PRIORITY_LABELS, 
  CATEGORY_COLORS, 
  CATEGORY_LABELS 
} from '../../utils/formatters';

const PROMPT_TEMPLATES = [
  {
    title: 'Canlı Ortam Çökme Raporu',
    text: 'Acil: Ödeme servisinde 500 hatası alıyoruz, kullanıcılar sepeti tamamlayamıyor. Canlı ortam etkilendi, derhal Redis ve PostgreSQL connection pool loglarına bakılıp düzeltilmeli!',
  },
  {
    title: 'Siber Güvenlik Token İncelemesi',
    text: 'Siber güvenlik denetimi: API uç noktalarında JWT refresh token rotasyonu eksikliği tespit edildi. OWASP kurallarına uygun HttpOnly secure cookie ve sızıntı önleme mimarisi kurulmalı.',
  },
  {
    title: 'Kubernetes Küme Ölçekleme',
    text: 'DevOps ekibine: Gelecek haftaki lansman için AWS EKS üzerinde HPA (Horizontal Pod Autoscaler) kurallarını güncelleyin ve Canary rollout pipeline testlerini tamamlayın.',
  },
  {
    title: 'Mikro-Etkileşim Tasarım Revizesi',
    text: 'Tasarım ekibi: Buton tıklama geri bildirimleri ve modal geçişleri için WCAG uyumlu mikro-animasyonlar ve yeni renk tokenları Figma üzerinde finalize edilmeli.',
  },
];

export const AIAssistantView: React.FC = () => {
  const { teamMembers, addTask, showToast, setActiveTab } = useApp();

  const [inputPrompt, setInputPrompt] = useState(PROMPT_TEMPLATES[0].text);
  const [extractedResult, setExtractedResult] = useState<AIExtractionResult | null>(() =>
    extractTaskWithAI(PROMPT_TEMPLATES[0].text, teamMembers)
  );

  const handleAnalyze = () => {
    if (!inputPrompt.trim()) return;
    const result = extractTaskWithAI(inputPrompt, teamMembers);
    setExtractedResult(result);
    showToast('AI metni başarıyla analiz etti ve görevi modelledi!', 'success');
  };

  const handleApplyTemplate = (tmplText: string) => {
    setInputPrompt(tmplText);
    const result = extractTaskWithAI(tmplText, teamMembers);
    setExtractedResult(result);
  };

  const handlePushToKanban = () => {
    if (!extractedResult) return;

    addTask({
      title: extractedResult.title,
      description: extractedResult.description,
      status: 'todo',
      priority: extractedResult.priority,
      category: extractedResult.category,
      assigneeId: extractedResult.suggestedAssigneeId,
      dueDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      estimatedHours: extractedResult.estimatedHours,
      loggedHours: 0,
      subtasks: [
        { id: 'sub-1', title: 'Mimari ve güvenlik incelemesi', completed: false },
        { id: 'sub-2', title: 'Kod geliştirme ve test suite', completed: false },
        { id: 'sub-3', title: 'Sprint incelemesi ve canlıya alma', completed: false },
      ],
      tags: extractedResult.extractedKeywords,
      riskScore: extractedResult.detectedRisks.length * 25,
      aiGenerated: true,
    });

    showToast('AI Görevi başarıyla Sprint Panosuna eklendi!', 'success');
    setActiveTab('kanban');
  };

  const matchedMember = extractedResult
    ? teamMembers.find((m) => m.id === extractedResult.suggestedAssigneeId)
    : null;

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-slate-950 border border-purple-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Operon AI • Doğal Dil Görev & Risk Motoru</h2>
            <p className="text-xs text-slate-400">Toplantı notu, müşteri e-postası veya hata raporundan saniyeler içinde yapılandırılmış mühendislik görevi çıkarır.</p>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input & Templates (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Textarea Input */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Girdi Metni (Not, Mesaj, Hata Bildirimi)
            </label>
            <textarea
              rows={6}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Geliştirilmesini istediğiniz işi serbest Türkçe metin olarak buraya yapıştırın..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />

            <button
              onClick={handleAnalyze}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98"
            >
              <Zap className="w-4 h-4" />
              <span>Metni Analiz Et & Göreve Dönüştür</span>
            </button>
          </div>

          {/* Quick Test Prompt Templates */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Hazır Şablon Denemeleri
            </p>
            <div className="space-y-2">
              {PROMPT_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyTemplate(tmpl.text)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-indigo-500/40 hover:bg-slate-800/40 text-xs transition-colors"
                >
                  <p className="font-semibold text-slate-200">{tmpl.title}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{tmpl.text}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Extraction Output Preview (7 cols) */}
        <div className="lg:col-span-7">
          {extractedResult ? (
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-indigo-500/30 shadow-2xl space-y-5">
              
              {/* Header with confidence meter */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    AI Çıkarım Sonucu
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Güven Skoru:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    %{extractedResult.confidenceScore} Doğruluk
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-lg font-bold text-white">
                  {extractedResult.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 leading-relaxed">
                  {extractedResult.description}
                </p>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Tespit Edilen Öncelik</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[extractedResult.priority].bg} ${PRIORITY_COLORS[extractedResult.priority].text} ${PRIORITY_COLORS[extractedResult.priority].border}`}>
                    {PRIORITY_LABELS[extractedResult.priority]}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Disiplin Kategori</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[extractedResult.category]}`}>
                    {CATEGORY_LABELS[extractedResult.category]}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Önerilen Efor</span>
                  <span className="text-xs font-bold text-white">
                    {extractedResult.estimatedHours} Saat
                  </span>
                </div>
              </div>

              {/* Matched Engineer */}
              {matchedMember && (
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={matchedMember.avatar}
                      alt={matchedMember.name}
                      className="w-10 h-10 rounded-full object-cover border border-indigo-500/50"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{matchedMember.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                          AI Eşleşti
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{matchedMember.role}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-400">İş Yükü:</span>{' '}
                    <strong className="text-slate-200">%{matchedMember.currentLoad}</strong>
                  </div>
                </div>
              )}

              {/* Detected Risks Warnings */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>AI Risk & Bağımlılık Taraması:</span>
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {extractedResult.detectedRisks.map((risk, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Push to Board Action */}
              <button
                onClick={handlePushToKanban}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tek Tıkla Sprint Panosuna Aktar (Kanban'a Ekle)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center justify-center p-8 text-center">
              <Sparkles className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-400">Henüz bir analiz yapılmadı</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Sol taraftaki kutuya bir talep yazın veya hazır şablonlardan birini seçerek analizi başlatın.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Sprint Health Diagnostics Card */}
      <SprintHealthSummary />

    </div>
  );
};
