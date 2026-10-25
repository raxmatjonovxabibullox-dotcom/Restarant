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

// 3. Built-in Smart Fallback Engine (Answers instantly without external API dependency)
function generateSmartRestaurantAnswer(userText) {
  const q = (userText || '').toLowerCase().trim();

  // Greetings
  if (q.includes('salom') || q.includes('assalom') || q.includes('privet') || q.includes('hello') || q.includes('hayrli') || q === '/start') {
    return (
      `👋 <b>Assalomu alaykum! Zafaron Restaurant & Lounge'ga xush kelibsiz!</b>\n\n` +
      `Men sizning shaxsiy sun'iy intellekt yordamchingizman. Sizga quyidagilar bo'yicha yordam bera olaman:\n` +
      `🍽 <b>Taomnoma & Narxlar:</b> "Menyu", "Osh qancha?", "Steyklar"\n` +
      `📍 <b>Manzil & Vaqt:</b> "Manzilingiz qayerda?", "Ish vaqti"\n` +
      `📅 <b>Stol band qilish:</b> "Stol bron qilish"\n` +
      `🛵 <b>Dostavka:</b> "Yetkazib berish bormi?"\n\n` +
      `<i>Qanday ma'lumot kerak bo'lsa, bemalol so'rang! 😊</i>`
    );
  }

  // Osh / Palov
  if (q.includes('osh') || q.includes('palov') || q.includes('plov')) {
    return (
      `👑 <b>Zafaron Shohona Oshi:</b>\n\n` +
      `• Narxi: <code>58,000 so'm</code>\n` +
      `• Tarkibi: Mayin lahm go'sht, sara devzira/lazer guruch, qazi, bedana tuxumi va tabiiy Eron za'faroni bilan damlangan.\n\n` +
      `<i>Buyurtma berish yoki stol band qilish uchun telefon: +998 (71) 200-88-99</i>`
    );
  }

  // Steyk / Go'sht / Shashlik
  if (q.includes('steyk') || q.includes('steak') || q.includes('shashlik') || q.includes('kabob') || q.includes('go\'sht')) {
    return (
      `🥩 <b>Zafaron Go'sht va Gril menyusi:</b>\n\n` +
      `• <b>Tomahawk Steyk (1.2 kg):</b> <code>320,000 so'm</code>\n` +
      `• <b>Ribeye Steyk:</b> <code>260,000 so'm</code>\n` +
      `• <b>Filet Mignon:</b> <code>240,000 so'm</code>\n` +
      `• <b>Qo'y go'shti kabobi:</b> <code>42,000 so'm</code>\n` +
      `• <b>Lyulya kabob:</b> <code>38,000 so'm</code>\n` +
      `• <b>Qozon kabob:</b> <code>72,000 so'm</code>\n\n` +
      `Go'shtlarimiz 100% halol va maxsus o'tda pishiriladi! ✨`
    );
  }

  // Menyu umumiy
  if (q.includes('menyu') || q.includes('menu') || q.includes('ovqat') || q.includes('taom')) {
    return (
      `📜 <b>ZAFARON RESTAURANT & LOUNGE MENYUSI:</b>\n\n` +
      `🍲 <b>Milliy taomlar:</b>\n` +
      `• Zafaron Shohona Oshi — 58,000 so'm\n` +
      `• Qozon kabob — 72,000 so'm\n` +
      `• Manti (5 dona) — 48,000 so'm\n\n` +
      `🥩 <b>Gril va Steyklar:</b>\n` +
      `• Tomahawk Steyk — 320,000 so'm\n` +
      `• Ribeye Steyk — 260,000 so'm\n` +
      `• Qo'y go'shti kabob — 42,000 so'm\n\n` +
      `🥗 <b>Salat va Shirinliklar:</b>\n` +
      `• Burrata Zafaron — 65,000 so'm\n` +
      `• Turkcha Paxlava — 45,000 so'm\n` +
      `• Za'faronli Shohona Choy — 28,000 so'm\n\n` +
      `📞 Buyurtma uchun: <b>+998 (71) 200-88-99</b>`
    );
  }

  // Manzil / Joylashuv / Lokatsiya
  if (q.includes('manzil') || q.includes('qayerda') || q.includes('lokatsiya') || q.includes('location') || q.includes('adres')) {
    return (
      `📍 <b>Bizning Manzil:</b>\n\n` +
      `Toshkent shahar, <b>Amir Temur shoh ko'chasi, 45-uy</b>.\n` +
      `Mo'ljal: Markaziy maydon ro'parasida.\n` +
      `🚗 Mehmonlarimiz uchun bepul va keng avtoturargoh mavjud.\n\n` +
      `🗺 Google Maps: <a href="https://maps.google.com/?q=Amir+Temur+Avenue+45+Tashkent">Xaritada ochish</a>`
    );
  }

  // Ish vaqti
  if (q.includes('vaqt') || q.includes('ishlaysiz') || q.includes('ochiq') || q.includes('soat') || q.includes('time') || q.includes('soat')) {
    return (
      `🕒 <b>Ish Tartibimiz:</b>\n\n` +
      `• Har kuni dam olish kunlarisiz: <b>10:00 dan 23:00 gacha</b>\n` +
      `• Oshxonamiz va yetkazib berish xizmati 22:30 gacha buyurtma qabul qiladi.\n` +
      `• Jonli musiqa: Har juma va shanba 19:30 dan boshlanadi! 🎻`
    );
  }

  // Stol bron qilish
  if (q.includes('bron') || q.includes('stol') || q.includes('joy') || q.includes('zakaz') || q.includes('rezerv') || q.includes('vip')) {
    return (
      `🥂 <b>Stol Band Qilish (Bron):</b>\n\n` +
      `Bizda quyidagi hududlar mavjud:\n` +
      `1. <b>Asosiy Hashamatli Zal</b> — Jonli musiqa va bayramona muhit\n` +
      `2. <b>Ochiq Havo Terrasasi</b> — Shahar manzarasi va salqin shabboda\n` +
      `3. <b>VIP Oltin Xona</b> — 10-14 kishilik shaxsiy xona\n\n` +
      `Stol band qilish uchun ismingiz, telefon raqamingiz, mehmonlar soni va vaqtni yozib qoldiring yoki administrator bilan bog'laning:\n` +
      `📞 <b>+998 (71) 200-88-99</b>`
    );
  }

  // Dostavka / Yetkazish
  if (q.includes('dostavka') || q.includes('yetkaz') || q.includes('dastavka') || q.includes('delivery')) {
    return (
      `🛵 <b>Tezkor Yetkazib Berish Xizmati:</b>\n\n` +
      `• Yetkazish vaqti: <b>30-45 daqiqa</b> ichida Toshkent shahar bo'ylab\n` +
      `• Taomlar maxsus termoboxlarda qaynoq holda yetkaziladi\n` +
      `• To'lov: Naqd pul yoki Karta (Click / Payme)\n\n` +
      `Buyurtma berish uchun telefon: <b>+998 (71) 200-88-99</b> yoki saytimiz orqali buyurtma yuboring!`
    );
  }

  // Telefon / Bog'lanish
  if (q.includes('telefon') || q.includes('nomer') || q.includes('kontakt') || q.includes('phone') || q.includes('aloqa')) {
    return (
      `📞 <b>Zafaron Restaurant Aloqa Ma'lumotlari:</b>\n\n` +
      `• Bosh administrator: <b>+998 (71) 200-88-99</b>\n` +
      `• Qo'shimcha aloqa: <b>+998 (90) 123-45-67</b>\n` +
      `• Telegram: @zafaron_admin\n` +
      `• Manzil: Toshkent sh., Amir Temur shoh ko'chasi, 45-uy`
    );
  }

  // Halol / Go'sht sifati
  if (q.includes('halol') || q.includes('halal') || q.includes('sifat')) {
    return (
      `✨ <b>100% Halol Kafolati:</b>\n\n` +
      `Restoranimizda barcha go'sht va masalliqlar qat'iy halol standartlari asosida tanlab olinadi. Sertifikatlangan sifat va yangilik bizning eng asosiy qadriyatimizdir!`
    );
  }

  // Default polite restaurant response
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

// 5. Send message via Telegram Bot API
async function sendTelegramMessage(chatId, text, replyToMessageId = null) {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const body = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
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
  while (true) {
    try {
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=25`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = Math.max(lastUpdateId, update.update_id);

          const msg = update.message;
          if (!msg || !msg.text) continue;

          // Don't respond to bots
          if (msg.from && msg.from.is_bot) continue;

          const chatId = msg.chat.id;
          const userText = msg.text.trim();
          const senderName = msg.from?.first_name || 'Hurmatli Mehmon';

          console.log(`📩 [${new Date().toLocaleTimeString()}] Xabar keldi (${senderName}): "${userText}"`);

          // Show typing status in Telegram
          await sendTypingAction(chatId);

          // Get AI Response (Gemini or Smart Restaurant Brain)
          let aiResponse = await callGeminiAi(userText);
          if (!aiResponse) {
            aiResponse = generateSmartRestaurantAnswer(userText);
          }

          // Send response back to user
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
