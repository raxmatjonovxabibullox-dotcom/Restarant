// Telegram Bot Service for Zafaron Restaurant
import { getStoredSettings } from '../lib/storage';

const getBotCredentials = () => {
  const settings = getStoredSettings();
  const token = settings.telegramBotToken || import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = settings.telegramChatId || import.meta.env.VITE_TELEGRAM_CHAT_ID;
  return { token, chatId };
};

// Send raw HTML message to Telegram
const sendToTelegramApi = async (token, chatId, text) => {
  if (!token || !chatId) {
    return {
      success: false,
      notConfigured: true,
      message: "Telegram Bot Token yoki Chat ID sozlanmagan"
    };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
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

// Test bot connection
export const testTelegramBot = async (token, chatId) => {
  const message = `🌟 <b>ZAFARON RESTAURANT TEST XABARI</b>\n\n` +
    `✅ Telegram Bot aloqasi muvaffaqiyatli o'rnatildi!\n` +
    `📅 Vaqt: ${new Date().toLocaleString()}\n` +
    `🛎 Tizim barcha buyurtmalar va stol bandliklarini ushbu chatga yuborishga tayyor.`;
  
  return await sendToTelegramApi(token, chatId, message);
};

// Format & Send Order
export const sendTelegramOrder = async (order) => {
  const { token, chatId } = getBotCredentials();
  
  const deliveryTypeTitle = order.deliveryType === 'dineIn' 
    ? `🍽 RESTORANDA (Stol: <b>${order.tableNumber || "Ko'rsatilmagan"}</b>)`
    : `🛵 YETKAZIB BERISH (Manzil: <b>${order.deliveryAddress || "Ko'rsatilmagan"}</b>)`;

  const paymentTitle = order.paymentMethod === 'card' ? "💳 Karta (Payme/Click)" : "💵 Naqd pul";

  let itemsText = order.items.map((item, idx) => {
    const name = typeof item.name === 'object' ? (item.name.uz || item.name.en) : item.name;
    const subtotal = (item.price * item.quantity).toLocaleString();
    return `${idx + 1}. <b>${name}</b> x ${item.quantity} = ${subtotal} so'm`;
  }).join('\n');

  const formattedMessage = 
    `🔔 <b>YANGI BUYURTMA: #${order.id}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>Mijoz:</b> ${order.customerName}\n` +
    `📞 <b>Telefon:</b> <a href="tel:${order.customerPhone}">${order.customerPhone}</a>\n` +
    `📍 <b>Xizmat turi:</b> ${deliveryTypeTitle}\n` +
    `💳 <b>To'lov usuli:</b> ${paymentTitle}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📋 <b>BUYURTMA TARKIBI:</b>\n` +
    `${itemsText}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 <b>JAMI SUMMA:</b> <b>${Number(order.totalAmount).toLocaleString()} so'm</b>\n` +
    `⏰ <b>Vaqt:</b> ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}, ${new Date().toLocaleDateString('uz-UZ')}\n` +
    `🚀 <i>Iltimos, buyurtmani darhol qabul qiling!</i>`;

  return await sendToTelegramApi(token, chatId, formattedMessage);
};

// Format & Send Reservation
export const sendTelegramReservation = async (reservation) => {
  const { token, chatId } = getBotCredentials();

  const formattedMessage = 
    `🛎 <b>YANGI STOL BAND QILINDI: #${reservation.id}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>Mijoz:</b> ${reservation.fullName}\n` +
    `📞 <b>Telefon:</b> <a href="tel:${reservation.phone}">${reservation.phone}</a>\n` +
    `📅 <b>Sana:</b> ${reservation.date}\n` +
    `⏰ <b>Vaqt:</b> ${reservation.time}\n` +
    `👥 <b>Mehmonlar soni:</b> ${reservation.guests} kishi\n` +
    `🏛 <b>Tanlangan hudud:</b> ${reservation.zone}\n` +
    (reservation.specialRequests ? `📝 <b>Maxsus istak:</b> <i>${reservation.specialRequests}</i>\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📌 <i>Mijoz bilan bog'lanib, bandlikni tasdiqlang!</i>`;

  return await sendToTelegramApi(token, chatId, formattedMessage);
};

// Format & Send Contact Message
export const sendTelegramContactMessage = async (msg) => {
  const { token, chatId } = getBotCredentials();

  const formattedMessage = 
    `📩 <b>YANGI MUROJAAT (Aloqa sahifasidan)</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>Yuboruvchi:</b> ${msg.name}\n` +
    `📞 <b>Telefon:</b> ${msg.phone}\n` +
    `📌 <b>Mavzu:</b> ${msg.subject || "Umumiy savol"}\n` +
    `💬 <b>Xabar:</b>\n<i>${msg.message}</i>\n` +
    `━━━━━━━━━━━━━━━━━━━━`;

  return await sendToTelegramApi(token, chatId, formattedMessage);
};
