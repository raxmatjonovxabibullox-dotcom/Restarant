import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function telegramBotPlugin() {
  let botProcess = null;
  return {
    name: 'telegram-ai-bot-starter',
    configureServer(server) {
      if (!process.env.TELEGRAM_BOT_ACTIVE) {
        process.env.TELEGRAM_BOT_ACTIVE = 'true';
        const botScript = path.resolve(__dirname, 'scripts', 'telegramAiBot.js');
        botProcess = spawn(process.execPath, [botScript], {
          stdio: 'inherit',
          shell: true
        });

        botProcess.on('error', (err) => {
          console.warn('[TelegramBot] Start error:', err.message);
        });

        const cleanup = () => {
          if (botProcess && !botProcess.killed) {
            try {
              botProcess.kill();
            } catch {}
          }
        };

        server.httpServer?.on('close', cleanup);
        process.on('exit', cleanup);
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), telegramBotPlugin()],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
});

