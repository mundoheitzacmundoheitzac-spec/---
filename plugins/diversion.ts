export const command = ['gay', 'ship', 'top', 'dado', 'ppt', 'ping', 'owner', 'bc'];

export default async function (sock: any, m: any, { args, text, command, isOwner, config }: any) {
    const getTarget = () => {
        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (mentioned) return mentioned;
        if (args[0]) return args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        return m.sender;
    };

    if (command === 'gay') {
        const target = getTarget();
        const pct = Math.floor(Math.random() * 101);
        return m.reply(`🏳️‍🌈 @${target.split('@')[0]} es ${pct}% gay\n\nDOMINION-MD`);
    }
    if (command === 'ship') {
        const target = getTarget();
        const pct = Math.floor(Math.random() * 101);
        return m.reply(`💘 @${m.sender.split('@')[0]} ❤️ @${target.split('@')[0]}\nCompatibilidad: ${pct}%\n\n${pct > 80 ? '¡Se casan! 💍' : pct > 50 ? 'Hay química 👀' : 'Mejor amigos 😅'}`);
    }
    if (command === 'top') {
        const lista = ['el más guapo', 'el más chismoso', 'el más dormilón', 'el más enojón', 'el más fiel'];
        const pick = lista[Math.floor(Math.random() * lista.length)];
        return m.reply(`👑 TOP DOMINION-MD\n\n@${getTarget().split('@')[0]} es ${pick}`);
    }
    if (command === 'dado') {
        const num = Math.floor(Math.random() * 6) + 1;
        return m.reply(`🎲 Te salió un ${num}`);
    }
    if (command === 'ppt') {
        const opts = ['piedra', 'papel', 'tijera'];
        const bot = opts[Math.floor(Math.random() * 3)];
        const user = (text.toLowerCase() || 'piedra');
        if (!opts.includes(user)) return m.reply('❌ Usa: .ppt piedra / papel / tijera');
        let res = 'Empate 😐';
        if ((user === 'piedra' && bot === 'tijera') || (user === 'papel' && bot === 'piedra') || (user === 'tijera' && bot === 'papel')) res = 'Ganaste 🎉';
        if ((bot === 'piedra' && user === 'tijera') || (bot === 'papel' && user === 'piedra') || (bot === 'tijera' && user === 'papel')) res = 'Perdiste 😅';
        return m.reply(`Tú: ${user}\nYo: ${bot}\n\n${res}`);
    }
    if (command === 'ping') {
        return m.reply('🏓 Pong! DOMINION-MD activo 👑');
    }
    if (command === 'owner') {
        return m.reply(`👑 Dueño de DOMINION-MD:\n@${config.ownerName} - ${[...config.owner][0]}`);
    }
    if (command === 'bc') {
        if (!isOwner) return m.reply('❌ Solo dueño');
        if (!text) return m.reply('❌ Pon el mensaje: .bc Hola');
        return m.reply(`✅ Broadcast listo (conectar a grupos en index.ts)`);
    }
    }
