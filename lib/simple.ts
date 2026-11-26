import { WASocket, proto, downloadContentFromMessage, generateWAMessageFromContent } from '@whiskeysockets/baileys';

export type M = proto.IWebMessageInfo & {
    text: string;
    sender: string;
    isGroup: boolean;
    from: string;
    reply: (text: string | Buffer, options?: any) => Promise<any>;
    react: (emoji: string) => Promise<any>;
};

export function UserJid(jid: string) {
    return jid.split(':')[0] + '@s.whatsapp.net';
}

export async function serialize(sock: WASocket, msg: proto.IWebMessageInfo): Promise<M> {
    const m: any = msg;
    m.from = msg.key.remoteJid || '';
    m.isGroup = m.from.endsWith('@g.us');
    m.sender = UserJid(msg.key.participant || msg.key.remoteJid || '');

    const msgType = Object.keys(msg.message || {})[0] as any;
    const content: any = msg.message?.[msgType];
    m.text = content?.caption || content?.text || content?.conversation || '';

    // Quitar espacios de más
    m.text = m.text?.trim() || '';

    m.reply = async (text: string | Buffer, options: any = {}) => {
        if (Buffer.isBuffer(text)) {
            return await sock.sendMessage(m.from, { image: text, caption: options.caption || '', ...options }, { quoted: msg });
        }
        return await sock.sendMessage(m.from, { text: text.toString(), ...options }, { quoted: msg });
    };

    m.react = async (emoji: string) => {
        return await sock.sendMessage(m.from, { react: { text: emoji, key: msg.key } });
    };

    return m as M;
}

export default serialize;
