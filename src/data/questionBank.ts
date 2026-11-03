export interface QuizItem {
  question_sv: string;
  question_ar: string;
  options: string[];
  correct_index: number;
  explanation: string;
  category?: string;
}

export const SWEDISH_TAXI_QUESTIONS: QuizItem[] = [
  {
    question_sv: 'Vad är Transportstyrelsens krav gällande prisinformation (jämförpris) på en svensk taxi?',
    question_ar: 'ما هو شرط هيئة النقل السويدية (Transportstyrelsen) بخصوص معلومات الأسعار (السعر المقارن) في سيارة التاكسي؟',
    options: [
      'Jämförpriset ska finnas väl synligt både på fordonets utsida (bakre sidorutan) och invändigt för kunden',
      'Prisinformation krävs enbart om kunden uttryckligen ber om det innan avfärd',
      'Föraren behöver bara informera kunden muntligt om startavgiften',
      'Det räcker att taxameterns display är igång under färden'
    ],
    correct_index: 0,
    explanation: 'Enligt svensk taxilagstiftning måste taxibilar ha gula prisdekaler med jämförpris väl synliga både utvändigt och invändigt så att kunden enkelt kan jämföra priser innan resan påbörjas.',
    category: 'Taxilagstiftning'
  },
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
    explanation: 'Taxiförarlegitimationen måste alltid placeras väl synlig för passagerarna (vanligtvis på instrumentbrädan) så att resenären enkelt kan kontrollera förarens identitet och behörighet.',
    category: 'Taxilagstiftning'
  },
  {
    question_sv: 'Hur många timmars sammanhängande dygnsvila ska en taxiförare i Sverige normalt ha per 24-timmarsperiod?',
    question_ar: 'كم ساعة من الراحة اليومية المتواصلة يجب أن يحصل عليها سائق التاكسي في السويد كقاعدة عامة خلال كل 24 ساعة؟',
    options: [
      'Minst 11 timmars sammanhängande dygnsvila',
      'Minst 6 timmars sammanhängande dygnsvila',
      'Minst 8 timmars sammanhängande dygnsvila',
      'Det finns ingen lagstadgad dygnsvila'
    ],
    correct_index: 0,
    explanation: 'Enligt reglerna för yrkestrafik ska föraren normalt ha minst 11 timmars sammanhängande dygnsvila under varje 24-timmarsperiod för att förhindra trötthet och trafikolyckor.',
    category: 'Kör- och vilotider'
  },
  {
    question_sv: 'Vem bär det juridiska ansvaret för att ett barn under 15 år använder bilbälte eller bilbarnstol i en taxi?',
    question_ar: 'من يتحمل المسؤولية القانونية عن استخدام الطفل الأقل من 15 سنة لحزام الأمان أو مقعد الأطفال في التاكسي؟',
    options: [
      'Taxiföraren har det fulla ansvaret',
      'Vårdnadshavaren/föräldern bär alltid ansvaret ensam',
      'Barnet själv om det fyllt 10 år',
      'Ingen, då taxi är helt undantagen från bältesregler'
    ],
    correct_index: 0,
    explanation: 'Taxiföraren ansvarar enligt svensk lag för att alla passagerare under 15 år är fastspända med godkänd skyddsutrustning anpassad efter längd och vikt.',
    category: 'Trafiksäkerhet'
  },
  {
    question_sv: 'Vad gäller för taxametern om föraren kommer överens med kunden om ett fast pris?',
    question_ar: 'ما هو حكم عداد التاكسي (التاكساميتر) إذا اتفق السائق مع العميل على سعر ثابت محدد مسبقاً؟',
    options: [
      'Taxametern måste ändå vara påslagen och registrera körningen med det avtalade fasta priset',
      'Taxametern stängs av helt för att inte registrera beloppet',
      'Taxametern ställs i pausläge och kvittot skrivs manuellt',
      'Det är förbjudet enligt svensk lag att erbjuda fast pris'
    ],
    correct_index: 0,
    explanation: 'Även om resan sker till fast pris måste taxametern vara påslagen och registrera körningen korrekt mot redovisningscentralen.',
    category: 'Taxameter'
  },
  {
    question_sv: 'Vad är en redovisningscentral (BTP) i svensk taxiverksamhet?',
    question_ar: 'ما هي محطة الرقابة الحسابية (BTP / Redovisningscentral) في قطاع التاكسي بالسويد؟',
    options: [
      'Ett auktoriserat system som tar emot och lagrar taxameteruppgifter trådlöst för Skatteverkets kontroll',
      'Ett statligt kontor där taxiförare måste lämna in papperskvitton varje vecka',
      'En bankdosa som föraren använder för Swish-betalningar',
      'En privat fackförening för taxichaufförer'
    ],
    correct_index: 0,
    explanation: 'Enligt lag måste alla taxametrar överföra taxameteruppgifter digitalt till en godkänd redovisningscentral för skattekontroll.',
    category: 'Taxameter'
  },
  {
    question_sv: 'När måste en taxiförare senast ta en rast under ett pågående arbetspass?',
    question_ar: 'متى يجب على سائق التاكسي أخذ استراحة على أبعد تقدير أثناء فترة العمل والقيادة المستمرة؟',
    options: [
      'Senast efter 4,5 timmars sammanlagd körtid ska föraren ta minst 45 minuters rast',
      'Efter 8 timmars körning',
      'Föraren bestämmer helt själv och ingen tidsgräns finns',
      'Endast om passageraren godkänner pausen'
    ],
    correct_index: 0,
    explanation: 'Efter 4,5 timmars körtid ska föraren ta en sammanhängande rast på minst 45 minuter, eller delas upp i 15 + 30 minuter.',
    category: 'Kör- och vilotider'
  },
  {
    question_sv: 'Vad är ett krav för att få taxiförarlegitimation (TFL) i Sverige?',
    question_ar: 'ما هو أحد الشروط الأساسية للحصول على رخصة سائق التاكسي (TFL) في السويد؟',
    options: [
      'Man ska ha fyllt 21 år och haft körkort med behörighet B oavbrutet i minst två år',
      'Man ska ha fyllt 18 år och haft B-körkort i sex månader',
      'Det krävs körkort med behörighet C (tung lastbil)',
      'Man måste vara svensk medborgare i minst fem år'
    ],
    correct_index: 0,
    explanation: 'Kravet är minst 21 års ålder samt att ha innehaft körkort B oavbrutet under de senaste två åren, samt godkända prov och läkarundersökning.',
    category: 'Taxilagstiftning'
  },
  {
    question_sv: 'Vad gäller vid körning av färdtjänstresenärer med rullstol i taxi?',
    question_ar: 'ما هي القاعدة الأساسية عند نقل ركاب خدمة النقل الخاص (Färdtjänst) ذوي الكراسي المتحركة؟',
    options: [
      'Föraren har ansvar för att rullstolen förankras korrekt med godkända fästanordningar och att resenären bär bälte',
      'Resenären eller assistenten ansvarar helt för förankringen',
      'Rullstolen behöver bara bromsas utan extra spännband',
      'Färdtjänst får inte köras med vanliga taxibilar under några omständigheter'
    ],
    correct_index: 0,
    explanation: 'Föraren har det fulla ansvaret för att rullstolen är säkert fastspänd i fordonets fästen och att resenären har trepunktsbälte.',
    category: 'Passagerarbemötande'
  },
  {
    question_sv: 'Vad innebär den gula nummerskylten på ett fordon i Sverige?',
    question_ar: 'ماذا تعني لوحة الأرقام الصفراء (Gula nummerskyltar) على المركبة في السويد؟',
    options: [
      'Att fordonet är registrerat för yrkesmässig taxitrafik med taxameter',
      'Att bilen ägs av staten eller polisen',
      'Att fordonet har körförbud eller är avställt',
      'Att fordonet är en elbil med miljöbonus'
    ],
    correct_index: 0,
    explanation: 'Taxifordon med taxametertrafik tilldelas gula registreringsskyltar med bokstaven T i slutet av Transportstyrelsen.',
    category: 'Fordonskännedom'
  },
  {
    question_sv: 'Vilken handling måste föraren lämna till kunden efter en avslutad taxiresa?',
    question_ar: 'ما هي الوثيقة الإلزامية التي يجب على السائق تسليمها للعميل فور انتهاء رحلة التاكسي؟',
    options: [
      'Ett maskinellt utskrivet kvitto från taxametern eller godkänt digitalt kvitto',
      'Ett handskrivet papperskvitto från ett vanligt block',
      'Bara ett muntligt tack om kunden inte ber om kvitto',
      'Kvitto behövs bara om resan överstiger 1000 kronor'
    ],
    correct_index: 0,
    explanation: 'Enligt Transportstyrelsens föreskrifter är föraren alltid skyldig att erbjuda kunden ett korrekt taxameterutskrivet kvitto.',
    category: 'Taxameter'
  },
  {
    question_sv: 'Hur länge ska en taxiförarlegitimation (TFL) vara giltig innan den måste förnyas?',
    question_ar: 'ما هي مدة صلاحية بطاقة رخصة سائق التاكسي (TFL) قبل أن تتطلب التجديد؟',
    options: [
      'Den är giltig i 5 år och kräver därefter förnyelse med läkarintyg',
      'Den gäller på livstid utan förnyelse',
      'Den måste förnyas varje år',
      'Den gäller i 10 år precis som vanligt B-körkort'
    ],
    correct_index: 0,
    explanation: 'Taxiförarlegitimationen gäller i fem år från utfärdandet och förnyas efter hälsoprövning.',
    category: 'Taxilagstiftning'
  },
  {
    question_sv: 'Får en taxiförare neka en blind person med ledarhund att åka med i taxin?',
    question_ar: 'هل يحق لسائق التاكسي في السويد رفض نقل شخص كفيف يرافقه كلب إرشاد (Ledarhund)؟',
    options: [
      'Nej, enligt diskrimineringslagen och transportregler ska ledarhund alltid tillåtas utan extra avgift',
      'Ja, föraren får alltid neka djur oavsett anledning',
      'Endast om hunden sitter i bagageutrymmet',
      'Ja, men kunden måste betala dubbelt pris'
    ],
    correct_index: 0,
    explanation: 'Ledarhundar och assistanshundar får inte nekas och ska medfölja resenären kostnadsfritt i kupén.',
    category: 'Passagerarbemötande'
  },
  {
    question_sv: 'Vad är högsta tillåtna promillehalt av alkohol i blodet för taxiförare i tjänst?',
    question_ar: 'ما هي أعلى نسبة كحول مسموح بها في الدم لسائق التاكسي أثناء العمل في السويد؟',
    options: [
      '0,2 promille enligt allmän svensk trafiklagstiftning (men i praktiken gäller nolltolerans 0,0)',
      '0,5 promille',
      '0,8 promille',
      '1,0 promille'
    ],
    correct_index: 0,
    explanation: 'Sverige har en strikt gräns på 0,2 promille för rattfylleri, och i yrkesmässig taxitrafik tillämpar alla seriösa bolag och upphandlare absolut nolltolerans (0,0).',
    category: 'Trafiksäkerhet'
  },
  {
    question_sv: 'Vad innebär begreppet "kabotage" inom yrkestrafik?',
    question_ar: 'ماذا يعني مصطلح "Cabotage / كابوتاغ" في قطاع النقل البري؟',
    options: [
      'Att ett utländskt transportföretag utför inrikestransporter i ett annat land än där företaget är etablerat',
      'Att taxametern kopplas till en utländsk valuta',
      'Att köra taxi nattetid i skiftarbete',
      'Att transportera farligt gods i taxi'
    ],
    correct_index: 0,
    explanation: 'Kabotage innebär att en utländsk transportör utför transporter inom Sveriges gränser under särskilda EU-regler.',
    category: 'Taxilagstiftning'
  }
];

