# AI Studio Structured Prompt Studio 🚀

A comprehensive visual studio for Google AI Studio's **Structured Prompts** (Few-Shot Tabular Prompting) with built-in presets including the **Swedish Taxi Regulations Exam Generator (TFL)**.

---

## 🇸🇪 دليل التشغيل السريع (عربي)

### 1. المتطلبات:
- تثبيت [Node.js](https://nodejs.org/) (الإصدار 18 أو أحدث).
- مفتاح API مجاني لـ Gemini من: [Google AI Studio API Key](https://aistudio.google.com/app/apikey).

### 2. خطوات التشغيل:
```bash
# 1. تثبيت الاعتماديات
npm install

# 2. إنشاء ملف الإعدادات البيئية .env
cp .env.example .env
```

افتح ملف `.env` وضع مفتاحك:
```env
GEMINI_API_KEY="AIzaSy..."
PORT=3000
```

```bash
# 3. تشغيل التطبيق
npm run dev
```
افتح المتصفح على: `http://localhost:3000`

---

## ⚠️ حل مشكلة Datadog في GitHub (`Missing API or APP keys to initialize datadog-ci!`)

إذا ظهرت لك هذه الرسالة في مستودع GitHub الخاص بك (في تبويب **Actions** أو أثناء الـ CI/CD):

### ما هو السبب؟
هذا التطبيق **لا يستخدم Datadog نهائياً**. هذه الرسالة تظهر فقط إذا كان مستودع GitHub يحتوي على ملف إعدادات قديم أو قالب موروث لـ GitHub Actions (داخل مجلد `.github/workflows/`) يحاول إرسال تقارير إلى خدمة Datadog الخارجية بدون وجود المفاتيح.

### كيف تحلها في 3 خطوات بسيطة؟
1. افتح مستودعك على موقع **GitHub**.
2. اذهب إلى مجلد `.github/workflows/` (إن وُجد).
3. احذف ملف workflow الذي يحتوي على أمر `datadog-ci`، أو قم بتعطيله من تبويب **Actions -> Workflows -> Disable workflow**.
4. التطبيق يحتاج فقط لأمرين للعمل في أي سيرفر أو بيئة:
   - `npm install`
   - `npm run dev` (أو `npm run build` ثم `npm start`).

---

## 🛠️ المميزات الرئيسية (Features)
- **Few-Shot Examples Table:** جدول تفاعلي لإضافة وتعديل أمثلة التدريب.
- **Test Cases Table:** جدول تشغيل وتجربة للأسئلة مع قياس وقت الاستجابة وعدد التوكنز.
- **Swedish Taxi Quiz Preset:** قالب رسمي لتوليد أسئلة رخصة التاكسي بالسويد بصيغة JSON مع خيارات وترجمة عربية وشرح.
- **Get Code:** تصدير كود جاهز للتشغيل بلغات Python (`google-genai`), TypeScript, و cURL.
