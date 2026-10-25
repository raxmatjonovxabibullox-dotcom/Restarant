// Telegram Bot Service for Zafaron Restaurant & Lounge
// Enhanced with Photo support and Telegram Premium HTML styling
import { getStoredSettings } from '../lib/storage.js';

// Default Luxury Photo Banners
const DEFAULT_BANNERS = {
  order: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', // Tomahawk & Banquet
  reservation: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', // Luxury VIP Table
  contact: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', // Lounge interior
  test: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80' // Restaurant facade
};

const getBotCredentials = () => {
  const settings = getStoredSettings();
  const token = settings.telegramBotToken || import.meta.env.VITE_TELEGRAM_BOT_TOKEN || import.meta.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const chatId = settings.telegramChatId || import.meta.env.VITE_TELEGRAM_CHAT_ID || import.meta.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
  return { token, chatId };
};

// Send raw HTML message to Telegram
export const sendToTelegramApi = async (token, chatId, text, replyMarkup = null) => {
  if (!token || !chatId) {
    return {
      success: false,
      notConfigured: true,
      message: "Telegram Bot Token yoki Chat ID sozlanmagan"
    };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const body = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    };
    if (replyMarkup) {
      body.reply_markup = replyMarkup;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.ok) {
      return { success: true, data };
    } else {
      return { success: false, message: data.description || "Telegram API xatoligi" };
    }
  } catch (error) {
    console.error("Telegram send error:", error);
    return { success: false, message: error.message || "Internet aloqasi xatosi" };
  }
};

// Send Photo with caption and optional inline keyboard
export const sendPhotoToTelegramApi = async (token, chatId, photoUrl, caption, replyMarkup = null) => {
  if (!token || !chatId) {
    return {
      success: false,
      notConfigured: true,
      message: "Telegram Bot Token yoki Chat ID sozlanmagan"
    };
  }

  // Telegram sendPhoto caption has a hard limit of 1024 characters.
  // If caption is within limit, send as single photo with caption.
  // If caption is longer than 1024 characters, send photo with concise summary, then follow with sendMessage.
  try {
    const url = `https://api.telegram.org/bot${token}/sendPhoto`;

    if (caption.length <= 1024) {
      const body = {
        chat_id: chatId,
        photo: photoUrl || DEFAULT_BANNERS.order,
        caption: caption,
        parse_mode: 'HTML'
      };
      if (replyMarkup) body.reply_markup = replyMarkup;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (data.ok) return { success: true, data };
      console.warn("sendPhoto direct failed, trying fallback:", data.description);
    } else {
      // Long caption: send photo with compact headline, then full text in message
      const shortCaption = caption.slice(0, 950) + '\n\n<i>(To\'liq tafsilotlar pastdagi xabarda...)</i>';
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: photoUrl || DEFAULT_BANNERS.order,
          caption: shortCaption,
          parse_mode: 'HTML'
        })
      });
      return await sendToTelegramApi(token, chatId, caption, replyMarkup);
    }
  } catch (err) {
    console.warn("sendPhoto error, falling back to sendMessage:", err);
  }

  // Fallback to text message if photo request encounters an error
  return await sendToTelegramApi(token, chatId, caption, replyMarkup);
};

// Test bot connection with Photo
export const testTelegramBot = async (token, chatId) => {
  // 1. Send welcoming greeting with waving hand first
  await sendToTelegramApi(token, chatId, "👋 <b>Assalomu alaykum! Zafaron Telegram Bot aloqasi muvaffaqiyatli tekshirildi!</b>");

  const caption =
    `👑 <b>ZAFARON RESTAURANT & LOUNGE</b>\n` +
    `💎 <b>VIP STATUS: TELEGRAM BOT INTEGRATSIYASI</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `<blockquote>` +
    `✅ <b>Aloqa o'rnatildi:</b> Muvaffaqiyatli\n` +
    `🛎 <b>Tizim holati:</b> Buyurtmalar, stollar va mijoz xabarlarini qabul qilishga tayyor\n` +
    `📅 <b>Sana va vaqt:</b> <code>${new Date().toLocaleString('uz-UZ')}</code>` +
    `</blockquote>\n\n` +
    `✨ <i>Zafaron Lounge — Hashamat va Ta'm Uygunligi</i>`;

  const replyMarkup = {
    inline_keyboard: [
      [
        { text: "⚜️ Restoran Dashboardiga O'tish", url: "https://github.com/raxmatjonovxabibullox-dotcom/Restarant" }
      ]
    ]
  };

  return await sendPhotoToTelegramApi(token, chatId, DEFAULT_BANNERS.test, caption, replyMarkup);
};

