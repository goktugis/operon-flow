# ⚡ Operon Flow — Akıllı Mühendislik & Operasyon Orkestrasyon Platformu

<div align="center">

![Operon Flow Banner](public/mockup.svg)

[![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4.3-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-100%25_Passing-10b981?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![OWASP Security](https://img.shields.io/badge/Security-Zero--Leakage_OWASP-emerald?style=for-the-badge&logo=securityscorecard&logoColor=white)](https://owasp.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

**Yazılımcı Portföyü • Lead Fullstack & Cloud Architect Projesi**  
*Geliştirici:* **Göktuğ İs**

[Canlı Ekranlar](#-modüller--ekranlar) • [Öne Çıkan Özellikler](#-öne-çıkan-yetenekler) • [Güvenlik Mimarisi](#-güvenlik-ve-gizli-anahtar-koruması) • [Kurulum](#-kurulum-ve-çalıştırma) • [Testler](#-test-ve-kalite-güvencesi)

</div>

---

## 📌 Proje Vizyonu ve Çözülen Problem

Modern yazılım geliştirme ekipleri, startup'lar ve ajanslar; görev dağılımı, bütçe tüketimi, teknik riskler ve siber güvenlik denetimleri arasında parçalanmış araçlar (Jira, Trello, Excel, Pomodoro uygulamaları vb.) kullanmak zorunda kalmaktadır.

**Operon Flow**, modern bir yazılımcının sistem tasarımı, reaktif UI/UX, doğal dil işleme (NLP), siber güvenlik prensipleri ve finansal optimizasyon yetkinliklerini tek bir entegre platformda buluşturur:

1. **Serbest Metinleri Göreve Çevirme**: Dağınık Slack mesajları veya müşteri e-postalarından tek tıkla önceliği, eforu ve sorumlusu belirlenmiş görevler üretir.
2. **Sıfır Sızıntı Güvenlik Standardı**: Açıkta kalan API anahtarlarını (`sk-...`, `ghp_...`, `AKIA...`) anında tespit eder ve istemci tarafında dahi maskeler.
3. **Sprint & Finansal Efor Dengesi**: Mühendislerin saatlik ücretlerine göre gerçek zamanlı bütçe tüketimini izler.
4. **Kusursuz Mikro-Etkileşimler**: Web Audio API sentezleyicisi ve pürüzsüz animasyonlarla kullanıcıya üst seviye bir SaaS deneyimi sunar.

---

## 🚀 Öne Çıkan Yetenekler

### 1. 🧠 Operon AI — Türkçe Doğal Dil Görev & Risk Motoru
- Serbest dilde yazılan müşteri taleplerini veya hata raporlarını analiz eder.
- "500 hatası", "çöktü", "derhal" gibi ifadeleri yakalayarak önceliği otomatik olarak `Kritik Acil` olarak belirler.
- Görevin mimari risklerini (Canlı kesinti, veri tabanı göçü, üçüncü taraf bağımlılığı) hesaplar.
- Ekip üyelerinin uzmanlık alanları ve mevcut iş yüklerine (`currentLoad`) göre en uygun mühendisi önerir.
- **Tek Tıkla Sprint Panosuna Aktar**: Analiz edilen işi anında Kanban panosuna aktarır.

### 2. 🛡️ Sıfır Güven (Zero-Trust) Siber Güvenlik ve Maskeleme
- **Hassas Anahtar Koruması**: OpenAI API anahtarları, GitHub tokenları, Google/AWS API anahtarları ve JWT tokenları tespit edilerek `[KORUMALI_...]` biçiminde maskelenir.
- **XSS Sanitizasyonu**: `<script>`, zararlı HTML etiketleri ve olay yöneticileri (`onerror`, `onload`) otomatik olarak nötralize edilir.
- **Canlı Güvenlik Denetleyicisi**: Tek tıkla tarama yaparak sistemin sızıntı durumunu denetler.
- **Kriptografik Denetim İzi (Audit Trail)**: Yapılan her değişiklik (oluşturma, güncelleme, silme, tarama) zaman damgalı olarak loglanır ve CSV olarak dışa aktarılabilir.

### 3. 📋 Yüksek Performanslı Sprint & Kanban Panosu
- 4 Aşamalı İş Akışı: *Bekleme & Yapılacaklar*, *Devam Eden*, *İnceleme & QA*, *Tamamlandı*.
- Disiplin ve Öncelik filtreleme, anlık başlık ve etiket araması.
- Görev kartlarında alt kontrol listesi ilerleme çubuğu, teslim tarihi uyarısı ve hızlı efor girişi (`+1 sa`).
- Görev tamamlandığında konfeti patlaması ve sesli ödüllendirme.

### 4. ⏱️ Zaman & Bütçe Yönetimi (Pomodoro + Finansal Kokpit)
- Sprint bütçesi (₺ 250.000) ve harcanan tutarın anlık karşılaştırması.
- Mühendis bazlı saatlik ücret (`hourlyRate`) ve kümülatif maliyet tablosu.
- Dahili **Pomodoro Odak Kronometresi** (25dk odak / 5dk mola): Süre bittiğinde çalışılan göreve otomatik saat kaydeder.

### 5. ⌨️ Komut Paleti (Command Palette - `Ctrl + K`)
- Klavyeden elinizi kaldırmadan sayfalara atlama, hızlı görev arama, güvenlik taraması başlatma ve ses ayarlarını değiştirme imkanı.

### 6. 🔊 Sentetik Web Audio API Motoru
- Sıfır harici ses dosyası (mp3/wav) bağımlılığı olmadan, Web Audio API osilatörleri ile üretilen yumuşak mikro-etkileşim sesleri.

---

## 🛠️ Teknoloji Yığını ve Mimari

| Katman | Teknolojiler |
|---|---|
| **Frontend Çatısı** | React 19, TypeScript 6.0, Vite 8.3 |
| **Stil & Tasarım** | Tailwind CSS v4, Glassmorphism, CSS Custom Properties |
| **İkonlar & Vektörler**| Lucide React, Özel SVG Grafikleri |
| **Animasyon & Kutlama**| Canvas Confetti, CSS Keyframe Transitions |
| **Ses Motoru** | Native Web Audio API (Synthesizer) |
| **Test Çatısı** | Vitest 5.0, JSDOM, React Testing Library |
| **Güvenlik & Sanitizasyon** | Custom Zero-Trust Regex Engine, OWASP Sanitizer |

---

## 📂 Dizin Yapısı

```bash
operon-flow/
├── public/
│   └── mockup.svg              # Yüksek çözünürlüklü vektör tanıtım görseli
├── src/
│   ├── __tests__/              # Kapsamlı Vitest birim ve entegrasyon testleri
│   │   ├── aiEngine.test.ts
│   │   ├── formatters.test.ts
│   │   └── security.test.ts
│   ├── components/
│   │   ├── AI/                 # Operon AI asistanı ve sprint sağlık analizörü
│   │   ├── Dashboard/          # KPI kartları, SVG hız eğrisi, disiplin grafiği
│   │   ├── Export/             # JSON yedekleme ve CSV dışa aktarma modali
│   │   ├── Kanban/             # Sprint sütunları, görev kartları ve detay modalleri
│   │   ├── Security/           # Güvenlik tarayıcısı, maskeleme sandbox'ı, denetim izi
│   │   ├── TimeFinance/        # Bütçe özeti ve Pomodoro kronometresi
│   │   ├── CommandPalette.tsx  # Ctrl+K hızlı arama ve aksiyon modalı
│   │   ├── Header.tsx          # Navigasyon, ses düğmesi, hızlı aksiyonlar
│   │   └── ToastContainer.tsx  # Animasyonlu durum bildirimleri
│   ├── context/
│   │   └── AppContext.tsx      # Merkezi durum yönetimi ve yerel kalıcılık
│   ├── services/
│   │   ├── aiEngine.ts         # Türkçe NLP kural motoru ve risk analizörü
│   │   └── mockData.ts         # Gerçekçi Türkçe mühendislik sprint verileri
│   ├── types/
│   │   └── index.ts            # Tip güvenliği ve veri modelleri
│   ├── utils/
│   │   ├── audio.ts            # Web Audio API mikro-ses sentezleyicisi
│   │   ├── formatters.ts       # Para birimi, tarih ve etiket formatlayıcıları
│   │   └── security.ts         # XSS sanitizasyon ve gizli anahtar maskeleyici
│   ├── App.tsx                 # Ana uygulama montajı
│   ├── index.css               # Tailwind CSS v4 ve özel stil değişkenleri
│   └── main.tsx                # React 19 kök başlatıcı
├── .env.example                # Güvenli çevresel değişken şablonu
├── package.json                # Paket yapılandırması ve scriptler
└── vite.config.ts              # Vite ve Vitest yapılandırması
```

---

## 🔒 Güvenlik ve Gizli Anahtar Koruması

Bu proje, bir yazılımcının geliştirdiği projelerde güvenlik hassasiyetini göstermek üzere **Zero-Leakage** ilkelerine göre tasarlanmıştır:
- Kod tabanına hiçbir gerçek API anahtarı veya gizli parola commit edilmez (`.gitignore` koruması altındadır).
- Uygulama içerisindeki `DataMaskingDemo` bileşeni, kullanıcıların veya dış sistemlerin girdiği metinleri tarayarak anahtarları otomatik maskeler.
- `npm audit` denetiminde **0 zafiyet** bulunmaktadır.
- Tüm kullanıcı girdileri `sanitizeInput()` fonksiyonundan geçirilerek XSS ataklarına karşı korunur.

---

## 🧪 Test ve Kalite Güvencesi

Projede Vitest ile hazırlanmış birim ve entegrasyon testleri mevcuttur:

```bash
# Testleri tek seferde çalıştırmak için:
npm test

# Testleri izleme (watch) modunda çalıştırmak için:
npm run test:watch
```

**Test Kapsamı:**
- ✅ **Güvenlik Testleri**: XSS enjeksiyon engelleme, OpenAI / GitHub anahtar tespiti, maskeleme doğrulaması.
- ✅ **AI Motoru Testleri**: Kaza/500 raporlarından kritik öncelik çıkarma, disiplin sınıflandırması, doğru mühendise iş atama.
- ✅ **Formatlayıcı Testleri**: Türkçe para birimi (`₺`), tarih dönüşümleri ve sözlük doğrulaması.

---

## 💻 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için:

```bash
# 1. Depoyu klonlayın
git clone https://github.com/goktugis/operon-flow.git

# 2. Proje dizinine gidin
cd operon-flow

# 3. Bağımlılıkları yükleyin
npm install

# 4. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı canlı olarak deneyimleyebilirsiniz.

---

## 📜 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak lisanslanmıştır.

---

<div align="center">
  <sub>Operon Flow • Hazırlayan: <strong>Göktuğ İs</strong> • 2026</sub>
</div>
