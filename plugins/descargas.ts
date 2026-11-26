import axios from 'axios';

export const command = ['play', 'play2', 'ytmp3', 'ytmp4', 'tiktok', 'ig', 'fb'];

async function tryApis(urls: string[]) {
    for (const u of urls) {
        try {
            const r = await axios.get(u, { timeout: 15000 });
            if (r.data) return r.data;
        } catch {}
    }
    return null;
}

export default async function (sock: any, m: any, { text, command }: any) {
    try {
        if (command === 'play' || command === 'play2') {
            if (!text) return m.reply('❌ Pon el nombre: .play 【entity-Peso Pluma¦canonical_name=Peso Pluma】');
            await m.reply('⏳ Buscando...');

            // Intento 1 - vreden
            let data: any = await tryApis([
                `https://api.vreden.my.id/api/ytplay?query=${encodeURIComponent(text)}`,
                `https://api.siputzx.my.id/api/dl/youtube/mp3?query=${encodeURIComponent(text)}`
            ]);
            // vreden viene en result.download.url, siputzx en data.dl
            let url = data?.result?.download?.url || data?.data?.dl || data?.result?.url;
            if (!url) return m.reply('❌ No encontré eso, intenta con otro nombre');
            await sock.sendMessage(m.from, { audio: { url }, mimetype: 'audio/mpeg' }, { quoted: m.message });
            return;
        }

        if (command === 'ytmp3') {
            if (!text) return m.reply('❌ Pon el link');
            await m.reply('⏳ Descargando mp3...');
            let data: any = await tryApis([
                `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(text)}`,
                `https://api.siputzx.my.id/api/dl/youtube/mp3?url=${encodeURIComponent(text)}`
            ]);
            let url = data?.result?.download?.url || data?.data?.dl;
            if (!url) return m.reply('❌ No pude, intenta con otro link');
            await sock.sendMessage(m.from, { audio: { url }, mimetype: 'audio/mpeg' }, { quoted: m.message });
            return;
        }

        if (command === 'ytmp4') {
            if (!text) return m.reply('❌ Pon el link');
            await m.reply('⏳ Descargando mp4...');
            let data: any = await tryApis([
                `https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(text)}`
            ]);
            let url = data?.result?.download?.url;
            if (!url) return m.reply('❌ No pude, intenta otro link');
            await sock.sendMessage(m.from, { video: { url }, caption: '✅ DOMINION-MD' }, { quoted: m.message });
            return;
        }

        if (command === 'tiktok') {
            if (!text) return m.reply('❌ Pon el link de TikTok');
            await m.reply('⏳ Descargando TikTok...');
            let data: any = await tryApis([
                `https://api.vreden.my.id/api/tiktok?url=${encodeURIComponent(text)}`,
                `https://api.siputzx.my.id/api/dl/tiktok?url=${encodeURIComponent(text)}`
            ]);
            let url = data?.result?.video?.url || data?.result?.play || data?.data?.play;
            if (!url) return m.reply('❌ No pude, el video es privado o el link está mal');
            await sock.sendMessage(m.from, { video: { url }, caption: '✅ DOMINION-MD' }, { quoted: m.message });
            return;
        }

        if (command === 'ig' || command === 'fb') {
            if (!text) return m.reply('❌ Pon el link');
            await m.reply('⏳ Descargando...');
            let data: any = await tryApis([
                `https://api.vreden.my.id/api/igdownload?url=${encodeURIComponent(text)}`
            ]);
            let url = data?.result?.[0]?.url;
            if (!url) return m.reply('❌ No pude, Instagram/Facebook bloquea mucho esos links');
            await sock.sendMessage(m.from, { video: { url }, caption: '✅ DOMINION-MD' }, { quoted: m.message });
            return;
        }

    } catch (e) {
        console.error(e);
        await m.reply('❌ Error en descarga, intenta de nuevo');
    }
    }
