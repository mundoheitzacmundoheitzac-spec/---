import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import { handler } from './handler.ts';
import { database } from './database.ts';

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const { version } = await fetchLatestBaileysVersion();

    const sock: any = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['DOMINION-MD', 'Chrome', '1.0'],
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('=== ESCANEA ESTE QR EN WHATSAPP ===');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Conexión cerrada, reconectando...', shouldReconnect);
            if (shouldReconnect) start();
        } else if (connection === 'open') {
            console.log('✅ DOMINION-MD CONECTADO');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }: any) => {
        for (const msg of messages) {
            if (!msg.message) continue;
            await handler(sock, msg);
        }
    });

    sock.ev.on('group-participants.update', async (update: any) => {
        const { id, participants, action } = update;
        const group = database.getGroup(id);
        if (action === 'add' && group.welcome) {
            const text = group.sWelcome || 'Bienvenido a DOMINION-MD 👑';
            await sock.sendMessage(id, { text: `${text}\n@${participants[0].split('@')[0]}`, mentions: participants });
        }
        if (action === 'remove' && group.bye) {
            const text = group.sGoodbye || 'Se salió del grupo 👋';
            await sock.sendMessage(id, { text: `${text}\n@${participants[0].split('@')[0]}`, mentions: participants });
        }
        if ((action === 'add' || action === 'remove') && group.alerts) {
            await sock.sendMessage(id, { text: `⚠️ DOMINION-MD ALERT: ${action === 'add' ? 'Entró' : 'Salió'} @${participants[0].split('@')[0]}`, mentions: participants });
        }
    });
}

start();
