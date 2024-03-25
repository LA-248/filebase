import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import generateUUID from '../services/uuid-generator.mjs';

export default function configurePassport(db) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
      },
      function (accessToken, refreshToken, profile, done) {
        // Extract user's Google ID from the profile
        const googleId = profile.id;
        const query = 'SELECT * FROM users WHERE googleId = ?';

        db.get(query, [googleId], (err, row) => {
          if (err) {
            return done(err);
          }

          if (row) {
            // User already exists
            return done(null, row);
          } else {
            // Create a new user
            const newUser = {
              googleId: profile.id,
              displayName: profile.displayName,
              publicFolderId: generateUUID(),
            };

            // Insert the new user into the database
            db.run(
              'INSERT INTO users (googleId, displayName, publicFolderId) VALUES (?, ?, ?)',
              [newUser.googleId, newUser.displayName, newUser.publicFolderId],
              (err) => {
                if (err) {
                  return done(err);
                }
                // Return the new user with the inserted id
                newUser.id = this.lastID;
                return done(null, newUser);
              }
            );
          }
        });
      }
    )
  );

  // Defines how to store user information in the session
  // Store only the user's ID in the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Defines how to retrieve user information from the session
  // Fetch all user information from the database using the stored user ID
  passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        return done(err);
      }
      done(null, row);
    });
  });
}