// Format & Send Order with Photo and Telegram Premium formatting
export const sendTelegramOrder = async (order) => {
  const { token, chatId } = getBotCredentials();
  if (!token || !chatId) {
    return { success: false, notConfigured: true, message: "Telegram sozlanmagan" };
  }

  // 1. Send welcoming greeting with waving hand first (jirafa emas 👋 chiqadi)
  await sendToTelegramApi(
    token,
    chatId,
    `👋 <b>Assalomu alaykum! Zafaron Restaurant & Lounge tizimiga yangi buyurtma qabul qilindi:</b>`
  );

  // 2. Format delivery title
  const deliveryTypeTitle = order.deliveryType === 'dineIn'
    ? `🍽 <b>Restoranda</b> (Stol raqami: <code>${order.tableNumber || "Ko'rsatilmagan"}</code>)`
    : `🛵 <b>Yetkazib berish</b>\n📍 <i>${order.deliveryAddress || "Ko'rsatilmagan"}</i>`;

  const paymentTitle = order.paymentMethod === 'card' ? "💳 Karta (Click/Payme)" : "💵 Naqd pul";

  // 3. Format items list
  const itemsText = (order.items || []).map((item) => {
    const name = typeof item.name === 'object' ? (item.name.uz || item.name.en) : item.name;
    const subtotal = (item.price * item.quantity).toLocaleString();
    let detail = `• <b>${name}</b> × ${item.quantity} = <code>${subtotal} so'm</code>`;
    if (item.portion && item.portion !== '1x Standart' && item.selectedPortion !== '1x Standart') {
      detail += ` <i>(${item.portion || item.selectedPortion})</i>`;
    }
    if (item.selectedAddons && item.selectedAddons.length > 0) {
      detail += `\n   └ <i>+ ${item.selectedAddons.join(', ')}</i>`;
    }
    return detail;
  }).join('\n');

  // 4. Format Telegram Premium Message
  const caption =
    `👑 <b>ZAFARON RESTAURANT & LOUNGE</b>\n` +
    `💎 <b>PREMIUM VIP BUYURTMA #${order.id}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>Mijoz:</b> <b>${order.customerName}</b>\n` +
    `📞 <b>Telefon:</b> <a href="tel:${order.customerPhone}">${order.customerPhone}</a>\n` +
    `🛵 <b>Xizmat turi:</b> ${deliveryTypeTitle}\n` +
    `💳 <b>To'lov usuli:</b> ${paymentTitle}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📋 <b>BUYURTMA TARKIBI:</b>\n` +
    `<blockquote>\n${itemsText}\n</blockquote>\n` +
    (order.notes ? `📝 <b>Mijoz izohi:</b>\n<blockquote><i>${order.notes}</i></blockquote>\n` : '') +
    `💰 <b>JAMI TO'LOV:</b> <code>${Number(order.totalPrice || order.totalAmount || 0).toLocaleString()} so'm</code>\n` +
    `⏰ <b>Vaqt:</b> ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}, ${new Date().toLocaleDateString('uz-UZ')}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🔥 <i>Bosh oshpaz va xodimlar zudlik bilan qabul qilsin!</i>`;

  // 5. Select dish photo
  const photoUrl = (order.items && order.items[0]?.image) || DEFAULT_BANNERS.order;

  // 6. Interactive Inline Buttons
  const buttons = [];
  if (order.deliveryAddress) {
    buttons.push([
      {
        text: "📍 Google Xaritada Ko'rish",
        url: `https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress)}`
      }
    ]);
  }
  buttons.push([
    {
      text: "⚜️ Restoran Dashboardiga O'tish",
      url: "https://github.com/raxmatjonovxabibullox-dotcom/Restarant"
    }
  ]);

  const replyMarkup = { inline_keyboard: buttons };

  return await sendPhotoToTelegramApi(token, chatId, photoUrl, caption, replyMarkup);
};

