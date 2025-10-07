/**
 * LuminiShop Telegram Bot (Render-ready)
 * --------------------------------------
 * Работает на Render.com (бесплатно)
 * Telegram бот + фиктивный сервер, чтобы Render не завершал процесс.
 */

import TelegramBot from "node-telegram-bot-api";
import express from "express"; // <--- добавлено для Render

// 🔑 Твой токен и ID
const TOKEN = "8427147628:AAGnD6PwW_6olpGnAvQYvWeqhDGz8WkKSPI";
const ADMIN_ID = 1725752168;

// 🌐 Ссылка на твой сайт (WebApp)
const WEBAPP_URL = "https://luminiwebapp.netlify.app/shop.html";

// ⚙️ Инициализация бота
const bot = new TelegramBot(TOKEN, { polling: true });

// 🟢 Express — фиктивный сервер, чтобы Render видел "порт"
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("LuminiShop bot is alive 🚀"));
app.listen(PORT, () => console.log(`Render port active on ${PORT}`));

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

// Обработка заказов из WebApp
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

console.log("🤖 LuminiShop bot is running...");
