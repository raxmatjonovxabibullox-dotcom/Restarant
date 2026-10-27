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
- VIP Oltin Xona: 10-14 kishilik alohida xonalar, shaxsiy ofitsiant, to'liq shaxsiy muhit.
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
function generateSmartRestaurantAnswer(userText) {
  const q = (userText || '').toLowerCase().trim();

  // Detect Russian
  const isRussian = /[а-яё]/i.test(q) && (
    q.includes('привет') || q.includes('здравствуй') || q.includes('меню') ||
    q.includes('цена') || q.includes('плов') || q.includes('шашлык') ||
    q.includes('где') || q.includes('адрес') || q.includes('время') ||
    q.includes('стол') || q.includes('бронь') || q.includes('доставка') ||
    q.includes('телефон') || q.includes('халяль')
  );

  // Detect English
  const isEnglish = (
    q.includes('hello') || q.includes('hi ') || q === 'hi' || q.includes('hey') ||
    q.includes('menu') || q.includes('price') || q.includes('steak') ||
    q.includes('kebab') || q.includes('where') || q.includes('address') ||
    q.includes('hours') || q.includes('book') || q.includes('table') ||
    q.includes('delivery') || q.includes('halal')
  );

  // Greetings (including typos like 'salon', 'salomm', 'салом', etc.)
  if (
    q.includes('salom') ||
    q.includes('salon') ||
    q.includes('salomm') ||
    q.includes('салом') ||
    q.includes('assalom') ||
    q.includes('privet') ||
    q.includes('привет') ||
    q.includes('здравствуй') ||
    q.includes('hello') ||
    q.includes('hi') ||
    q.includes('hey') ||
    q.includes('hayrli') ||
    q === '/start'
  ) {
    if (isRussian || q.includes('привет') || q.includes('здравствуй')) {
      return (
        `👋 <b>Здравствуйте! Добро пожаловать в Zafaron Restaurant & Lounge!</b>\n\n` +
        `Я ваш персональный AI-консьерж ресторана Zafaron. Выберите один из разделов ниже или задайте любой вопрос:\n\n` +
        `📍 <b>Bizning manzilimiz</b> — Наш адрес и локация\n` +
        `🍽 <b>Taomnoma</b> — Меню блюд и цены\n` +
        `🥂 <b>Stol band qilish</b> — Бронирование столов и VIP залов\n` +
        `🕒 <b>Ish vaqti</b> — Режим работы и живая музыка\n` +
        `📞 <b>Bog'lanish</b> — Контакты и администратор\n\n` +
        `<i>Нажмите на любую кнопку в меню внизу или напишите вопрос! 😊</i>`
      );
    }
    if (isEnglish) {
      return (
        `👋 <b>Hello! Welcome to Zafaron Restaurant & Lounge!</b>\n\n` +
        `I am your personal smart culinary concierge. Please choose an option from the menu below or ask any question:\n\n` +
        `📍 <b>Bizning manzilimiz</b> — Location & Maps\n` +
        `🍽 <b>Taomnoma</b> — Dishes & prices\n` +
        `🥂 <b>Stol band qilish</b> — Table reservation\n` +
        `🕒 <b>Ish vaqti</b> — Opening hours & live music\n` +
        `📞 <b>Bog'lanish</b> — Contact & administration\n\n` +
        `<i>Tap any menu button below or send a message! 😊</i>`
      );
    }
    return (
      `👋 <b>Assalomu alaykum! Zafaron Restaurant & Lounge'ga xush kelibsiz!</b>\n\n` +
      `Men sizning shaxsiy sun'iy intellekt konsyerjingizman. Quyidagi 5 ta bo'limdan birini tanlang yoki o'zingizni qiziqtirgan savolni yozing:\n\n` +
      `📍 <b>Bizning manzilimiz</b> — Restoran joylashuvi va xarita\n` +
      `🍽 <b>Taomnoma</b> — Shohona taomlar va narxlar\n` +
      `🥂 <b>Stol band qilish</b> — Hashamatli zallarni bron qilish\n` +
      `🕒 <b>Ish vaqti</b> — Ish tartibi va jonli musiqa oqshomlari\n` +
      `📞 <b>Bog'lanish</b> — Aloqa ma'lumotlari va administrator\n\n` +
      `<i>Quyidagi tugmalardan birini bosing yoki bemalol savolingizni yozing! 😊</i>`
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
        `3. <b>VIP Золотые Залы</b> — Приватные залы на 6-14 гостей со своим официантом\n` +
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
      `3. <b>VIP Oltin Xona</b> — 10-14 kishilik shaxsiy xona va alohida ofitsiant\n` +
      `4. <b>Banket Zali</b> — 150 kishigacha bo'lgan to'y va tantanalar uchun\n\n` +
      `<i>Zal raqamini (1, 2, 3 yoki 4) yuboring yoki to'g'ridan-to'g'ri administrator bilan bog'laning:</i>\n` +
      `📞 <b>+998 (71) 200-88-99</b>`
    );
  }

  // Zallarni raqam bilan tanlash (1, 2, 3, 4)
  if (q === '1' || q === '1-zal' || q.includes('asosiy zal')) {
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
  if (q === '2' || q === '2-zal' || q.includes('terrasa')) {
    return (
      `🌆 <b>2. Ochiq Havo Terrasasi tanlandi!</b>\n\n` +
      `• Toshkent shahrining keng panoramasi\n` +
      `• Yozgi salqin shabboda va toza havo\n` +
      `• Romantik oqshomlar uchun ajoyib muhit\n\n` +
      `Terrasada stol band qilish uchun:\n` +
      `📞 <b>+998 (71) 200-88-99</b>`
    );
  }
  if (q === '3' || q === '3-zal' || q.includes('vip')) {
    return (
      `👑 <b>3. VIP Oltin Xona tanlandi!</b>\n\n` +
      `• 10-14 kishilik to'liq alohida qulay xona\n` +
      `• Shaxsiy ofitsiant xizmati\n` +
      `• Muzokaralar, oilaviy tadbirlar va maxfiy uchrashuvlar uchun\n\n` +
      `VIP xonani band qilish uchun:\n` +
      `📞 <b>+998 (71) 200-88-99</b>`
    );
  }
  if (q === '4' || q === '4-zal' || q.includes('banket')) {
    return (
      `🎉 <b>4. Banket Zali tanlandi!</b>\n\n` +
      `• 150 kishigacha bo'lgan to'y, yubiley va tantanalar\n` +
      `• Maxsus shohona taomnoma va tantanali bezatish\n\n` +
      `Banket tashkil qilish uchun:\n` +
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

  // 5. Telefon / Bog'lanish / Aloqa
  if (q === '/aloqa' || q.includes("bog'lanish") || q.includes('boglanish') || q.includes('aloqa') || q.includes('telefon') || q.includes('nomer') || q.includes('kontakt') || q.includes('phone') || q.includes('телефон') || q.includes('номер') || q.includes('связь')) {
    if (isRussian || q.includes('телефон') || q.includes('связь')) {
      return (
        `📞 <b>Контакты Zafaron Restaurant & Lounge:</b>\n\n` +
        `• Главный администратор: <b>+998 (71) 200-88-99</b>\n` +
        `• Дополнительный / Бронь: <b>+998 (90) 123-45-67</b>\n` +
        `• Telegram: @zafaron_admin\n` +
        `• Адрес: г. Ташкент, проспект Амира Темура, 45\n\n` +
        `<i>Мы всегда рады вашему визиту! 😊</i>`
      );
    }
    return (
      `📞 <b>Zafaron Restaurant Aloqa Ma'lumotlari:</b>\n\n` +
      `• Bosh administrator: <b>+998 (71) 200-88-99</b>\n` +
      `• Qo'shimcha aloqa / Bron: <b>+998 (90) 123-45-67</b>\n` +
      `• Telegram administrator: @zafaron_admin\n` +
      `• Manzil: Toshkent sh., Amir Temur shoh ko'chasi, 45-uy\n\n` +
      `<i>Har qanday savolingiz bo'lsa, xursandchilik bilan javob beramiz! 😊</i>`
    );
  }

  // Halol / Go'sht sifati
  if (q.includes('halol') || q.includes('halal') || q.includes('халяль')) {
    return (
      `✨ <b>100% Halol Kafolati:</b>\n\n` +
      `Restoranimizda barcha go'sht va masalliqlar qat'iy halol standartlari asosida tanlab olinadi. Sertifikatlangan sifat va yangilik bizning eng asosiy qadriyatimizdir!`
    );
  }

  // Default polite restaurant response
  if (isRussian) {
    return (
      `👑 <b>AI-Консьерж Zafaron Restaurant & Lounge:</b>\n\n` +
      `Я готов ответить на любые вопросы о нашем ресторане:\n\n` +
      `• <b>Меню и цены:</b> "Плов", "Стейки", "Шашлык"\n` +
      `• <b>Бронирование:</b> "Забронировать стол", "VIP зал"\n` +
      `• <b>Адрес и время:</b> "Где вы находитесь?", "Режим работы"\n` +
      `• <b>Доставка:</b> "Доставка еды"\n\n` +
      `Или свяжитесь с нашим администратором: <b>+998 (71) 200-88-99</b>`
    );
  }
  return (
    `👑 <b>Zafaron Restaurant & Lounge AI Konsyerji:</b>\n\n` +
    `Savolingizni qabul qildim! Zafaron restorani bo'yicha quyidagilarni bilishni istaysizmi?\n\n` +
    `• <b>Taomnoma & Narxlar:</b> "Osh narxi", "Steyklar", "Menyu"\n` +
    `• <b>Stol band qilish:</b> "Stol bron qilish", "VIP xona"\n` +
    `• <b>Manzil va vaqt:</b> "Manzilingiz qayerda?", "Ish vaqti"\n` +
    `• <b>Yetkazib berish:</b> "Dostavka bormi?"\n\n` +
    `Yoki qo'shimcha ma'lumot uchun bosh administratorimizga qo'ng'iroq qiling: <b>+998 (71) 200-88-99</b>`
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

// 5. Persistent 5-Item Reply Keyboard & Official Bot Menu
const MAIN_REPLY_KEYBOARD = {
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
      { text: "📞 Bog'lanish" }
    ]
  ],
  resize_keyboard: true,
  is_persistent: true
};

const BOT_COMMANDS = [
  { command: 'manzil', description: "📍 Bizning manzilimiz va lokatsiya" },
  { command: 'menu', description: "🍽 Taomnoma va narxlar" },
  { command: 'bron', description: "🥂 Stol band qilish (rezervatsiya)" },
  { command: 'vaqt', description: "🕒 Ish vaqti va jonli musiqa" },
  { command: 'aloqa', description: "📞 Bog'lanish va telefonlar" }
];

async function registerBotMenu() {
  try {
    const cmdUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`;
    const cmdRes = await fetch(cmdUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands: BOT_COMMANDS })
    });
    const cmdData = await cmdRes.json();
    if (cmdData.ok) {
      console.log('✅ Telegram bot komandalar menyusi (setMyCommands) o\'rnatildi (5 ta band):');
      BOT_COMMANDS.forEach(c => console.log(`   /${c.command} - ${c.description}`));
    }

    // Set Menu button
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menu_button: { type: 'commands' } })
    });
  } catch (err) {
    console.warn('⚠️ Menyu o\'rnatishda xatolik:', err.message);
  }
}

async function sendTelegramMessage(chatId, text, replyToMessageId = null, replyMarkup = null) {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const body = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: replyMarkup || MAIN_REPLY_KEYBOARD
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
  // Register 5-item command menu with Telegram API on startup
  await registerBotMenu();

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

          const msg = update.message;
          if (!msg || !msg.text) continue;

          // Don't respond to bots
          if (msg.from && msg.from.is_bot) continue;

          const chatId = msg.chat.id;
          const userText = msg.text.trim();
          const qLower = userText.toLowerCase().trim();
          const senderName = msg.from?.first_name || 'Hurmatli Mehmon';

          console.log(`📩 [${new Date().toLocaleTimeString()}] Xabar keldi (${senderName}): "${userText}"`);

          // Show typing status in Telegram
          await sendTypingAction(chatId);

          // Fast direct handling for 5 menu buttons & commands
          const isDirectMenuItem = [
            '/start', '/menu', '/menyu', '/manzil', '/bron', '/vaqt', '/aloqa',
            '📍 bizning manzilimiz', 'bizning manzilimiz',
            '🍽 taomnoma', 'taomnoma',
            '🥂 stol band qilish', 'stol band qilish',
            '🕒 ish vaqti', 'ish vaqti',
            '📞 bog\'lanish', "bog'lanish", 'boglanish'
          ].some(item => qLower === item || qLower.includes(item));

          let aiResponse = null;
          if (isDirectMenuItem) {
            aiResponse = generateSmartRestaurantAnswer(userText);
          } else {
            aiResponse = await callGeminiAi(userText);
            if (!aiResponse) {
              aiResponse = generateSmartRestaurantAnswer(userText);
            }
          }

          // Send response back to user with persistent 5-item menu
          await sendTelegramMessage(chatId, aiResponse, msg.message_id);
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
