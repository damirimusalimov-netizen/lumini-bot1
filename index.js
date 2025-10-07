/**
 * LuminiShop Telegram Bot
 * -----------------------
 * Этот бот:
 * 1. Показывает кнопку "Открыть каталог" при /start
 * 2. Открывает твой WebApp (сайт)
 * 3. Получает оформленные заказы и отправляет их админу
 *
 * Установка:
 * npm install node-telegram-bot-api
 *
 * Запуск:
 * node index.js
 */

import TelegramBot from "node-telegram-bot-api";

// ⬇️ ВСТАВЬ сюда свой токен бота (из @BotFather)
const TOKEN = "8427147628:AAGnD6PwW_6olpGnAvQYvWeqhDGz8WkKSPI";

// ⬇️ ВСТАВЬ сюда свой Telegram ID (узнать можно у @userinfobot)
const ADMIN_ID = 1725752168;

// 🌐 Ссылка на твой сайт (WebApp)
const WEBAPP_URL = "https://luminiwebapp.netlify.app/shop.html";

// Инициализация бота
const bot = new TelegramBot(TOKEN, { polling: true });

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Добро пожаловать в LuminiShop!", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "🛍 Открыть каталог",
            web_app: { url: WEBAPP_URL },
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

// Обработка данных из WebApp
bot.on("message", (msg) => {
  if (msg.web_app_data) {
    const data = JSON.parse(msg.web_app_data.data);
    const username = msg.from.username ? `@${msg.from.username}` : "Без ника";
    let text = `🛍 Новый заказ от ${username}:\n\n`;

    data.items.forEach((item) => {
      text += `• ${item.title} — ${item.price} ₽ × ${item.qty}\n`;
    });

    text += `\n💰 Итого: ${data.total} ₽`;

    // Ответ пользователю
    bot.sendMessage(msg.chat.id, "✅ Заказ оформлен! Мы скоро свяжемся с вами.");

    // Отправка админу
    bot.sendMessage(ADMIN_ID, text);
  }
});
