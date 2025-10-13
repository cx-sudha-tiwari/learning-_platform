import express from 'express';
import db from '../database.js';
import User from '../models/User.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/user/profile - Get current user profile (protected)
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const sanitizedUser = User.sanitize(user);

    res.json({
      success: true,
      data: sanitizedUser
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// PUT /api/user/profile - Update user profile (protected)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, interests } = req.body;
    const userId = req.user.userId;

    // Basic validation
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters'
      });
    }

    // Update user
    const interestsJson = JSON.stringify(interests || []);
    const stmt = db.prepare(`
      UPDATE users 
      SET full_name = ?, interests = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(fullName.trim(), interestsJson, userId);

    const updatedUser = User.findById(userId);
    const sanitizedUser = User.sanitize(updatedUser);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: sanitizedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

export default router;
