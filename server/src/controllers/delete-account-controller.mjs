import { db } from "../services/database.mjs";

// Permanently delete a user's account and all associated data
export const deleteAccount = (req, res) => {
  const userId = req.user.id;
  
  // Start a transaction
  db.run('BEGIN TRANSACTION', (err) => {
    if (err) {
      console.error('Error starting transaction:', err.message);
      return res.status(500).send('An error occurred.');
    }

    // Step 1: Delete user's folders
    db.run('DELETE FROM folders WHERE userId = ?', [userId], (err) => {
      if (err) {
        db.run('ROLLBACK', () => res.status(500).send('An error occurred when trying to delete folder data.'));
        return;
      }

      // Step 2: Delete user's files
      db.run('DELETE FROM files WHERE userId = ?', [userId], (err) => {
        if (err) {
          db.run('ROLLBACK', () => res.status(500).send('An error occurred when trying to delete file data.'));
          return;
        }

        // Step 3: Delete user
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
                console.log('Account deleted successfully.')
                res.status(200).send('Account deleted successfully.');
              });
            });
          });
        });
      });
    });
  });
};