// Format & Send Reservation with Photo and Premium styling
export const sendTelegramReservation = async (reservation) => {
  const { token, chatId } = getBotCredentials();
  if (!token || !chatId) {
    return { success: false, notConfigured: true, message: "Telegram sozlanmagan" };
  }

  // 1. Send welcoming greeting with waving hand first (jirafa emas 👋 chiqadi)
  await sendToTelegramApi(
    token,
    chatId,
    `👋 <b>Assalomu alaykum! Zafaron tizimida yangi stol bandligi (bron) qabul qilindi:</b>`
  );

  // 2. Telegram Premium Reservation Card
  const caption =
    `👑 <b>ZAFARON RESTAURANT & LOUNGE</b>\n` +
    `🛎 <b>PREMIUM VIP STOL BAND QILINDI: #${reservation.id}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>Mijoz:</b> <b>${reservation.fullName}</b>\n` +
    `📞 <b>Telefon:</b> <a href="tel:${reservation.phone}">${reservation.phone}</a>\n` +
    `📅 <b>Sana va Vaqt:</b> <code>${reservation.date} • ${reservation.time}</code>\n` +
    `👥 <b>Mehmonlar soni:</b> <b>${reservation.guests} kishi</b>\n` +
    `🏛 <b>Tanlangan hudud:</b> <b>${reservation.zone}</b>${reservation.tableNumber ? ` (Stol #${reservation.tableNumber})` : ''}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `<blockquote>` +
    (reservation.specialRequests ? `📝 <b>Maxsus istak:</b> <i>${reservation.specialRequests}</i>\n` : '') +
    `🥂 <b>Status:</b> Bosh Administrator nazoratida` +
    `</blockquote>\n\n` +
    `📌 <i>Mijoz bilan bog'lanib, bandlikni tasdiqlang!</i>`;

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "⚜️ Bronni Boshqarish",
          url: "https://github.com/raxmatjonovxabibullox-dotcom/Restarant"
        }
      ]
    ]
  };

  return await sendPhotoToTelegramApi(token, chatId, DEFAULT_BANNERS.reservation, caption, replyMarkup);
};

// Format & Send Contact Message with Photo & Premium styling
export const sendTelegramContactMessage = async (msg) => {
  const { token, chatId } = getBotCredentials();
  if (!token || !chatId) {
    return { success: false, notConfigured: true, message: "Telegram sozlanmagan" };
  }

  // 1. Send welcoming greeting with waving hand first
  await sendToTelegramApi(
    token,
    chatId,
    `👋 <b>Assalomu alaykum! Yangi mijoz murojaati qabul qilindi:</b>`
  );

  const caption =
    `👑 <b>ZAFARON RESTAURANT & LOUNGE</b>\n` +
    `📩 <b>YANGI MUROJAAT (VIP ALOQA)</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>Yuboruvchi:</b> <b>${msg.name}</b>\n` +
    `📞 <b>Telefon:</b> <a href="tel:${msg.phone}">${msg.phone}</a>\n` +
    `📌 <b>Mavzu:</b> <b>${msg.subject || "Umumiy savol"}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `<blockquote>\n💬 <b>Xabar:</b>\n<i>${msg.message}</i>\n</blockquote>\n` +
    `⏰ <b>Vaqt:</b> <code>${new Date().toLocaleString('uz-UZ')}</code>`;

  return await sendPhotoToTelegramApi(token, chatId, DEFAULT_BANNERS.contact, caption);
};
