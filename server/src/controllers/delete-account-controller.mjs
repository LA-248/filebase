import { db } from '../services/database.mjs';
import { User } from '../models/user-model.mjs';
import { File } from '../models/file-model.mjs';
import { Folder } from '../models/folder-model.mjs';
import { deleteS3Object } from './delete-file-controller.mjs';

// Permanently delete a user's account and all associated data
export const deleteAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    // Start transaction
    await new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    // Step 1: Fetch filenames to delete from S3
    const files = await File.fetchAllFileNamesByUserId(userId);

    // Step 2: Delete user's files from the database
    await File.deleteFilesByUserId(userId);

    // Delete files from S3
    for (let i = 0; i < files.length; i++) {
      await deleteS3Object(files[i].fileName);
    }

    // Step 3: Delete user's folders
    await Folder.deleteFoldersByUserId(userId);

    // Step 4: Delete user
    await User.deleteUserById(userId);
    
    // Commit transaction
    await new Promise((resolve, reject) => {
      db.run('COMMIT', (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    // After the account is deleted, destroy the user's session
    req.logout((logoutErr) => {
      if (logoutErr) {
        console.error('Logout error:', logoutErr);
        return res.status(500).json({ message: 'An error occurred while logging out. Please try again.' });
      }
      req.session.destroy((sessionDestroyErr) => {
        if (sessionDestroyErr) {
          console.error('Session destruction error:', sessionDestroyErr);
          return res.status(500).json({ message: 'An error occurred while logging out. Please try again.' });
        }
        res.clearCookie('connect.sid');
        console.log('Account deleted successfully.');
        return res.status(200).json({ message: 'Account deleted successfully.' });
      });
    });
  } catch (error) {
    console.error('Error during account deletion:', error);
    try { // Wrap the rollback in a try-catch block for error handling
      await new Promise((resolve, reject) => {
        db.run('ROLLBACK', (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
      console.log('Operations were rolled back.');
    } catch (rollbackError) {
      console.error('Rollback error:', rollbackError);
      return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
    return res.status(500).json({ message: 'Error deleting your account. Please try again.' });
  }
};
