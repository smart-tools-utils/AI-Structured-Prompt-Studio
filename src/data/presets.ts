import { StructuredPromptConfig } from '../types/prompt';

export const PRESETS: StructuredPromptConfig[] = [
  {
    id: 'swedish-taxi-quiz',
    title: 'قوانين التاكسي في السويد (Swedish Taxi Laws Quiz JSON)',
    description: 'توليد أسئلة اختبار رخصة التاكسي السويدية (TFL) بصيغة JSON مهيكلة مع ترجمة عربية وشرح دقيق.',
    systemInstruction:
      'Du är en expert på svensk taxilagstiftning och Transportstyrelsens regler för taxiförarlegitimation (TFL). Generera officiella flervalsfrågor av hög kvalitet. Du kan ta emot instruktioner på svenska, engelska eller arabiska. Svara ALLTID med ett strikt JSON-objekt som innehåller: question_sv, question_ar, options (minst 3-4 alternativ), correct_index (0-baserat heltal) och explanation.',
    inputColumns: [
      { id: 'in_topic', name: 'الموضوع / المدخل (Topic / Swedish or English)', type: 'text' },
    ],
    outputColumns: [
      { id: 'out_quiz_json', name: 'بيانات السؤال (Quiz JSON)', type: 'json' },
    ],
    examples: [
      {
        id: 'ex_taxi_1',
        in_topic: 'Fråga om jämförpris och prisinformation på taxifordon i Sverige',
        out_quiz_json: JSON.stringify(
          {
            question_sv: 'Vad är Transportstyrelsens krav gällande prisinformation (jämförpris) på en svensk taxi?',
            question_ar: 'ما هو شرط هيئة النقل السويدية بخصوص معلومات الأسعار (السعر المقارن) في سيارة التاكسي؟',
            options: [
              'Jämförpriset ska finnas väl synligt både på fordonets utsida (bakre sidorutan) och invändigt för kunden',
              'Prisinformation krävs endast om kunden ber om det innan resan påbörjas',
              'Det räcker att föraren uppger startavgiften muntligt',
              'Endast taxameterns display behöver visa aktuellt kilometerpris'
            ],
            correct_index: 0,
            explanation: 'Enligt svensk taxilagstiftning ska varje taxifordon ha gula prisdekaler med jämförpris väl synliga både utvändigt och invändigt så kunden kan jämföra priser innan resan.'
          },
          null,
          2
        ),
      },
      {
        id: 'ex_taxi_2',
        in_topic: 'Fråga om taxiförarlegitimation (TFL) och dess placering under färd',
        out_quiz_json: JSON.stringify(
          {
            question_sv: 'Var ska taxiförarlegitimationen (TFL) vara placerad under en taxiresa?',
            question_ar: 'أين يجب أن توضع بطاقة رخصة سائق التاكسي (TFL) أثناء الرحلة؟',
            options: [
              'Väl synlig för passagerarna i bilens framsida eller instrumentbräda',
              'I förarens plånbok eller ficka',
              'I bilens handskfack tillsammans med fordonets handlingar',
              'Fästad på bilens bakruta'
            ],
            correct_index: 0,
            explanation: 'Taxiförarlegitimationen måste alltid placeras väl synlig för passagerarna (vanligtvis på instrumentbrädan) så att resenären enkelt kan kontrollera förarens identitet och behörighet.'
          },
          null,
          2
        ),
      },
    ],
    testCases: [
      {
        id: 'test_taxi_1',
        in_topic: 'سؤال عن قوانين التاكسي في السويد',
      },
      {
        id: 'test_taxi_2',
        in_topic: 'Kör- och vilotider för taxiförare i Sverige (Lagstiftning)',
      },
      {
        id: 'test_taxi_3',
        in_topic: 'Regler kring barnstolar och bälte i taxi enligt svensk lag',
      },
    ],
    model: 'gemini-3.1-flash-lite',
    thinkingLevel: 'LOW',
    jsonMode: true,
  },
  {
    id: 'civic-quiz',
    title: 'اختبار الجنسية والمعرفة المدنية (CivicQuiz - Samhällskunskap)',
    description: 'توليد أسئلة اختبار المعرفة المدنية والمجتمع والاندماج في السويد بصيغة JSON مهيكلة.',
    systemInstruction:
      'Du är en expert på svensk samhällskunskap, demokrati, grundlagar och historia. Generera officiella flervalsfrågor för medborgarskap och samhällsorientering. Svara ALLTID med ett strikt JSON-objekt som innehåller: question_sv, question_ar, options (exakt 4 alternativ), correct_index (0-baserat heltal) och explanation.',
    inputColumns: [
      { id: 'in_topic', name: 'الموضوع / المدخل (Civic Topic)', type: 'text' },
    ],
    outputColumns: [
      { id: 'out_quiz_json', name: 'بيانات السؤال (Quiz JSON)', type: 'json' },
    ],
    examples: [
      {
        id: 'ex_civic_1',
        in_topic: 'Sveriges statsskick och grundlagar',
        out_quiz_json: JSON.stringify(
          {
            question_sv: 'Vilka är Sveriges fyra grundlagar?',
            question_ar: 'ما هي القوانين الأساسية (الدستورية) الأربعة في السويد؟',
            options: [
              'Regeringsformen, Successionsordningen, Tryckfrihetsförordningen och Yttrandefrihetsgrundlagen',
              'Strafflagen, Civillagen, Miljölagen och Trafiklagen',
              'Kommunallagen, Skattelagen, Polislagen och Skollagen',
              'Europalagen, Riksdagsordningen, Arbetstidslagen och Momsordningen'
            ],
            correct_index: 0,
            explanation: 'Sveriges statsskick bygger på fyra grundlagar: Regeringsformen, Successionsordningen, Tryckfrihetsförordningen samt Yttrandefrihetsgrundlagen.'
          },
          null,
          2
        ),
      },
      {
        id: 'ex_civic_2',
        in_topic: 'Allemansrätten och naturen i Sverige',
        out_quiz_json: JSON.stringify(
          {
            question_sv: 'Vad innebär Allemansrätten i Sverige?',
            question_ar: 'ماذا يعني "حق التجول في الطبيعة" (Allemansrätten) في السويد؟',
            options: [
              'Rätten att vistas fritt i naturen och plocka bär och svamp under regeln: inte störa, inte förstöra',
              'Rätten att bygga stuga var man vill på privat mark',
              'Rätten att jaga fritt utan licens i alla skogar',
              'Rätten att köra motorcykel på alla naturstigar'
            ],
            correct_index: 0,
            explanation: 'Allemansrätten ger alla människor tillgång till naturen med mottot "inte störa - inte förstöra".'
          },
          null,
          2
        ),
      },
    ],
    testCases: [
      {
        id: 'test_civic_1',
        in_topic: 'Hur många ledamöter sitter i Sveriges riksdag och hur väljs de?',
      },
      {
        id: 'test_civic_2',
        in_topic: 'Kommunernas och regionernas olika ansvarsområden i Sverige',
      },
    ],
    model: 'gemini-3.1-flash-lite',
    thinkingLevel: 'LOW',
    jsonMode: true,
  },
  {
    id: 'sentiment-intent',
    title: 'تحليل المشاعر والنية (Customer Sentiment & Intent)',
    description: 'تصنيف رسائل العملاء حسب المشاعر، النية، مستوى الأهمية، والإجراء المقترح.',
    systemInstruction:
      'أنت خبير دعم عملاء ذكي. حلل رسائل العملاء وصنفها بدقة متناهية وفق المشاعر والنية ومستوى الإلحاح والإجراء الموصى به.',
    inputColumns: [
      { id: 'in_message', name: 'رسالة العميل (Customer Message)', type: 'text' },
      { id: 'in_channel', name: 'قناة الاتصال (Channel)', type: 'text' },
    ],
    outputColumns: [
      { id: 'out_sentiment', name: 'المشاعر (Sentiment)', type: 'text' },
      { id: 'out_intent', name: 'النية (Intent)', type: 'text' },
      { id: 'out_urgency', name: 'الإلحاح (Urgency 1-5)', type: 'number' },
      { id: 'out_action', name: 'الإجراء المقترح (Action)', type: 'text' },
    ],
    examples: [
      {
        id: 'ex_1',
        in_message: 'طلبت المنتج منذ 6 أيام ولم يصلني حتى الآن ولا يوجد أي تحديث لرقم التتبع! أحتاجه غداً صباحاً!',
        in_channel: 'Twitter DM',
        out_sentiment: 'غاضب جداً / سلبي (Very Negative)',
        out_intent: 'شكوى تأخر شحن واستعجال (Shipping Delay / Escalation)',
        out_urgency: '5',
        out_action: 'تحويل فوري لفريق الشحن السريع والتواصل الهاتفي مع العميل وتقديم تعويض شحن مجاني.',
      },
      {
        id: 'ex_2',
        in_message: 'مرحباً، هل يتوفر لديكم مقاس 42 من الحذاء الرياضي الأزرق؟ أود إهداءه لصديقي في عطلة نهاية الأسبوع.',
        in_channel: 'WhatsApp',
        out_sentiment: 'إيجابي / ودود (Positive / Inquiring)',
        out_intent: 'استفسار عن توفر منتج (Product Availability)',
        out_urgency: '2',
        out_action: 'التحقق من المخزون وإرسال رابط المنتج مباشرة مع خيار التغليف كهدية.',
      },
      {
        id: 'ex_3',
        in_message: 'تم خصم المبلغ من بطاقتي مرتين عند إتمام عملية الشراء! أرجو استرجاع المبلغ الزائد.',
        in_channel: 'Email Support',
        out_sentiment: 'قلق ومستاء (Concerned / Negative)',
        out_intent: 'نزاع مالي وخصم مكرر (Double Charge / Refund)',
        out_urgency: '4',
        out_action: 'مطابقة المعاملات في بوابة الدفع ورد الخصم المكرر خلال 24 ساعة وإشعار العميل فوراً.',
      },
    ],
    testCases: [
      {
        id: 'test_1',
        in_message: 'الخدمة ممتازة وفريق الدعم ساعدني في 5 دقائق، شكراً لكم على الاحترافية!',
        in_channel: 'Live Chat',
      },
      {
        id: 'test_2',
        in_message: 'التطبيق يغلق تلقائياً في كل مرة أضغط فيها على زر الدفع، جربت إعادة تثبيته دون فائدة.',
        in_channel: 'App Store Review',
      },
      {
        id: 'test_3',
        in_message: 'هل تقدمون عروضاً خاصة للشركات أو الطلبات التي تتجاوز 50 قطعة؟',
        in_channel: 'Email',
      },
    ],
    model: 'gemini-3.8-flash',
    thinkingLevel: 'MEDIUM',
    jsonMode: false,
  },
  {
    id: 'product-to-copy',
    title: 'صناعة الإعلانات والمحتوى التسويقي (Product to Ad Copy)',
    description: 'تحويل المواصفات التقنية والمزايا إلى نصوص إعلانية جذابة مع شعار وهاشتاجات.',
    systemInstruction:
      'أنت كاتب إعلانات محترف (Copywriter). قم بصياغة نصوص تسويقية جذابة تناسب منصات التواصل الاجتماعي مع مراعاة النبرة والجمهور المستهدف.',
    inputColumns: [
      { id: 'in_product', name: 'اسم المنتج (Product Name)', type: 'text' },
      { id: 'in_features', name: 'أبرز المواصفات (Key Features)', type: 'text' },
      { id: 'in_tone', name: 'النبرة المطلوبة (Tone)', type: 'text' },
    ],
    outputColumns: [
      { id: 'out_hook', name: 'الجملة الافتتاحية (Hook)', type: 'text' },
      { id: 'out_copy', name: 'النص الإعلاني (Main Copy)', type: 'text' },
      { id: 'out_cta', name: 'الدعوة لاتخاذ إجراء (CTA)', type: 'text' },
    ],
    examples: [
      {
        id: 'ex_1',
        in_product: 'سماعات SoundNova Pro',
        in_features: 'عزل ضوضاء بنسبة 98%، بطارية تدوم 40 ساعة، وزن خفيف مريح للنوم',
        in_tone: 'حماسي وحيوي (Energetic & Modern)',
        out_hook: 'انسَ ضجيج العالم وعش مع موسيقاك في كوكب آخر! 🎧✨',
        out_copy: 'سماعات SoundNova Pro تعزلك تماماً عن أي إزعاج، مع بطارية جبارة ترافقك لأكثر من يوم ونصف بدون شحن!',
        out_cta: 'اطلبها الآن واستمتع بخصم الإطلاق الحصري 20%! 🚀',
      },
      {
        id: 'ex_2',
        in_product: 'برنامج TaskFlow CRM',
        in_features: 'أتمتة المبيعات، تكامل مع واتساب، تقارير أداء لحظية بالذكاء الاصطناعي',
        in_tone: 'احترافي ورسمي (Corporate & Trustworthy)',
        out_hook: 'كيف تضاعف إنتاجية فريق مبيعاتك بنقرة زر واحدة؟',
        out_copy: 'منصة TaskFlow تمكّنك من إدارة صفقاتك وتتبع عملاءك وأتمتة رسائل واتساب دون إضاعة دقيقة واحدة.',
        out_cta: 'ابدأ تجربتك المجانية لمدة 14 يوماً الآن.',
      },
    ],
    testCases: [
      {
        id: 'test_1',
        in_product: 'قهوة أثيوبية ييرغاتشيف مختصة',
        in_features: 'إيحاءات خوخ وياسمين، معالجة مجففة، حمص طازج أسبوعي',
        in_tone: 'دافئ وشاعري (Warm & Poetic)',
      },
      {
        id: 'test_2',
        in_product: 'شاحن GaN بقوة 100 واط مدمج',
        in_features: 'يشحن 4 أجهزة معاً (لابتوب + جوال + ساعة)، حجم أصغر بنسبة 50%',
        in_tone: 'تقني وعملي (Geek & Productivity)',
      },
    ],
    model: 'gemini-3.8-flash',
    thinkingLevel: 'LOW',
    jsonMode: false,
  },
  {
    id: 'json-extractor',
    title: 'استخراج البيانات المهيكلة (Entity & Spec Extractor to JSON)',
    description: 'استخراج الكيانات والبيانات الحسابية من النصوص غير المنظمة في هيئة JSON منضبط.',
    systemInstruction:
      'Extract structured operational details from the raw invoices, receipts, or shipping receipts into precise JSON attributes.',
    inputColumns: [
      { id: 'in_raw_text', name: 'النص الخام (Raw Text)', type: 'text' },
    ],
    outputColumns: [
      { id: 'out_json_data', name: 'البيانات المستخرجة (JSON Output)', type: 'json' },
    ],
    examples: [
      {
        id: 'ex_1',
        in_raw_text:
          'فاتورة ضريبية رقم 98234 صادرة من مؤسسة الآفاق للتقنية لصالح شركة البناء الحديث. التاريخ 12 مايو 2026. تضمنت 3 حواسيب Dell بسعر 12,000 ريال، و5 شاشات بسعر 3,500 ريال. الإجمالي قبل الضريبة 15,500 ريال. الضريبة 15%: 2,325 ريال. الإجمالي النهائي 17,825 ريال.',
        out_json_data: JSON.stringify(
          {
            invoice_number: '98234',
            seller: 'مؤسسة الآفاق للتقنية',
            buyer: 'شركة البناء الحديث',
            date: '2026-05-12',
            items: [
              { name: 'حواسيب Dell', quantity: 3, total_price: 12000 },
              { name: 'شاشات', quantity: 5, total_price: 3500 },
            ],
            subtotal: 15500,
            tax_rate: '15%',
            tax_amount: 2325,
            total_amount: 17825,
            currency: 'SAR',
          },
          null,
          2
        ),
      },
    ],
    testCases: [
      {
        id: 'test_1',
        in_raw_text:
          'إشعار شحن من أرامكس بوليصة رقم 4481928374 العميل سارة أحمد، العنوان الرياض حي النرجس شارع عثمان بن عفان. الشحنة تحتوي عطور ومستحضرات تجميل وزن 2.4 كجم. الدفع عند الاستلام بمبلغ 450 ريال.',
      },
    ],
    model: 'gemini-3.8-flash',
    thinkingLevel: 'MEDIUM',
    jsonMode: true,
  },
  {
    id: 'code-explainer',
    title: 'محلل الأكواد وتوثيق الدوال (Code Explainer & Docstrings)',
    description: 'تحليل الأكواد البرمجية، احتساب التعقيد الزمني والمكاني وتوليد تعليقات توثيق قياسية.',
    systemInstruction:
      'You are a senior software architect. Analyze provided functions and provide concise explanation, algorithmic time/space complexity, and standard docstrings.',
    inputColumns: [
      { id: 'in_code', name: 'الكود المصدري (Source Code)', type: 'text' },
      { id: 'in_lang', name: 'لغة البرمجة (Language)', type: 'text' },
    ],
    outputColumns: [
      { id: 'out_summary', name: 'الملخص (Summary)', type: 'text' },
      { id: 'out_complexity', name: 'التعقيد (Big-O Complexity)', type: 'text' },
      { id: 'out_docstring', name: 'التوثيق (Docstring / JSDoc)', type: 'text' },
    ],
    examples: [
      {
        id: 'ex_1',
        in_code: 'function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
        in_lang: 'JavaScript',
        out_summary: 'خوارزمية بحث ثنائي كلاسيكية تبحث عن عنصر مستهدف داخل مصفوفة مرتبة عن طريق تقسيم نطاق البحث إلى النصف في كل دورة.',
        out_complexity: 'Time: O(log n) | Space: O(1)',
        out_docstring: '/**\n * Searches for a target value within a sorted array using binary search.\n * @param {number[]} arr - Sorted array of numbers.\n * @param {number} target - The number to locate.\n * @returns {number} The zero-based index of the target, or -1 if not found.\n */',
      },
    ],
    testCases: [
      {
        id: 'test_1',
        in_code: 'def two_sum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in lookup:\n            return [lookup[diff], i]\n        lookup[num] = i\n    return []',
        in_lang: 'Python',
      },
    ],
    model: 'gemini-3.8-flash',
    thinkingLevel: 'LOW',
    jsonMode: false,
  },
];
