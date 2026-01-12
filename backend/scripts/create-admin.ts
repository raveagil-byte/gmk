import { UserModel } from '../src/models/userModel';
import { query } from '../src/db';
import bcrypt from 'bcryptjs';

async function createAdmin() {
    try {
        console.log('Seeding admin user...');

        const email = 'admin@kurirtrack.com';
        const password = 'admin';

        // Check if exists
        const existing = await UserModel.findByEmail(email);
        if (existing) {
            console.log('Admin already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await UserModel.create({
            email,
            name: 'System Admin',
            role: 'ADMIN',
            password_hash: hash
        });

        console.log('Admin created successfully.');
        console.log('Email: admin@kurirtrack.com');
        console.log('Password: admin');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}

createAdmin();
