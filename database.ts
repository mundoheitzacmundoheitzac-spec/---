import { DatabaseSync } from 'node:sqlite';

// Base de datos de DOMINION-MD
// Solo guarda config de grupos, nada de economia ni gacha

export interface GroupSettings {
    id: string;
    welcome: boolean;
    bye: boolean;
    alerts: boolean;
    antilink: boolean;
    sWelcome: string;
    sGoodbye: string;
}

const db = new DatabaseSync('dominion.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        welcome INTEGER DEFAULT 0,
        bye INTEGER DEFAULT 0,
        alerts INTEGER DEFAULT 0,
        antilink INTEGER DEFAULT 0,
        sWelcome TEXT DEFAULT '',
        sGoodbye TEXT DEFAULT ''
    )
`);

function toGroup(row: any): GroupSettings {
    return {
        id: row.id,
        welcome: row.welcome === 1,
        bye: row.bye === 1,
        alerts: row.alerts === 1,
        antilink: row.antilink === 1,
        sWelcome: row.sWelcome || '',
        sGoodbye: row.sGoodbye || '',
    };
}

export const database = {
    getGroup(id: string): GroupSettings {
        let row = db.prepare('SELECT * FROM groups WHERE id = ?').get(id) as any;
        if (!row) {
            db.prepare('INSERT INTO groups (id) VALUES (?)').run(id);
            row = db.prepare('SELECT * FROM groups WHERE id = ?').get(id) as any;
        }
        return toGroup(row);
    },

    updateGroup(id: string, data: Partial<GroupSettings>) {
        this.getGroup(id);
        const keys = Object.keys(data);
        if (keys.length === 0) return;
        const sets = keys.map(k => `${k} = ?`).join(', ');
        const values = keys.map(k => {
            const v: any = (data as any)[k];
            if (typeof v === 'boolean') return v ? 1 : 0;
            return v;
        });
        db.prepare(`UPDATE groups SET ${sets} WHERE id = ?`).run(...values, id);
    },
};

export default database;