export const CIVIC_QUIZ_QUESTIONS: QuizItem[] = [
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
    explanation: 'Sveriges statsskick bygger på fyra grundlagar: Regeringsformen, Successionsordningen, Tryckfrihetsförordningen samt Yttrandefrihetsgrundlagen.',
    category: 'Grundlagar & Demokrati'
  },
  {
    question_sv: 'Hur många ledamöter sitter i Sveriges riksdag?',
    question_ar: 'كم عدد النواب في البرلمان السويدي (Riksdagen)؟',
    options: ['349 ledamöter', '250 ledamöter', '400 ledamöter', '300 ledamöter'],
    correct_index: 0,
    explanation: 'Sveriges riksdag består av 349 ledamöter som väljs i allmänna val vart fjärde år.',
    category: 'Statsskick'
  },
  {
    question_sv: 'Vem är Sveriges statschef enligt Regeringsformen?',
    question_ar: 'من هو رئيس الدولة (Statschef) في السويد وفق الدستور؟',
    options: [
      'Kungen (eller drottningen) som monark, men med endast representativa och ceremoniella uppgifter',
      'Statsministern som har den verkställande makten',
      'Riksdagens talman',
      'Högsta domstolens ordförande'
    ],
    correct_index: 0,
    explanation: 'Sverige är en parlamentarisk monarki där kungen är statschef utan politisk makt.',
    category: 'Statsskick'
  },
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
    explanation: 'Allemansrätten ger alla människor tillgång till naturen med mottot "inte störa - inte förstöra".',
    category: 'Kultur & Samhälle'
  },
  {
    question_sv: 'Vad är kommunernas huvudsakliga ansvarsområde i Sverige?',
    question_ar: 'ما هي المسؤولية الأساسية للبلديات (Kommuner) في السويد؟',
    options: [
      'Skola, förskola, äldreomsorg, renhållning och stadsplanering',
      'Sjukvård, sjukhus och kollektivtrafik (detta sköts av regionerna)',
      'Försvarsmakten och utrikespolitiken',
      'Polisväsendet och domstolarna'
    ],
    correct_index: 0,
    explanation: 'Kommunerna ansvarar för den lokala servicen: skola, äldreomsorg, socialtjänst och vatten/avfall.',
    category: 'Samhällsorganisation'
  },
  {
    question_sv: 'Vad är Regionernas (tidigare landstingens) främsta uppgift?',
    question_ar: 'ما هي المهمة الرئيسية لمجالس الأقاليم (Regioner) في السويد؟',
    options: [
      'Hälso- och sjukvård, tandvård och regional kollektivtrafik',
      'Att bygga förskolor och grundskolor',
      'Att driva tullverket och gränskontrollen',
      'Att fastställa statliga skattesatser'
    ],
    correct_index: 0,
    explanation: 'Sveriges regioner har som främsta uppdrag att ansvara för sjukhus, primärvård samt kollektivtrafik.',
    category: 'Samhällsorganisation'
  },
  {
    question_sv: 'Vad innebär offentlighetsprincipen i Sverige?',
    question_ar: 'ماذا يعني "مبدأ العلانية والشفافية" (Offentlighetsprincipen) في السويد؟',
    options: [
      'Att allmänheten och journalister har rätt att ta del av allmänna handlingar hos myndigheter',
      'Att alla politiska möten måste sändas i statlig TV',
      'Att privatpersoners bankkonton är öppna för grannar',
      'Att staten har rätt att övervaka medborgarnas privata brev'
    ],
    correct_index: 0,
    explanation: 'Offentlighetsprincipen är en hörnsten i svensk demokrati och ger rätt till insyn i myndigheternas arbete.',
    category: 'Grundlagar & Demokrati'
  },
  {
    question_sv: 'Hur ofta hålls ordinarie val till riksdag, regioner och kommuner i Sverige?',
    question_ar: 'كم مرة تُقام الانتخابات العامة للبرلمان والأقاليم والبلديات في السويد؟',
    options: [
      'Vart fjärde år, den andra söndagen i september',
      'Vart femte år',
      'Vart tredje år',
      'Varje år för olika nivåer'
    ],
    correct_index: 0,
    explanation: 'Allmänna val hålls vart fjärde år i september, då medborgarna röstar till riksdag, region och kommun.',
    category: 'Statsskick'
  }
];
