export const command = ['kick', 'add', 'promote', 'demote', 'welcome', 'bye', 'alerts', 'antilink', 'setwelcome', 'setbye', 'hidetag', 'tagall'];

export default async function (sock: any, m: any, { args, text, command, isOwner, isGroup, group, database }: any) {
    if (!isGroup) return m.reply('❌ Solo en grupos');

    const metadata: any = await sock.groupMetadata(m.from);
    const participants = metadata.participants;
    const isAdmin = participants.find((p: any) => p.id === m.sender)?.admin;
    const isBotAdmin = participants.find((p: any) => p.id === sock.user.id)?.admin;

    const getTarget = () => {
        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (mentioned) return mentioned;
        if (args[0]) return args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        return null;
    };

    // Solo admins y dueño
    const needAdmin = ['kick', 'add', 'promote', 'demote', 'welcome', 'bye', 'alerts', 'antilink', 'setwelcome', 'setbye', 'hidetag', 'tagall'].includes(command);
    if (needAdmin && !isAdmin && !isOwner) return m.reply('❌ Solo admins');

    if (['kick', 'promote', 'demote', 'hidetag'].includes(command) && !isBotAdmin) return m.reply('❌ Hazme admin primero');

    switch (command) {
        case 'kick': {
            const target = getTarget();
            if (!target) return m.reply('❌ Menciona a alguien o .kick @usuario');
            await sock.groupParticipantsUpdate(m.from, [target], 'remove');
            return m.reply('✅ Eliminado de DOMINION-MD');
        }
        case 'add': {
            const num = args[0]?.replace(/[^0-9]/g, '');
            if (!num) return m.reply('❌ Pon el número: .add 521...');
            await sock.groupParticipantsUpdate(m.from, [num + '@s.whatsapp.net'], 'add');
            return m.reply('✅ Agregado');
        }
        case 'promote': {
            const target = getTarget();
            if (!target) return m.reply('❌ Menciona a alguien');
            await sock.groupParticipantsUpdate(m.from, [target], 'promote');
            return m.reply('✅ Ahora es admin 👑');
        }
        case 'demote': {
            const target = getTarget();
            if (!target) return m.reply('❌ Menciona a alguien');
            await sock.groupParticipantsUpdate(m.from, [target], 'demote');
            return m.reply('✅ Ya no es admin');
        }
        case 'welcome':
        case 'bye':
        case 'alerts':
        case 'antilink': {
            const on = text.toLowerCase() === 'on' ? true : text.toLowerCase() === 'off' ? false : null;
            if (on === null) return m.reply(`❌ Usa: .${command} on / off`);
            database.updateGroup(m.from, { [command]: on });
            return m.reply(`✅ ${command} ${on ? 'activado' : 'desactivado'}`);
        }
        case 'setwelcome': {
            if (!text) return m.reply('❌ Pon el mensaje: .setwelcome Bienvenido @user');
            database.updateGroup(m.from, { sWelcome: text });
            return m.reply('✅ Mensaje de welcome guardado');
        }
        case 'setbye': {
            if (!text) return m.reply('❌ Pon el mensaje: .setbye Adiós @user');
            database.updateGroup(m.from, { sGoodbye: text });
            return m.reply('✅ Mensaje de bye guardado');
        }
        case 'hidetag': {
            if (!text) return m.reply('❌ Pon el mensaje');
            return await sock.sendMessage(m.from, { text, mentions: participants.map((p: any) => p.id) });
        }
        case 'tagall': {
            let txt = `👑 *DOMINION-MD TAGALL*\n\n${text || 'Llamado general'}\n\n`;
            for (const p of participants) txt += `@${p.id.split('@')[0]} `;
            return await sock.sendMessage(m.from, { text: txt, mentions: participants.map((p: any) => p.id) });
        }
    }
              }
