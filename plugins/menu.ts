export const command = ['menu', 'help', 'ayuda'];

export default async function (sock: any, m: any, { config }: any) {
    const menu = `
╭─ 👑 *DOMINION-MD* ─
│
│ Hola @${m.sender.split('@')[0]}
│ Prefijo: ${config.prefix}
│
├─ 👥 *GRUPOS*
│ ${config.prefix}kick
│ ${config.prefix}add
│ ${config.prefix}promote
│ ${config.prefix}demote
│ ${config.prefix}welcome on/off
│ ${config.prefix}bye on/off
│ ${config.prefix}alerts on/off
│ ${config.prefix}antilink on/off
│ ${config.prefix}setwelcome
│ ${config.prefix}setbye
│ ${config.prefix}hidetag
│ ${config.prefix}tagall
│
├─ 📥 *DESCARGAS*
│ ${config.prefix}play
│ ${config.prefix}play2
│ ${config.prefix}ytmp3
│ ${config.prefix}ytmp4
│ ${config.prefix}tiktok
│ ${config.prefix}ig
│ ${config.prefix}fb
│
├─ 👑 *DUEÑO*
│ ${config.prefix}ping
│ ${config.prefix}owner
│ ${config.prefix}bc
│
├─ 🎲 *DIVERSIÓN*
│ ${config.prefix}gay
│ ${config.prefix}ship
│ ${config.prefix}top
│ ${config.prefix}dado
│ ${config.prefix}ppt
│
╰─ DOMINION-MD by @${config.ownerName}
`.trim();

    await m.reply(menu);
}
