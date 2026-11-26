import fs from 'fs';
import path from 'path';
import { config } from './config.ts';
import { database } from './database.ts';
import { serialize, UserJid } from './lib/simple.ts';

export async function handler(sock: any, msg: any) {
    if (!msg.message) return;
    const m = await serialize(sock, msg);
    if (!m.text) return;
    if (!m.text.startsWith(config.prefix)) return;

    const args = m.text.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase() || '';
    const text = args.join(' ');

    const isOwner = config.owner.has(m.sender.split('@')[0]);
    const isGroup = m.isGroup;
    const group = isGroup ? database.getGroup(m.from) : null;

    // Antilink
    if (isGroup && group?.antilink && !isOwner) {
        const linkRegex = /https?:\/\/(chat\.whatsapp\.com|wa\.me)/i;
        if (linkRegex.test(m.text)) {
            await m.reply('🚫 Link no permitido en DOMINION-MD');
            return;
        }
    }

    // Buscar plugin
    const pluginsDir = './plugins';
    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.ts'));

    for (const file of files) {
        const plugin: any = await import(path.join(pluginsDir, file));
        const cmds = plugin.command || plugin.commands || [];
        if (cmds.includes(command)) {
            try {
                await plugin.default(sock, m, { args, text, command, isOwner, isGroup, group, database, config });
            } catch (e) {
                console.error(e);
                await m.reply('❌ Error en DOMINION-MD');
            }
            return;
        }
    }
}

export default handler;
