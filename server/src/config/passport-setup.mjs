import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export default function configurePassport(db) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
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
            };

            // Insert the new user into the database
            db.run('INSERT INTO users (googleId) VALUES (?)', [newUser.googleId], function(err) {
              if (err) {
                return done(err);
              }
              // The 'this' context here is correct for the db.run callback, capturing the lastID
              // Return the new user with the inserted id
              newUser.id = this.lastID;
              return done(null, newUser);
            });
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
