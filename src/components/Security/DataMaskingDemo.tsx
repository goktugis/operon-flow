import React, { useState } from 'react';
import { maskSensitiveData, containsExposedSecrets, sanitizeInput } from '../../utils/security';
import { ShieldCheck, Lock, AlertTriangle, Copy, Check } from 'lucide-react';
import { sound } from '../../utils/audio';

const SAMPLE_SECRETS = [
  'sk-proj-9481948194819481948194819481948194819481',
  'ghp_A83kL91mO04PqRsTuVwXyZ1234567890ABCD',
  'AKIAIOSFODNN7EXAMPLE',
  '<script>alert("XSS Attack!");</script>',
];

export const DataMaskingDemo: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Production db şifremiz: Pass!123 ve OpenAI token: sk-proj-9481948194819481948194819481948194819481 ve git: ghp_A83kL91mO04PqRsTuVwXyZ1234567890ABCD'
  );
  const [copied, setCopied] = useState(false);

  const check = containsExposedSecrets(inputText);
  const sanitized = sanitizeInput(inputText);
  const masked = maskSensitiveData(sanitized);

  const handleCopy = () => {
    navigator.clipboard.writeText(masked);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Hassas Anahtar & Gizli Bilgi Maskeleme Simülatörü
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            API anahtarlarının ve şifrelerin kod tabanına veya loglara sızmasını önleyen filtre motoru
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Zero-Leakage Engine
        </span>
      </div>

      {/* Quick sample chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-slate-400">Örnek veri ekle:</span>
        {SAMPLE_SECRETS.map((sample, i) => (
          <button
            key={i}
            onClick={() => setInputText((prev) => `${prev} ${sample}`)}
            className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500 text-[10px] font-mono text-slate-300 hover:text-white transition-colors"
          >
            {sample.length > 20 ? sample.substring(0, 18) + '...' : sample}
          </button>
        ))}
      </div>

      {/* Grid: Raw input vs Masked safe output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left: Input Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ham Metin / API İstek Gövdesi:</span>
            {check.exposed && (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {check.secretTypes.length} adet gizli anahtar bulundu!
              </span>
            )}
          </div>
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            placeholder="Bir API anahtarı veya hassas metin yazın..."
          />
        </div>

        {/* Right: Sanitized and Masked Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Güvenli & Maskelenmiş Çıktı:
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>
          <div className="w-full h-[116px] p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-xs text-emerald-300 font-mono overflow-y-auto leading-relaxed select-all">
            {masked || <span className="text-slate-600">Maskelenmiş çıktı burada belirecek...</span>}
          </div>
        </div>

      </div>

      <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between flex-wrap gap-2">
        <span>✓ Güvenlik Protokolü: Tüm girişler XSS ve regex sızıntı denetiminden geçmektedir.</span>
        <span className="font-bold">Korumalı Anahtarlar: OpenAI, GitHub, AWS, JWT, Google API</span>
      </div>

    </div>
  );
};
