const express = require("express"); // Підключення Express
const { Command } = require("commander");

const program = new Command();
program
  .requiredOption("-h, --host <host>", "server host") // Обов'язковий параметр хоста
  .requiredOption("-p, --port <port>", "server port") // Обов'язковий параметр порту
  .requiredOption("-c, --cache <cache>", "cache directory") // Обов'язковий параметр кешу
  .parse(process.argv);

// Отримання параметрів з командного рядка
const { host, port, cache } = program.opts();

// Перевірка параметрів (можна видалити, оскільки вони вже є обов'язковими через `requiredOption`)
if (!host) {
  console.error("Error: input host");
  return;
}
if (!port) {
  console.error("Error: input port");
  return;
}
if (!cache) {
  console.error("Error: input cache");
  return;
}

// Ініціалізація додатку Express
const app = express();

// Простий обробник для перевірки роботи сервера
app.get("/", (req, res) => {
  res.send(`Сервер працює на http://${host}:${port}. Кеш директорія: ${cache}`);
});

// Запуск сервера
app.listen(port, host, () => {
  console.log(`Сервер запущено на http://${host}:${port}`);
  console.log(`Кеш директорія: ${cache}`);
});
