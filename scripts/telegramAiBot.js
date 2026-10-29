/**
 * ZAFARON RESTAURANT & LOUNGE - TELEGRAM AI BOT AUTO-RESPONDER
 * Powered by Google Gemini AI & Built-in Smart Restaurant Brain
 * 
 * Ushbu xizmat Telegram botiga yozilgan barcha xabarlarga avtomatik
 * sun'iy intellekt (Gemini AI yoki Smart Engine) yordamida javob qaytaradi.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read .env file for Bot Token & Keys
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        env[key] = val;
      }
    }
  }
  return env;
}

const env = loadEnv();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || env.VITE_TELEGRAM_BOT_TOKEN || '8745462281:AAF5BD8D70egcA30oGnqdpLjWjwwmGcdHZ8';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🤖 ZAFARON RESTAURANT TELEGRAM AI BOT IS RUNNING');
console.log(`🔑 Bot Token: ${BOT_TOKEN ? BOT_TOKEN.slice(0, 15) + '...' : 'YO\'Q'}`);
console.log(`✨ Gemini AI: ${GEMINI_API_KEY ? 'Faol (API Key mavjud)' : 'Smart Restaurant Engine (O\'rnatilgan sun\'iy intellekt)'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 1.1 User Language Storage (Persists chosen language per user: 'uz' | 'ru' | 'en')
const LANG_STORAGE_FILE = path.join(rootDir, 'data', 'user_languages.json');

function loadUserLanguages() {
  try {
    if (fs.existsSync(LANG_STORAGE_FILE)) {
      return JSON.parse(fs.readFileSync(LANG_STORAGE_FILE, 'utf-8'));
    }
  } catch { }
  return {};
}

const userLanguages = loadUserLanguages();

function saveUserLanguage(chatId, lang) {
  try {
    userLanguages[chatId] = lang;
    const dir = path.dirname(LANG_STORAGE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LANG_STORAGE_FILE, JSON.stringify(userLanguages, null, 2), 'utf-8');
  } catch { }
}

// 2. Knowledge Base for Zafaron Restaurant
const RESTAURANT_KNOWLEDGE = `
Restoran: "Zafaron Restaurant & Lounge" (Toshkent)
Ta'rif: Hashamatli milliy va Yevropa taomlari restorani, oilaviy va tantanalar maskani.
Manzil: Toshkent shahar, Amir Temur shoh ko'chasi, 45-uy. (Markaziy maydon ro'parasida, bepul qulay avtoturargoh mavjud).
Ish tartibi: Har kuni dam olish kunlarisiz, soat 10:00 dan 23:00 gacha.
Telefonlar: +998 (71) 200-88-99, +998 (90) 123-45-67
Sayt / Havola: https://zafaron.uz

Zallar va muhit:
- Asosiy Hashamatli Zal: Jonli musiqa (Juma va Shanba 19:30 dan boshlab), romantik favvora.
- Ochiq Havo Terrasasi: Panoramali shahar manzarasi, yozgi salqin havo.
- VIP Oltin Xona: 10-14 kishilik alohida xonalar, shaxsiy ofitsiant, to'liq shaxsiy muhit. Depozit / Bron puli: 200,000 - 300,000 so'm (Umumiy hisobdan to'liq chegiriladi).
- Banket zali: 150 kishigacha bo'lgan to'y, yubiley va korporativ tadbirlar uchun.

Menyu va mashhur taomlar:
- Zafaron Shohona Oshi — 58,000 so'm (Mayin lahm go'sht, qazi, bedana tuxum va tabiiy za'faron)
- Qo'y go'shti kabobi — 42,000 so'm
- Lyulya kabob — 38,000 so'm
- Tovuq kabobi — 34,000 so'm
- Tomahawk Steyk — 320,000 so'm (Marmar mol go'shti, rozmarin bilan olovda)
- Ribeye Steyk — 260,000 so'm
- Filet Mignon — 240,000 so'm
- Qozon kabob — 72,000 so'm
- Manti (5 dona) — 48,000 so'm
- Achchiq-chuchuk salati — 22,000 so'm
- Zafaron Burrata salati — 65,000 so'm
- Turkcha Paxlava — 45,000 so'm
- Fondan shokoladli — 40,000 so'm
- Za'faronli Shohona Choy — 28,000 so'm
- Yangi siqilgan apelsin sharbati — 32,000 so'm

Xizmatlar:
- Yetkazib berish (Dostavka): Toshkent bo'ylab 30-45 daqiqada issiq holda yetkaziladi.
- Stol bron qilish: Sayt orqali yoki telefon orqali bepul amalga oshiriladi.
- To'lov usullari: Naqd pul, Humo, Uzcard, Visa, MasterCard, Click, Payme.
`;

// 3. Built-in Smart Fallback Engine (Answers instantly in Uzbek, Russian, or English)
function generateSmartRestaurantAnswer(userText, userLang = 'uz') {
  const q = (userText || '').toLowerCase().trim();

  // Language selection request
  if (
    q === '/start' ||
    q === '/til' || q === '/lang' || q === '/language' ||
    q === 'til' || q === 'tillar' || q === 'til tanlash' || q === 'til tanla' ||
    q === 'tilni tanlash' || q === '🌐 tilni tanlash' || q === '🌐 выбор языка' || q === '🌐 language' ||
    q === 'язык' || q === 'выбор языка' || q === 'сменить язык' ||
    q === 'language' || q === 'choose language'
  ) {
    return '__LANGUAGE_PROMPT__';
  }

  // Detect Russian
  const isRussian = userLang === 'ru' || (/[а-яё]/i.test(q) && (
    q.includes('привет') || q.includes('здравствуй') || q.includes('меню') ||
    q.includes('цена') || q.includes('плов') || q.includes('шашлык') ||
    q.includes('где') || q.includes('адрес') || q.includes('время') ||
    q.includes('стол') || q.includes('бронь') || q.includes('доставка') ||
    q.includes('телефон') || q.includes('халяль') || q.includes('как дела') ||
    q.includes('общение')
  ));

  // Detect English
  const isEnglish = userLang === 'en' || (
    q.includes('hello') || q.includes('hi ') || q === 'hi' || q.includes('hey') ||
    q.includes('menu') || q.includes('price') || q.includes('steak') ||
    q.includes('kebab') || q.includes('where') || q.includes('address') ||
    q.includes('hours') || q.includes('book') || q.includes('table') ||
    q.includes('delivery') || q.includes('halal') || q.includes('chat')
  );

  // 0. Direct Hall Choice (1, 2, 3, 4) - MUST BE FIRST so typing "1" always returns Hall 1!
  if (
    q === '1' || q === '1.' || q === '1-zal' || q === '1 zal' || q === 'zal 1' ||
    q === 'bir' || q.includes('asosiy zal') || q.startsWith('1 ') || q === 'zal_1' || q.includes('главный')
  ) {
    if (isRussian) {
      return (
        `🏛 <b>1. Выбран Главный Роскошный Зал!</b>\n\n` +
        `• Живая музыка (каждую пятницу и субботу с 19:30)\n` +
        `• Роскошный романтический фонтан\n` +
        `• Праздничная и уютная атмосфера\n\n` +
        `Для бронирования стола позвоните:\n` +
        `📞 <b>+998 (71) 200-88-99</b> или <b>+998 (90) 123-45-67</b>\n\n` +
        `<i>Мы подберем для вас лучший стол! ✨</i>`
      );
    }
    if (isEnglish) {
      return (
        `🏛 <b>1. Main Luxury Hall selected!</b>\n\n` +
        `• Live music (Every Friday & Saturday from 19:30)\n` +
        `• Romantic fountain & festive atmosphere\n\n` +
        `To reserve a table, call our manager:\n` +
        `📞 <b>+998 (71) 200-88-99</b> or <b>+998 (90) 123-45-67</b>\n\n` +
        `<i>We will prepare the best table for you! ✨</i>`
      );
    }
    return (
      `🏛 <b>1. Asosiy Hashamatli Zal tanlandi!</b>\n\n` +
      `• Jonli musiqa (Har Juma va Shanba 19:30 dan)\n` +
      `• Shohona romantik favvora\n` +
      `• Bayramona va shinam stol joylashuvi\n\n` +
      `Ushbu zalda stolni band qilish uchun telefon qiling:\n` +
      `📞 <b>+998 (71) 200-88-99</b> yoki <b>+998 (90) 123-45-67</b>\n\n` +
      `<i>Administratorimiz siz uchun eng yaxshi joyni bron qilib beradi! ✨</i>`
    );
  }
  if (
    q === '2' || q === '2.' || q === '2-zal' || q === '2 zal' || q === 'zal 2' ||
    q === 'ikki' || q.includes('terrasa') || q.startsWith('2 ') || q === 'zal_2' || q.includes('терраса')
  ) {
    if (isRussian) {
      return (
        `🌆 <b>2. Выбрана Панорамная Терраса!</b>\n\n` +
        `• Панорамный вид на город\n` +
        `• Летняя прохлада и свежий воздух\n` +
        `• Атмосфера для романтического ужина\n\n` +
        `Для бронирования стола:\n` +
        `📞 <b>+998 (71) 200-88-99</b> или <b>+998 (90) 123-45-67</b>`
      );
    }
    if (isEnglish) {
      return (
        `🌆 <b>2. Open Air Terrace selected!</b>\n\n` +
        `• Panoramic city view of Tashkent\n` +
        `• Fresh breeze and open atmosphere\n\n` +
        `To book a table:\n` +
        `📞 <b>+998 (71) 200-88-99</b> or <b>+998 (90) 123-45-67</b>`
      );
    }
    return (
      `🌆 <b>2. Ochiq Havo Terrasasi tanlandi!</b>\n\n` +
      `• Toshkent shahrining keng panoramasi\n` +
      `• Yozgi salqin shabboda va toza havo\n` +
      `• Romantik oqshomlar uchun ajoyib muhit\n\n` +
      `Terrasada joy band qilish uchun:\n` +
      `📞 <b>+998 (71) 200-88-99</b> yoki <b>+998 (90) 123-45-67</b>`
    );
  }
  if (
    q === '3' || q === '3.' || q === '3-zal' || q === '3 zal' || q === 'zal 3' ||
    q === 'uch' || q.includes('vip') || q.startsWith('3 ') || q === 'zal_3'
  ) {
    if (isRussian) {
      return (
        `👑 <b>3. Выбран VIP Золотой Зал!</b>\n\n` +
        `• Отдельный роскошный зал на 10-14 персон\n` +
        `• Персональный официант и премиум сервис\n` +
        `• 💰 <b>VIP Депозит / Бронь: 200,000 сум</b> (VIP-2 Президент: 300,000 сум) — сумма полностью списывается в счет заказа\n\n` +
        `Для бронирования VIP зала:\n` +
        `📞 <b>+998 (71) 200-88-99</b> или <b>+998 (90) 123-45-67</b>`
      );
    }
    if (isEnglish) {
      return (
        `👑 <b>3. VIP Gold Room selected!</b>\n\n` +
        `• Private luxury room for 10-14 guests\n` +
        `• Personal waiter service & exclusive ambience\n` +
        `• 💰 <b>VIP Room Deposit: 200,000 UZS</b> (VIP-2 Presidential: 300,000 UZS) — credited toward dining bill\n\n` +
        `To reserve VIP room:\n` +
        `📞 <b>+998 (71) 200-88-99</b> or <b>+998 (90) 123-45-67</b>`
      );
    }
    return (
      `👑 <b>3. VIP Oltin Xona tanlandi!</b>\n\n` +
      `• 10-14 kishilik to'liq alohida qulay xona\n` +
      `• Shaxsiy ofitsiant xizmati va maxsus servis\n` +
      `• 💰 <b>VIP Bron Depoziti: 200,000 so'm</b> (VIP-2 Prezident: 300,000 so'm) — bu to'lov kechki ovqat hisobidan to'liq chegiriladi\n` +
      `• Muzokaralar, oilaviy tadbirlar va maxfiy uchrashuvlar uchun\n\n` +
      `VIP xonani band qilish uchun:\n` +
      `📞 <b>+998 (71) 200-88-99</b> yoki <b>+998 (90) 123-45-67</b>`
    );
  }
  if (
    q === '4' || q === '4.' || q === '4-zal' || q === '4 zal' || q === 'zal 4' ||
    q === 'to\'rt' || q === 'tort' || q.includes('banket') || q.startsWith('4 ') || q === 'zal_4' || q.includes('банкет')
  ) {
    if (isRussian) {
      return (
        `🎉 <b>4. Выбран Банкетный Зал!</b>\n\n` +
        `• Торжества, свадьбы и юбилеи до 150 персон\n` +
        `• Праздничное оформление и банкетное меню\n\n` +
        `Для организации банкета:\n` +
        `📞 <b>+998 (71) 200-88-99</b> или <b>+998 (90) 123-45-67</b>`
      );
    }
    if (isEnglish) {
      return (
        `🎉 <b>4. Banquet Hall selected!</b>\n\n` +
        `• Weddings and celebrations up to 150 guests\n\n` +
        `To organize a banquet:\n` +
        `📞 <b>+998 (71) 200-88-99</b> or <b>+998 (90) 123-45-67</b>`
      );
    }
    return (
      `🎉 <b>4. Banket Zali tanlandi!</b>\n\n` +
      `• 150 kishigacha bo'lgan to'y, yubiley va korporativ tantanalar\n` +
      `• Maxsus shohona taomnoma va tantanali bezatish\n\n` +
      `Banket tashkil qilish uchun:\n` +
      `📞 <b>+998 (71) 200-88-99</b> yoki <b>+998 (90) 123-45-67</b>`
    );
  }

  // Greetings & casual chat (Conversational AI response, NEVER static bullet templates!)
  if (
    q.includes('salom') ||
    q.includes('salon') ||
    q.includes('salo') ||
    q.includes('salomm') ||
    q.includes('салом') ||
    q.includes('assalom') ||
    q.includes('qale') ||
    q.includes('qalay') ||
    q.includes('yaxshimi') ||
    q.includes('tuzukmi') ||
    q.includes('privet') ||
    q.includes('привет') ||
    q.includes('здравствуй') ||
    q.includes('как дела') ||
    q.includes('hello') ||
    q.includes('hi ') ||
    q === 'hi' ||
    q.includes('hey') ||
    q.includes('hayrli')
  ) {
    if (isRussian || q.includes('привет') || q.includes('здравствуй') || q.includes('как дела')) {
      const isCasualRu = q.includes('как дела') || q.includes('как вы') || q.includes('что нового');
      if (isCasualRu) {
        return (
          `😊 <b>Спасибо, замечательно! Ваше внимание и визит делают мой день ещё лучше!</b>\n\n` +
          `Как ваши дела? Чем я могу помочь вам сегодня в Zafaron Restaurant & Lounge?\n\n` +
          `Могу порекомендовать наши коронные блюда от шеф-повара, подсказать по свободным столикам или ответить на любой ваш вопрос! ✨`
        );
      }
      return (
        `👋 <b>Здравствуйте! Добро пожаловать в Zafaron Restaurant & Lounge!</b>\n\n` +
        `Я ваш персональный AI-консьерж. Очень рад общению с вами!\n\n` +
        `Чем я могу помочь вам сегодня? Хотите забронировать столик на вечер, узнать подробнее о нашем шахском шафрановом плове и сочных стейках, или вам нужна индивидуальная рекомендация? Напишите, я с удовольствием отвечу! 😊✨`
      );
    }
    if (isEnglish) {
      const isCasualEn = q.includes('how are') || q.includes('how do you') || q.includes('whats up');
      if (isCasualEn) {
        return (
          `😊 <b>Thank you, doing wonderful! It is always a pleasure to hear from you!</b>\n\n` +
          `How are you doing today? How can I assist you at Zafaron Restaurant & Lounge?\n\n` +
          `I can recommend our chef's signature dishes, arrange table bookings, or answer any question! ✨`
        );
      }
      return (
        `👋 <b>Hello and a very warm welcome to Zafaron Restaurant & Lounge!</b>\n\n` +
        `I am your personal AI culinary concierge. How may I assist you today?\n\n` +
        `Would you like to reserve a table, explore our royal saffron plov and steaks, or receive a special recommendation? Feel free to ask anything! 😊✨`
      );
    }
    const isFriendlyCasual = q.includes('qale') || q.includes('qalay') || q.includes('yaxshimi') || q.includes('tuzukmi');
    if (isFriendlyCasual) {
      return (
        `😊 <b>Rahmat, ajoyib! Sizning e'tiboringiz va yozganingiz kayfiyatimni yanada ko'tardi!</b>\n\n` +
        `O'zingiz yaxshimisiz, ishlaringiz tinchmi? Zafaron restoranida bugun sizga qanday shohona taom yoki qulay xizmat ulashishim mumkin? 😊🍽`
      );
    }
    return (
      `👋 <b>Va alaykum assalom!</b>\n\n` +
      `<b>Zafaron Restaurant & Lounge'ga xush kelibsiz!</b> Siz bilan suhbatlashishdan juda mamnunman.\n\n` +
      `Bugun sizga qanday yordam bera olaman? Shohona taomlarimiz, bugungi oqshom dasturi yoki stol band qilish bo'yicha savollaringiz bormi? Xohlagan savolingizni bemalol yozing, bajonidil yordam beraman! 😊✨`
    );
  }

  // Osh / Palov
  if (q.includes('osh') || q.includes('palov') || q.includes('plov') || q.includes('плов')) {
    if (isRussian || q.includes('плов')) {
      return (
        `👑 <b>Шахский Шафрановый Плов Zafaron:</b>\n\n` +
        `• Цена: <code>58,000 сум</code>\n` +
        `• Состав: Отборная молодая баранина, рис лазер, казы, перепелиные яйца, желтая морковь и настоящий горный шафран.\n\n` +
        `<i>Для заказа или брони стола: +998 (71) 200-88-99</i>`
      );
    }
    return (
      `👑 <b>Zafaron Shohona Oshi:</b>\n\n` +
      `• Narxi: <code>58,000 so'm</code>\n` +
      `• Tarkibi: Mayin lahm go'sht, sara devzira/lazer guruch, qazi, bedana tuxumi va tabiiy Eron za'faroni bilan damlangan.\n\n` +
      `<i>Buyurtma berish yoki stol band qilish uchun telefon: +998 (71) 200-88-99</i>`
    );
  }

  // Steyk / Go'sht / Shashlik
  if (q.includes('steyk') || q.includes('steak') || q.includes('shashlik') || q.includes('шашлык') || q.includes('стейк') || q.includes('kabob') || q.includes('go\'sht')) {
    if (isRussian || q.includes('стейк') || q.includes('шашлык')) {
      return (
        `🥩 <b>Мясное и Гриль Меню Zafaron:</b>\n\n` +
        `• <b>Томагавк Стейк (1.2 кг):</b> <code>320,000 сум</code>\n` +
        `• <b>Рибай Стейк:</b> <code>260,000 сум</code>\n` +
        `• <b>Филе Миньон:</b> <code>240,000 сум</code>\n` +
        `• <b>Шашлык из баранины:</b> <code>42,000 сум</code>\n` +
        `• <b>Люля кебаб:</b> <code>38,000 сум</code>\n` +
        `• <b>Казан Кабоб:</b> <code>72,000 сум</code>\n\n` +
        `Все мясо 100% Халяль и готовится на углях! ✨`
      );
    }
    return (
      `🥩 <b>Zafaron Go'sht va Gril menyusi:</b>\n\n` +
      `• <b>Tomahawk Steyk (1.2 kg):</b> <code>320,000 so'm</code>\n` +
      `• <b>Ribeye Steyk:</b> <code>260,000 so'm</code>\n` +
      `• <b>Filet Mignon:</b> <code>240,000 so'm</code>\n` +
      `• <b>Qo'y go'shti kabobi:</b> <code>42,000 so'm</code>\n` +
      `• <b>Lyulya kabob:</b> <code>38,000 so'm</code>\n` +
      `• <b>Qozon kabob:</b> <code>72,000 so'm</code>\n\n` +
      `Go'shtlarimiz 100% halol va maxsus cho'g'da pishiriladi! ✨`
    );
  }

  // 2. Taomnoma / Menyu
  if (q === '/menu' || q === '/menyu' || q.includes('taomnoma') || q.includes('menyu') || q.includes('menu') || q.includes('меню') || q.includes('ovqat') || q.includes('taom')) {
    if (isRussian || q.includes('меню')) {
      return (
        `🍽 <b>МЕНЮ РЕСТОРАНА ZAFARON:</b>\n\n` +
        `🍲 <b>Национальные блюда:</b>\n` +
        `• Шахский Плов с шафраном — <code>58,000 сум</code>\n` +
        `• Казан Кабоб из баранины — <code>72,000 сум</code>\n` +
        `• Сочные Манты (5 шт.) — <code>48,000 сум</code>\n\n` +
        `🥩 <b>Стейки и Гриль:</b>\n` +
        `• Томагавк Стейк (1.2 кг) — <code>320,000 сум</code>\n` +
        `• Рибай Стейк — <code>260,000 сум</code>\n` +
        `• Филе Миньон — <code>240,000 сум</code>\n` +
        `• Шашлык из баранины — <code>42,000 сум</code>\n` +
        `• Люля кебаб — <code>38,000 сум</code>\n\n` +
        `🥗 <b>Салаты и Десерты:</b>\n` +
        `• Буррата с заатаром — <code>65,000 сум</code>\n` +
        `• Турецкая Пахлава — <code>45,000 сум</code>\n` +
        `• Чай с горным шафраном — <code>28,000 сум</code>\n\n` +
        `✨ <i>Все блюда 100% Халяль!</i>\n` +
        `📞 Телефон для заказа: <b>+998 (71) 200-88-99</b>`
      );
    }
    return (
      `🍽 <b>ZAFARON RESTAURANT & LOUNGE TAOMNOMASI:</b>\n\n` +
      `🍲 <b>Shohona Milliy Taomlar:</b>\n` +
      `• <b>Zafaron Shohona Oshi:</b> <code>58,000 so'm</code>\n` +
      `• <b>Qozon Kabob:</b> <code>72,000 so'm</code>\n` +
      `• <b>Shohona Manti (5 dona):</b> <code>48,000 so'm</code>\n\n` +
      `🥩 <b>Gril va Steyklar:</b>\n` +
      `• <b>Tomahawk Steyk (1.2 kg):</b> <code>320,000 so'm</code>\n` +
      `• <b>Ribeye Steyk:</b> <code>260,000 so'm</code>\n` +
      `• <b>Filet Mignon:</b> <code>240,000 so'm</code>\n` +
      `• <b>Qo'y go'shti kabobi:</b> <code>42,000 so'm</code>\n` +
      `• <b>Lyulya kabob:</b> <code>38,000 so'm</code>\n\n` +
      `🥗 <b>Salat va Shirinliklar:</b>\n` +
      `• <b>Zafaron Burrata:</b> <code>65,000 so'm</code>\n` +
      `• <b>Turkcha Paxlava:</b> <code>45,000 so'm</code>\n` +
      `• <b>Za'faronli Shohona Choy:</b> <code>28,000 so'm</code>\n\n` +
      `✨ <i>Barcha go'shtlarimiz 100% Halol!</i>\n` +
      `📞 Buyurtma va yetkazib berish: <b>+998 (71) 200-88-99</b>`
    );
  }

  // 1. Manzil / Joylashuv / Lokatsiya (Bizning manzilimiz)
  if (q === '/manzil' || q.includes('bizning manzilimiz') || q.includes('manzil') || q.includes('qayerda') || q.includes('lokatsiya') || q.includes('location') || q.includes('adres') || q.includes('адрес') || q.includes('где')) {
    if (isRussian || q.includes('адрес') || q.includes('где')) {
      return (
        `📍 <b>Наш Адрес:</b>\n\n` +
        `г. Ташкент, <b>проспект Амира Темура, 45</b>.\n` +
        `Ориентир: напротив Центрального сквера.\n` +
        `🚗 Для гостей есть бесплатная охраняемая парковка.\n\n` +
        `🗺 <a href="https://maps.google.com/?q=Amir+Temur+Avenue+45+Tashkent">Google Xaritada ko'rish (Google Maps)</a>\n` +
        `📞 Телефон: +998 (71) 200-88-99`
      );
    }
    return (
      `📍 <b>Bizning Manzilimiz:</b>\n\n` +
      `Toshkent shahar, <b>Amir Temur shoh ko'chasi, 45-uy</b>.\n` +
      `Mo'ljal: Markaziy maydon ro'parasida.\n` +
      `🚗 Mehmonlarimiz uchun bepul va keng avtoturargoh mavjud.\n\n` +
      `🗺 <a href="https://maps.google.com/?q=Amir+Temur+Avenue+45+Tashkent">Google Xaritada ko'rish (Google Maps)</a>\n` +
      `📞 Aloqa: <b>+998 (71) 200-88-99</b>`
    );
  }

  // 4. Ish vaqti
  if (q === '/vaqt' || q.includes('ish vaqti') || q.includes('vaqt') || q.includes('ishlaysiz') || q.includes('ochiq') || q.includes('время') || q.includes('режим') || q.includes('hours') || q.includes('time')) {
    if (isRussian || q.includes('время') || q.includes('режим')) {
      return (
        `🕒 <b>Режим Работы Ресторана:</b>\n\n` +
        `• Ежедневно без выходных: <b>с 10:00 до 23:00</b>\n` +
        `• Кухня и доставка принимают заказы до 22:30.\n` +
        `• 🎻 <b>Живая музыка:</b> каждую пятницу и субботу с 19:30!\n\n` +
        `<i>Ждем вас в Zafaron Restaurant & Lounge! ✨</i>`
      );
    }
    return (
      `🕒 <b>Zafaron Restorani Ish Tartibi:</b>\n\n` +
      `• Har kuni dam olish kunlarisiz: <b>10:00 dan 23:00 gacha</b>\n` +
      `• Oshxonamiz va yetkazib berish xizmati 22:30 gacha buyurtma qabul qiladi.\n` +
      `• 🎻 <b>Jonli Musiqa Oqshomi:</b> Har juma va shanba 19:30 dan boshlanadi!\n\n` +
      `<i>Oila a'zolaringiz va qadrdonlaringiz bilan tashrif buyuring! ✨</i>`
    );
  }

  // 3. Stol band qilish
  if (q === '/bron' || q.includes('stol band qilish') || q.includes('bron') || q.includes('stol') || q.includes('joy') || q.includes('бронь') || q.includes('стол') || q.includes('забронировать') || q.includes('table') || q.includes('book')) {
    if (isRussian || q.includes('бронь') || q.includes('стол')) {
      return (
        `🥂 <b>Бронирование Стола в Zafaron:</b>\n\n` +
        `В ресторане доступны залы:\n` +
        `1. <b>Главный Роскошный Зал</b> — Живая музыка, фонтан и праздничная атмосфера\n` +
        `2. <b>Панорамная Терраса</b> — Вечерний вид на Ташкент и свежий воздух\n` +
        `3. <b>VIP Золотые Залы</b> — Приватные залы на 6-14 гостей (Депозит: 200,000 сум, списывается в счет)\n` +
        `4. <b>Банкетный Зал</b> — До 150 персон для торжеств\n\n` +
        `Для бронирования позвоните нашему администратору:\n` +
        `📞 <b>+998 (71) 200-88-99</b> или <b>+998 (90) 123-45-67</b>`
      );
    }
    return (
      `🥂 <b>Stol Band Qilish (Bron):</b>\n\n` +
      `Zafaron restoranida unutilmas shohona oqshomni o'tkazing!\n\n` +
      `🏛 <b>Mavjud Zallarimiz:</b>\n` +
      `1. <b>Asosiy Hashamatli Zal</b> — Jonli musiqa, shohona favvora va bayramona muhit\n` +
      `2. <b>Ochiq Havo Terrasasi</b> — Shahar panoramasi va salqin shabboda\n` +
      `3. <b>VIP Oltin Xona</b> — 10-14 kishilik shaxsiy xona (Depozit: 200,000 so'm, hisobdan to'liq chegiriladi)\n` +
      `4. <b>Banket Zali</b> — 150 kishigacha bo'lgan to'y va tantanalar uchun\n\n` +
      `<i>Zal raqamini (1, 2, 3 yoki 4) yuboring yoki to'g'ridan-to'g'ri administrator bilan bog'laning:</i>\n` +
      `📞 <b>+998 (71) 200-88-99</b>`
    );
  }

  // Yetkazish / Dostavka
  if (q.includes('dostavka') || q.includes('yetkaz') || q.includes('доставка') || q.includes('delivery')) {
    if (isRussian || q.includes('доставка')) {
      return (
        `🛵 <b>Служба Экспресс-Доставки:</b>\n\n` +
        `• Время доставки: <b>30-45 минут</b> по Ташкенту\n` +
        `• Все блюда доставляются в термосумках горячими\n` +
        `• Оплата: Наличными или картой (Click / Payme)\n\n` +
        `Для заказа звоните: <b>+998 (71) 200-88-99</b>`
      );
    }
    return (
      `🛵 <b>Tezkor Yetkazib Berish Xizmati:</b>\n\n` +
      `• Yetkazish vaqti: <b>30-45 daqiqa</b> ichida Toshkent shahar bo'ylab\n` +
      `• Taomlar maxsus termoboxlarda qaynoq holda yetkaziladi\n` +
      `• To'lov: Naqd pul yoki Karta (Click / Payme)\n\n` +
      `Buyurtma berish uchun telefon: <b>+998 (71) 200-88-99</b>`
    );
  }

  // 5. Muloqot / Interactive AI Chat Mode Activation (Triggered by 💬 Muloqot button or command)
  if (
    q === '/muloqot' ||
    q === '💬 muloqot' ||
    q === 'muloqot' ||
    q === 'chat' ||
    q === '💬 chat' ||
    q === 'общение' ||
    q === '💬 общение' ||
    q.includes('muloqot') ||
    q.includes('suhbat')
  ) {
    if (isRussian || q.includes('общение') || q.includes('чат')) {
      return (
        `💬 <b>Zafaron AI — Режим Живого Общения Активирован!</b> 🤖✨\n\n` +
        `Здравствуйте! Я ваш персональный AI-консьерж ресторана <b>Zafaron Restaurant & Lounge</b>.\n\n` +
        `Общайтесь со мной так же свободно, как с реальным консьержем или шеф-поваром! Вы можете задать любой вопрос:\n` +
        `• <i>«Что порекомендуете на романтический ужин?»</i>\n` +
        `• <i>«Сколько стоит ваш фирменный шахский плов?»</i>\n` +
        `• <i>«Во сколько начинается живая музыка и в каком зале?»</i>\n` +
        `• <i>«Как забронировать приватную VIP-комнату?»</i>\n\n` +
        `<i>Я готов к диалогу — напишите ваш вопрос прямо сейчас! 😊👇</i>`
      );
    }
    if (isEnglish) {
      return (
        `💬 <b>Zafaron AI — Live Interactive Chat Activated!</b> 🤖✨\n\n` +
        `Hello! I am your personal AI concierge at <b>Zafaron Restaurant & Lounge</b>.\n\n` +
        `Chat with me freely just like a real personal concierge or head chef! For instance:\n` +
        `• <i>"What do you recommend for dinner tonight?"</i>\n` +
        `• <i>"What are the ingredients in the royal saffron plov?"</i>\n` +
        `• <i>"What time does live music start?"</i>\n` +
        `• <i>"Can I reserve a romantic table for two?"</i>\n\n` +
        `<i>I'm listening — please ask your question or share your request! 😊👇</i>`
      );
    }
    return (
      `💬 <b>Zafaron AI — Jonli Suhbat Rejimi Faollashdi!</b> 🤖✨\n\n` +
      `Assalomu alaykum! Men Zafaron Restaurant & Lounge'ning shaxsiy sun'iy intellekt konsyerjiman.\n\n` +
      `Menga xuddi restoranning bosh administratori yoki tajribali oshpazi bilan gaplashgandek bemalol yozing! Masalan:\n` +
      `• <i>«Bugun kechki ovqat uchun qanday taom tavsiya qilasiz?»</i>\n` +
      `• <i>«Shohona oshingiz narxi qancha va tarkibida nimalar bor?»</i>\n` +
      `• <i>«Jonli musiqa soat nechida boshlanadi?»</i>\n` +
      `• <i>«2 kishilik romantik stol qaysi zalda ma'qul?»</i>\n\n` +
      `<i>Sizni diqqat bilan eshityapman, marhamat xohlagan savolingizni yoki fikringizni yozing! 😊👇</i>`
    );
  }

  // 6. Food Recommendations & Chef's Advice (tavsiya, maslahat, nima yesam, eng mazali, etc.)
  if (
    q.includes('tavsiya') ||
    q.includes('maslahat') ||
    q.includes('nima yesam') ||
    q.includes('nima buyurtma') ||
    q.includes('eng zo\'r') ||
    q.includes('eng zor') ||
    q.includes('eng mazali') ||
    q.includes('qaysi taom') ||
    q.includes('qaysi biri') ||
    q.includes('порекомендуй') ||
    q.includes('что посоветуете') ||
    q.includes('что заказать') ||
    q.includes('что поесть') ||
    q.includes('recommend') ||
    q.includes('suggest') ||
    q.includes('best dish')
  ) {
    if (isRussian) {
      return (
        `👑 <b>Рекомендация Главного Шеф-Повара Zafaron:</b>\n\n` +
        `Для сегодняшнего ужина я настоятельно рекомендую:\n\n` +
        `1. <b>Шахский Шафрановый Плов</b> (58,000 сум) — Отборная баранина, казы, рис лазер и горный шафран. Наш фирменный фаворит!\n` +
        `2. <b>Стейк Рибай или Томагавк</b> — Сочнейшее мраморное мясо на живых углях.\n` +
        `3. <b>Салат Буррата с заатаром</b> (65,000 сум) — Нежнейший сливочный сыр со свежими томатами.\n` +
        `4. <b>Турецкая Пахлава</b> (45,000 сум) с ароматным шафрановым чаем.\n\n` +
        `<i>Для какого повода выбираете блюдо — романтический вечер, встреча с друзьями или семейный обед? Подскажу точнее! 😊</i>`
      );
    }
    return (
      `👑 <b>Zafaron Bosh Oshpazining Maxsus Tavsiyasi:</b>\n\n` +
      `Bugungi tashrifingiz uchun eng sara durdonalarimizni tavsiya qilaman:\n\n` +
      `1. <b>Shohona Za'faron Oshi</b> (58,000 so'm) — Mayin lahm go'sht, qazi, bedana tuxumlari va tabiiy Eron za'faroni bilan damlangan afsonaviy taomimiz!\n` +
      `2. <b>Ribeye yoki Tomahawk Steyki</b> — Qaynoq cho'g'da maxsus marinad bilan pishirilgan shirador go'sht.\n` +
      `3. <b>Zafaron Burrata Salati</b> (65,000 so'm) — Qaymoqli nozik pishloq va pomidorlar uyg'unligi.\n` +
      `4. <b>Turkcha Paxlava</b> (45,000 so'm) — Qatlama xamir va tog' yong'og'i, xushbo'y za'faron choyi bilan.\n\n` +
      `<i>Sizga go'shtli, nozikroq yoki parhezbop taomlar ko'proq yoqadimi? Bemalol ayting, didingizga mosini tanlab beraman! 😊✨</i>`
    );
  }

  // 7. Aloqa / Bog'lanish / Telefon
  if (
    q === '/aloqa' ||
    q.includes("bog'lanish") ||
    q.includes('boglanish') ||
    q.includes('aloqa') ||
    q.includes('telefon') ||
    q.includes('nomer') ||
    q.includes('kontakt') ||
    q.includes('phone') ||
    q.includes('телефон') ||
    q.includes('номер') ||
    q.includes('связь')
  ) {
    if (isRussian || q.includes('телефон') || q.includes('связь')) {
      return (
        `📞 <b>Контакты Zafaron Restaurant & Lounge:</b>\n\n` +
        `👤 <b>Связь с администрацией:</b>\n` +
        `• Главный администратор: <b>+998 (71) 200-88-99</b>\n` +
        `• Дополнительный / Бронь: <b>+998 (90) 123-45-67</b>\n` +
        `• Telegram: @zafaron_admin\n` +
        `• Адрес: г. Ташкент, проспект Амира Темура, 45\n\n` +
        `<i>Мы всегда рады вашему визиту! 😊</i>`
      );
    }
    return (
      `📞 <b>Zafaron Restaurant Aloqa Ma'lumotlari:</b>\n\n` +
      `👤 <b>Administrator bilan aloqa:</b>\n` +
      `• Bosh administrator: <b>+998 (71) 200-88-99</b>\n` +
      `• Qo'shimcha aloqa / Bron: <b>+998 (90) 123-45-67</b>\n` +
      `• Telegram administrator: @zafaron_admin\n` +
      `• Manzil: Toshkent sh., Amir Temur shoh ko'chasi, 45-uy\n\n` +
      `<i>Har qanday savolingiz bo'lsa, xursandchilik bilan javob beramiz! 😊</i>`
    );
  }

  // 8. Romantika / Sevishganlar / Uchrashuv
  if (
    q.includes('romantik') ||
    q.includes('uchrashuv') ||
    q.includes('qiz bilan') ||
    q.includes('ayolim bilan') ||
    q.includes('svidanie') ||
    q.includes('свидание') ||
    q.includes('романти') ||
    q.includes('date') ||
    q.includes('couple')
  ) {
    if (isRussian) {
      return (
        `🌹 <b>Идеальный Романтический Вечер в Zafaron:</b>\n\n` +
        `Для романтического свидания рекомендуем:\n` +
        `• <b>Панорамная Терраса</b> или уютный столик возле фонтана в Главном зале\n` +
        `• Легкая живая музыка, свечи и утонченная атмосфера\n` +
        `• Идеальное меню: Филе Миньон, Салат Буррата и фирменный десерт Fondant\n\n` +
        `Забронировать романтический столик: <b>+998 (71) 200-88-99</b> ✨`
      );
    }
    return (
      `🌹 <b>Zafaron'da Unutilmas Romantik Oqshom:</b>\n\n` +
      `Sevimli insoningiz bilan ajoyib uchrashuv uchun eng yaxshi tanlov:\n` +
      `• <b>Ochiq Havo Terrasasi</b> yoki Asosiy zalimizdagi favvora yonidagi sokin stol\n` +
      `• Shamlar yog'dusi, jonli skripka musiqasi va sokin hashamatli muhit\n` +
      `• Tavsiya taomlar: Filet Mignon, Zafaron Burrata salati va shokoladli Fondan\n\n` +
      `Maxsus bezatilgan stolni oldindan band qilish uchun telefon:\n` +
      `📞 <b>+998 (71) 200-88-99</b> ✨`
    );
  }

  // 9. Oila va bolalar / Family & Kids
  if (
    q.includes('oila') ||
    q.includes('bolalar') ||
    q.includes('farzand') ||
    q.includes('deti') ||
    q.includes('семь') ||
    q.includes('family') ||
    q.includes('kids')
  ) {
    return (
      `👨‍👩‍👧‍👦 <b>Zafaron — Oilaviy Tantanalar va Qulaylik Maskani:</b>\n\n` +
      `• Katta oilaviy davralar uchun qulay yumshoq divanli keng stollar va VIP xonalar\n` +
      `• Bolalar uchun shirin va foydali taomlar, shirinliklar va tabiiy sharbatlar\n` +
      `• Tinch, madaniyatli va xavfsiz muhit\n\n` +
      `Oilaviy tashrif uchun stol band qilish: <b>+998 (71) 200-88-99</b> 😊`
    );
  }

  // 10. Shirinliklar, Choy va Ichimliklar
  if (
    q.includes('shirinlik') ||
    q.includes('desert') ||
    q.includes('choy') ||
    q.includes('kofe') ||
    q.includes('sharbat') ||
    q.includes('paxlava') ||
    q.includes('baklava') ||
    q.includes('десерт') ||
    q.includes('чай') ||
    q.includes('кофе') ||
    q.includes('пахлава')
  ) {
    return (
      `🍯 <b>Zafaron Shirinliklar va Choy Saroyi:</b>\n\n` +
      `• <b>Za'faronli Shohona Choy:</b> <code>28,000 so'm</code> — Eron za'faroni, tog' giyohlari va asal bilan\n` +
      `• <b>Turkcha Paxlava:</b> <code>45,000 so'm</code> — Qatlama xamir, mayin pista va yong'oqli\n` +
      `• <b>Shokoladli Fondan:</b> <code>40,000 so'm</code> — Qaynoq oqib chiquvchi Belgiya shokoladi\n` +
      `• <b>Yangi siqilgan sharbatlar:</b> <code>32,000 so'm</code>\n\n` +
      `Kechki taomdan keyin xushbo'y choy ustida suhbatlashish uchun ayni muddao! ✨`
    );
  }

  // 11. Compliments & Gratitude (rahmat, zo'r, malades, gap yo'q, etc.)
  if (
    q.includes('rahmat') ||
    q.includes('raxmat') ||
    q.includes('tashakkur') ||
    q.includes('zo\'r') ||
    q.includes('zor') ||
    q.includes('gap yo\'q') ||
    q.includes('gap yoq') ||
    q.includes('malades') ||
    q.includes('molodes') ||
    q.includes('molodets') ||
    q.includes('tasanno') ||
    q.includes('krasava') ||
    q.includes('спасибо') ||
    q.includes('благодар') ||
    q.includes('отлично') ||
    q.includes('супер') ||
    q.includes('круто') ||
    q.includes('thank') ||
    q.includes('great') ||
    q.includes('awesome')
  ) {
    if (isRussian) {
      return (
        `✨ <b>Всегда к вашим услугам!</b>\n\n` +
        `Для нас большая честь и радость заботиться о вашем комфорте. Двери Zafaron Restaurant & Lounge всегда открыты для вас!\n\n` +
        `Если понадобятся столики, меню или доставка — просто напишите мне! 😊🥂`
      );
    }
    return (
      `✨ <b>Arzimaydi! Sizdek aziz mehmonimizga xizmat qilish biz uchun katta sharaf va quvonch!</b>\n\n` +
      `Zafaron Restaurant & Lounge eshiklari siz uchun har doim ochiq. Yana biror savolingiz, buyurtmangiz yoki taklifingiz bo'lsa, bemalol yozing! 😊🥂`
    );
  }

  // 12. AI Identity questions (kim san, sun'iy intellektmisan, etc.)
  if (
    q.includes('kim san') ||
    q.includes('kimsan') ||
    q.includes('isming') ||
    q.includes('sun\'iy') ||
    q.includes('intellekt') ||
    q.includes('odammisan') ||
    q.includes('botmisan') ||
    q.includes('robot') ||
    q.includes('кто ты') ||
    q.includes('ты бот') ||
    q.includes('ты ии') ||
    q.includes('who are you') ||
    q.includes('are you ai')
  ) {
    if (isRussian) {
      return (
        `🤖 <b>Я официальный AI-консьерж Zafaron Restaurant & Lounge!</b>\n\n` +
        `Я работаю 24/7 на базе передового искусственного интеллекта и знаю всё о нашем меню, ингредиентах, свободных столиках и мероприятиях.\n\n` +
        `Вы можете общаться со мной на любые темы о ресторане — задавайте вопросы! 😊✨`
      );
    }
    return (
      `🤖 <b>Men Zafaron Restaurant & Lounge'ning rasmiy sun'iy intellekt konsyerjiman!</b>\n\n` +
      `Men 24/7 rejimida ishlayman va restoranimizning shohona taomlari, narxlari, VIP zallari, ish vaqti va buyurtmalar bo'yicha sizga yordam berish uchun yaratilganman.\n\n` +
      `Menga xuddi do'stingizdek yoki restoranning bosh administratori kabi har qanday savolni berishingiz mumkin! Marhamat, sizni eshitaman 😊✨`
    );
  }

  // 13. Halol / Go'sht sifati
  if (q.includes('halol') || q.includes('halal') || q.includes('халяль')) {
    return (
      `✨ <b>100% Halol Kafolati:</b>\n\n` +
      `Restoranimizda barcha go'sht va masalliqlar qat'iy halol standartlari asosida tanlab olinadi. Sertifikatlangan sifat va yangilik bizning eng asosiy qadriyatimizdir!`
    );
  }

  // 14. Conversational AI Fallback (Natural, warm and attentive dialogue — NEVER static bullet lists!)
  if (isRussian) {
    return (
      `✨ <b>Я внимательно прочитал ваше сообщение!</b>\n\n` +
      `Как AI-консьерж Zafaron Restaurant & Lounge, я с радостью отвечу на любой вопрос о нашем меню, шахском плове, сочных стейках, бронировании VIP-залов или доставке.\n\n` +
      `Уточните, пожалуйста, что именно вас интересует, или позвоните нашему администратору:\n` +
      `📞 <b>+998 (71) 200-88-99</b>\n\n` +
      `<i>Я готов продолжить общение — напишите мне! 😊</i>`
    );
  }
  if (isEnglish) {
    return (
      `✨ <b>Thank you for your message!</b>\n\n` +
      `As the AI concierge of Zafaron Restaurant & Lounge, I am delighted to assist you with our chef's specialties, table reservations, VIP halls, or fast delivery.\n\n` +
      `Please let me know how I can help you today, or speak directly to our manager:\n` +
      `📞 <b>+998 (71) 200-88-99</b>\n\n` +
      `<i>I'm right here listening — feel free to ask! 😊</i>`
    );
  }
  return (
    `✨ <b>Siz bilan suhbatlashayotganimdan mamnunman!</b>\n\n` +
    `Zafaron Restaurant & Lounge sun'iy intellekt konsyerji sifatida barcha savollaringizga javob berishga tayyorman.\n\n` +
    `Shohona za'faronli oshimiz, shirador steyklarimiz, VIP xonalarni bron qilish yoki yetkazib berish bo'yicha qanday tafsilot kerak bo'lsa, bemalol yozing!\n\n` +
    `Shuningdek, bosh administratorimiz bilan ham bevosita bog'lanishingiz mumkin:\n` +
    `📞 <b>+998 (71) 200-88-99</b> yoki Telegram: <b>@zafaron_admin</b>\n\n` +
    `<i>Sizni eshityapman, marhamat savolingizni yozing! 😊</i>`
  );
}

// 4. Call Google Gemini API (if key available)
async function callGeminiAi(userPrompt) {
  if (!GEMINI_API_KEY) {
    return null;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      systemInstruction: {
        parts: [
          {
            text:
              `Siz "Zafaron Restaurant & Lounge" (Toshkent, Amir Temur 45) hashamatli restoranining rasmiy aqlli sun'iy intellekt konsyerjisiz.\n` +
              `Mijoz bilan juda xushmuomala, shohona, iliq va tushunarli tilda gaplashing.\n` +
              `Agar mijoz o'zbekcha yozsa — o'zbekcha, ruscha yozsa — ruscha, inglizcha yozsa — inglizcha javob bering.\n` +
              `Restoran ma'lumotlari quyidagicha:\n${RESTAURANT_KNOWLEDGE}\n` +
              `Javobingiz 2-4 ta qisqa, go'zal paragrafdan oshmasin. Telegram HTML formatini qo'llang (<b>, <i>, <code>).`
          }
        ]
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidate) {
      return candidate.trim();
    }
  } catch (err) {
    console.warn('Gemini API call failed, falling back to Smart Engine:', err.message);
  }
  return null;
}

// 4.1 Fast Cloud Neural AI (Free fallback with 3.5s timeout)
async function callCloudAi(userPrompt, userLang = 'uz') {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const langInstructions = {
      uz: "O'zbek tilida juda iliq, shohona va xushmuomala javob bering. Zafaron Restaurant & Lounge restorani AI konsyerjisiz.",
      ru: "Отвечайте на русском языке очень вежливо и гостеприимно. Вы AI-консьерж ресторана Zafaron Restaurant & Lounge.",
      en: "Respond in English warmly and elegantly. You are the AI concierge of Zafaron Restaurant & Lounge."
    };
    const instr = langInstructions[userLang] || langInstructions.uz;
    const prompt = `System: ${instr} Restoran: Toshkent Amir Temur 45. Shohona Osh 58000 som, Tomahawk steyk, 4 ta zal, 100% Halol. User: ${userPrompt}`;

    const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const text = await res.text();
    if (
      text &&
      text.length > 5 &&
      !text.includes('Free limit') &&
      !text.includes('rate limit') &&
      !text.includes('limit reached') &&
      !text.includes('pollen key')
    ) {
      return text.trim();
    }
  } catch {
    clearTimeout(timeoutId);
  }
  return null;
}

// 4.2 Multi-Tier AI Response Dispatcher
async function getAiResponse(userText, userLang = 'uz') {
  // 1. Google Gemini AI (if key is set)
  if (GEMINI_API_KEY) {
    try {
      const geminiRes = await callGeminiAi(userText);
      if (geminiRes && geminiRes.length > 5) {
        return geminiRes;
      }
    } catch { }
  }

  // 2. Fast Cloud Neural AI
  try {
    const cloudRes = await callCloudAi(userText, userLang);
    if (cloudRes && cloudRes.length > 5) {
      return cloudRes;
    }
  } catch { }

  // 3. Ultra-Smart Local Conversational AI Engine
  return generateSmartRestaurantAnswer(userText, userLang);
}

// 5. Language selector & Interactive Keyboards (Til tanlash + flaglari bilan)
const LANGUAGE_INLINE_KEYBOARD = {
  inline_keyboard: [
    [
      { text: "🇺🇿 O'zbekcha", callback_data: "set_lang_uz" },
      { text: "🇷🇺 Русский", callback_data: "set_lang_ru" },
      { text: "🇬🇧 English", callback_data: "set_lang_en" }
    ]
  ]
};

const LANGUAGE_PROMPT_TEXT =
  `🌐 <b>Tilni tanlang / Выберите язык / Choose language:</b>\n\n` +
  `🇺🇿 Iltimos, o'zingizga qulay tilni tanlang:\n` +
  `🇷🇺 Пожалуйста, выберите удобный для вас язык:\n` +
  `🇬🇧 Please choose your preferred language:`;

const KEYBOARDS = {
  uz: {
    keyboard: [
      [
        { text: "📍 Bizning manzilimiz" },
        { text: "🍽 Taomnoma" }
      ],
      [
        { text: "🥂 Stol band qilish" },
        { text: "🕒 Ish vaqti" }
      ],
      [
        { text: "💬 Muloqot" },
        { text: "🌐 Tilni tanlash" }
      ]
    ],
    resize_keyboard: true,
    is_persistent: true
  },
  ru: {
    keyboard: [
      [
        { text: "📍 Наш адрес" },
        { text: "🍽 Меню" }
      ],
      [
        { text: "🥂 Бронь стола" },
        { text: "🕒 Режим работы" }
      ],
      [
        { text: "💬 Общение" },
        { text: "🌐 Выбор языка" }
      ]
    ],
    resize_keyboard: true,
    is_persistent: true
  },
  en: {
    keyboard: [
      [
        { text: "📍 Our Location" },
        { text: "🍽 Menu" }
      ],
      [
        { text: "🥂 Book a Table" },
        { text: "🕒 Opening Hours" }
      ],
      [
        { text: "💬 Chat" },
        { text: "🌐 Language" }
      ]
    ],
    resize_keyboard: true,
    is_persistent: true
  }
};

const BOT_COMMANDS = [
  { command: 'start', description: "🔄 Qayta ishga tushirish / Перезапуск" },
  { command: 'til', description: "🌐 Tilni tanlash (🇺🇿/🇷🇺/🇬🇧)" },
  { command: 'manzil', description: "📍 Bizning manzilimiz / Наш адрес" },
  { command: 'menu', description: "🍽 Taomnoma / Меню" },
  { command: 'bron', description: "🥂 Stol band qilish / Бронь стола" },
  { command: 'vaqt', description: "🕒 Ish vaqti / Режим работы" },
  { command: 'muloqot', description: "💬 Muloqot / Общение / Chat" }
];

const BOOKING_KEYBOARDS = {
  uz: {
    inline_keyboard: [
      [
        { text: "🏛 1. Asosiy Zal", callback_data: "zal_1" },
        { text: "🌆 2. Terrasa", callback_data: "zal_2" }
      ],
      [
        { text: "👑 3. VIP Oltin Xona", callback_data: "zal_3" },
        { text: "🎉 4. Banket Zali", callback_data: "zal_4" }
      ],
      [
        { text: "📞 Administrator bilan bog'lanish", url: "https://t.me/zafaron_admin" }
      ]
    ]
  },
  ru: {
    inline_keyboard: [
      [
        { text: "🏛 1. Главный Зал", callback_data: "zal_1" },
        { text: "🌆 2. Терраса", callback_data: "zal_2" }
      ],
      [
        { text: "👑 3. VIP Золотой Зал", callback_data: "zal_3" },
        { text: "🎉 4. Банкетный Зал", callback_data: "zal_4" }
      ],
      [
        { text: "📞 Связаться с администратором", url: "https://t.me/zafaron_admin" }
      ]
    ]
  },
  en: {
    inline_keyboard: [
      [
        { text: "🏛 1. Main Luxury Hall", callback_data: "zal_1" },
        { text: "🌆 2. Terrace", callback_data: "zal_2" }
      ],
      [
        { text: "👑 3. VIP Gold Room", callback_data: "zal_3" },
        { text: "🎉 4. Banquet Hall", callback_data: "zal_4" }
      ],
      [
        { text: "📞 Contact Administrator", url: "https://t.me/zafaron_admin" }
      ]
    ]
  }
};

async function registerBotMenu() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const cmdUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`;
      const cmdRes = await fetch(cmdUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands: BOT_COMMANDS }),
        signal: AbortSignal.timeout(6000)
      });
      const cmdData = await cmdRes.json();
      if (cmdData.ok) {
        console.log('✅ Telegram bot komandalar menyusi (setMyCommands) o\'rnatildi (7 ta band):');
        BOT_COMMANDS.forEach(c => console.log(`   /${c.command} - ${c.description}`));
      }

      // Set Menu button
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu_button: { type: 'commands' } }),
        signal: AbortSignal.timeout(6000)
      });
      return;
    } catch (err) {
      if (attempt === 3) {
        console.warn('⚠️ Menyu o\'rnatishda xatolik:', err.message);
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
}

async function sendTelegramMessage(chatId, text, replyToMessageId = null, replyMarkup = null) {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const userLang = userLanguages[chatId] || 'uz';
    const body = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: replyMarkup || (KEYBOARDS[userLang] || KEYBOARDS.uz)
    };
    if (replyToMessageId) {
      body.reply_to_message_id = replyToMessageId;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (e) {
    console.error('Failed to send telegram message:', e.message);
    return null;
  }
}

// 6. Send Typing Action
async function sendTypingAction(chatId) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendChatAction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, action: 'typing' })
    });
  } catch {}
}

// 7. Long-polling Updates Listener
let lastUpdateId = 0;

async function pollUpdates() {
  // Register bot commands in background
  registerBotMenu().catch(() => {});

  while (true) {
    try {
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=25`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.ok) {
        if (data.error_code === 409) {
          console.warn('⚠️ [TelegramBot] Boshqa bot instansiyasi faol. 5 soniya kutilmoqda...');
          await new Promise(r => setTimeout(r, 5000));
          continue;
        }
      }

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = Math.max(lastUpdateId, update.update_id);

          // Handle callback query (inline button clicks)
          if (update.callback_query) {
            const cb = update.callback_query;
            const cbData = cb.data;
            const cbChatId = cb.message?.chat?.id;
            const cbMsgId = cb.message?.message_id;

            // Stop button loading animation with optional alert toast
            try {
              let alertText = null;
              if (cbData === 'set_lang_uz') alertText = "🇺🇿 O'zbek tili tanlandi!";
              else if (cbData === 'set_lang_ru') alertText = "🇷🇺 Выбран русский язык!";
              else if (cbData === 'set_lang_en') alertText = "🇬🇧 English selected!";

              const answerPayload = { callback_query_id: cb.id };
              if (alertText) answerPayload.text = alertText;

              await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(answerPayload)
              });
            } catch {}

            // Handle language change buttons (with flags)
            if (cbData.startsWith('set_lang_')) {
              const newLang = cbData.replace('set_lang_', '');
              saveUserLanguage(cbChatId, newLang);

              let welcomeMsg = '';
              if (newLang === 'ru') {
                welcomeMsg =
                  `🇷🇺 <b>Выбран русский язык!</b>\n\n` +
                  `👋 <b>Здравствуйте! Добро пожаловать в Zafaron Restaurant & Lounge!</b>\n\n` +
                  `Я ваш персональный AI-консьерж ресторана Zafaron. Выберите нужный раздел в меню или задайте любой вопрос:\n\n` +
                  `📍 <b>Наш адрес</b> — Локация и карта\n` +
                  `🍽 <b>Меню</b> — Блюда и цены\n` +
                  `🥂 <b>Бронь стола</b> — Бронирование залов\n` +
                  `🕒 <b>Режим работы</b> — График и живая музыка\n` +
                  `💬 <b>Общение</b> — Чат и связь с администратором\n\n` +
                  `<i>Нажмите на любую кнопку в меню внизу или напишите вопрос! 😊</i>`;
              } else if (newLang === 'en') {
                welcomeMsg =
                  `🇬🇧 <b>English language selected!</b>\n\n` +
                  `👋 <b>Welcome to Zafaron Restaurant & Lounge!</b>\n\n` +
                  `I am your personal smart AI concierge. Please choose a section from the menu below or ask any question:\n\n` +
                  `📍 <b>Our Location</b> — Address & map\n` +
                  `🍽 <b>Menu</b> — Dishes & prices\n` +
                  `🥂 <b>Book a Table</b> — Hall reservation\n` +
                  `🕒 <b>Opening Hours</b> — Schedule & live music\n` +
                  `💬 <b>Chat</b> — Live chat & administration\n\n` +
                  `<i>Tap any menu button below or send a message! 😊</i>`;
              } else {
                welcomeMsg =
                  `🇺🇿 <b>O'zbek tili tanlandi!</b>\n\n` +
                  `👋 <b>Assalomu alaykum! Zafaron Restaurant & Lounge'ga xush kelibsiz!</b>\n\n` +
                  `Men sizning shaxsiy sun'iy intellekt konsyerjingizman. Quyidagi menyudan kerakli bo'limni tanlang yoki savolingizni yozing:\n\n` +
                  `📍 <b>Bizning manzilimiz</b> — Restoran joylashuvi va xarita\n` +
                  `🍽 <b>Taomnoma</b> — Shohona taomlar va narxlar\n` +
                  `🥂 <b>Stol band qilish</b> — Hashamatli zallarni bron qilish\n` +
                  `🕒 <b>Ish vaqti</b> — Ish tartibi va jonli musiqa\n` +
                  `💬 <b>Muloqot</b> — Jonli muloqot va administrator\n\n` +
                  `<i>Quyidagi tugmalardan birini bosing yoki xohlagan savolingizni yozing! 😊</i>`;
              }

              if (cbChatId) {
                await sendTelegramMessage(cbChatId, welcomeMsg, null, KEYBOARDS[newLang] || KEYBOARDS.uz);
              }
              continue;
            }

            const currentLang = userLanguages[cbChatId] || 'uz';
            const responseText = generateSmartRestaurantAnswer(cbData, currentLang);
            if (responseText && cbChatId) {
              await sendTelegramMessage(cbChatId, responseText, cbMsgId, KEYBOARDS[currentLang] || KEYBOARDS.uz);
            }
            continue;
          }

          const msg = update.message;
          if (!msg || !msg.text) continue;

          // Don't respond to bots
          if (msg.from && msg.from.is_bot) continue;

          const chatId = msg.chat.id;
          const userText = msg.text.trim();
          const qLower = userText.toLowerCase().trim();
          const senderName = msg.from?.first_name || 'Hurmatli Mehmon';
          const userLang = userLanguages[chatId] || 'uz';

          console.log(`📩 [${new Date().toLocaleTimeString()}] Xabar keldi (${senderName}, lang=${userLang}): "${userText}"`);

          // Show typing status in Telegram
          await sendTypingAction(chatId);

          // Language selection prompt
          const isLanguageRequest = [
            '/start', '/til', '/lang', '/language',
            'til', 'tillar', 'til tanlash', 'til tanla', 'tilni tanlash',
            '🌐 tilni tanlash', '🌐 выбор языка', '🌐 language',
            'язык', 'выбор языка', 'сменить язык',
            'language', 'choose language'
          ].some(item => qLower === item);

          if (isLanguageRequest) {
            await sendTelegramMessage(chatId, LANGUAGE_PROMPT_TEXT, msg.message_id, LANGUAGE_INLINE_KEYBOARD);
            continue;
          }

          // Fast direct handling for exact menu buttons, numbers & commands
          const directButtons = [
            '/menu', '/menyu', '/manzil', '/bron', '/vaqt', '/aloqa', '/muloqot',
            '📍 bizning manzilimiz', 'наш адрес', 'our location',
            '🍽 taomnoma', 'меню', 'menu',
            '🥂 stol band qilish', 'бронь стола', 'book a table',
            '🕒 ish vaqti', 'режим работы', 'opening hours',
            '💬 muloqot', '💬 общение', '💬 chat', 'muloqot',
            '1', '2', '3', '4', '1.', '2.', '3.', '4.', '1-zal', '2-zal', '3-zal', '4-zal',
            'bir', 'ikki', 'uch', 'to\'rt', 'tort', 'zal 1', 'zal 2', 'zal 3', 'zal 4',
            'asosiy zal', 'terrasa', 'vip xona', 'banket zali'
          ];
          const isDirectMenuItem = directButtons.includes(qLower);

          let aiResponse = null;
          if (isDirectMenuItem) {
            aiResponse = generateSmartRestaurantAnswer(userText, userLang);
          } else {
            aiResponse = await getAiResponse(userText, userLang);
          }

          if (aiResponse === '__LANGUAGE_PROMPT__') {
            await sendTelegramMessage(chatId, LANGUAGE_PROMPT_TEXT, msg.message_id, LANGUAGE_INLINE_KEYBOARD);
            continue;
          }

          // If booking was requested, also provide interactive hall selection inline buttons
          const isBookingAction = qLower === '/bron' || qLower.includes('stol band qilish') || qLower.includes('bron') || qLower.includes('бронь') || qLower.includes('book');
          const replyMarkup = isBookingAction ? (BOOKING_KEYBOARDS[userLang] || BOOKING_KEYBOARDS.uz) : (KEYBOARDS[userLang] || KEYBOARDS.uz);

          // Send response back to user
          await sendTelegramMessage(chatId, aiResponse, msg.message_id, replyMarkup);
          console.log(`✅ [${new Date().toLocaleTimeString()}] AI javob qaytardi (${senderName})`);
        }
      }
    } catch (err) {
      // Small pause before retry on network error
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

// Start polling
pollUpdates();
