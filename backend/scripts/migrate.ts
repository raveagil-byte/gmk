import { query } from '../src/db';
import fs from 'fs';
import path from 'path';

async function migrate() {
    console.log('Starting migration...');
    try {
        const sqlPath = path.join(__dirname, '../src/schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by statement if needed, but pg can handle multiple statements
        await query(sql);

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
