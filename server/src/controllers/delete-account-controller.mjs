import { db } from '../services/database.mjs';
import { deleteS3Object } from './delete-file-controller.mjs';

// Permanently delete a user's account and all associated data
export const deleteAccount = (req, res) => {
  const userId = req.user.id;

  // Start a transaction
  db.run('BEGIN TRANSACTION', (err) => {
    if (err) {
      console.error('Error starting transaction:', err.message);
      return res.status(500).send('An error occurred.');
    }

    // Step 1: Fetch filenames to delete from S3
    db.all('SELECT fileName FROM files WHERE userId = ?', [userId], async (err, rows) => {
      if (err) {
        db.run('ROLLBACK', () => res.status(500).send('An error occurred when fetching file data.'));
        return;
      }

      try {
        // Step 2: Delete user's files from the database
        db.run('DELETE FROM files WHERE userId = ?', [userId], async (err) => {
          if (err) {
            db.run('ROLLBACK', () => res.status(500).send('An error occurred when trying to delete file data.'));
            return;
          }

          // Delete files from S3
          for (let i = 0; i < rows.length; i++) {
            await deleteS3Object(rows[i].fileName);
          }

          // Step 3: Delete user's folders
          db.run('DELETE FROM folders WHERE userId = ?', [userId], (err) => {
            if (err) {
              db.run('ROLLBACK', () => res.status(500).send('An error occurred when trying to delete folder data.'));
              return;
            }

            // Step 4: Delete user
            db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
              if (err) {
                db.run('ROLLBACK', () => res.status(500).send('An error occurred when trying to delete user data.'));
                return;
              }

              // Commit transaction
              db.run('COMMIT', (err) => {
                if (err) {
                  console.error('Error committing transaction:', err.message);
                  db.run('ROLLBACK', () => res.status(500).send('An error occurred when trying to commit the database transaction.'));
                  return;
                }

                // After the account is deleted, destroy the user's session
                req.logout((logoutErr) => {
                  if (logoutErr) {
                    console.error('Logout error:', logoutErr);
                    return res.status(500).send('An error occurred while logging out.');
                  }
                  req.session.destroy((sessionDestroyErr) => {
                    if (sessionDestroyErr) {
                      console.error('Session destruction error:', sessionDestroyErr);
                      return res.status(500).send('An error occurred while destroying session.');
                    }
                    res.clearCookie('connect.sid');
                    console.log('Account deleted successfully.');
                    res.status(200).send('Account deleted successfully.');
                  });
                });
              });
            });
          });
        });
      } catch (s3Error) {
        console.error('Error deleting files from S3:', s3Error);
        db.run('ROLLBACK', () => res.status(500).send('An error occurred when trying to delete files from S3.'));
      }
    });
  });
};
