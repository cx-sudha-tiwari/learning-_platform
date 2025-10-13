import db from '../database.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

class User {
  static async create({ fullName, email, password, role, interests }) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const interestsJson = JSON.stringify(interests || []);

    const stmt = db.prepare(`
      INSERT INTO users (full_name, email, password_hash, role, interests)
      VALUES (?, ?, ?, ?, ?)
    `);

    try {
      const result = stmt.run(fullName, email, passwordHash, role, interestsJson);
      return this.findById(result.lastInsertRowid);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('Email already registered');
      }
      throw error;
    }
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id);
    if (user && user.interests) {
      user.interests = JSON.parse(user.interests);
    }
    return user;
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);
    if (user && user.interests) {
      user.interests = JSON.parse(user.interests);
    }
    return user;
  }

  static async verifyPassword(plainPassword, passwordHash) {
    return await bcrypt.compare(plainPassword, passwordHash);
  }

  static setVerificationToken(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const stmt = db.prepare(`
      UPDATE users 
      SET verification_token = ?, verification_token_expires = ?
      WHERE id = ?
    `);
    stmt.run(token, expires, userId);
    return token;
  }

  static findByVerificationToken(token) {
    const stmt = db.prepare(`
      SELECT * FROM users 
      WHERE verification_token = ? 
      AND verification_token_expires > datetime('now')
    `);
    const user = stmt.get(token);
    if (user && user.interests) {
      user.interests = JSON.parse(user.interests);
    }
    return user;
  }

  static verifyEmail(userId) {
    const stmt = db.prepare(`
      UPDATE users 
      SET email_verified = 1, 
          verification_token = NULL, 
          verification_token_expires = NULL
      WHERE id = ?
    `);
    stmt.run(userId);
  }

  static setResetToken(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    const stmt = db.prepare(`
      UPDATE users 
      SET reset_token = ?, reset_token_expires = ?
      WHERE id = ?
    `);
    stmt.run(token, expires, userId);
    return token;
  }

  static findByResetToken(token) {
    const stmt = db.prepare(`
      SELECT * FROM users 
      WHERE reset_token = ? 
      AND reset_token_expires > datetime('now')
    `);
    const user = stmt.get(token);
    if (user && user.interests) {
      user.interests = JSON.parse(user.interests);
    }
    return user;
  }

  static async resetPassword(userId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const stmt = db.prepare(`
      UPDATE users 
      SET password_hash = ?, 
          reset_token = NULL, 
          reset_token_expires = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(passwordHash, userId);
  }

  static sanitize(user) {
    if (!user) return null;
    const { password_hash, verification_token, verification_token_expires, reset_token, reset_token_expires, ...sanitized } = user;
    return sanitized;
  }
}

export default User;
