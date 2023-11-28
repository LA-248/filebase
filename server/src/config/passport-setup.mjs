import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export default function configurePassport(db) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
      },
      function (accessToken, refreshToken, profile, done) {
        const googleId = profile.id;
  
        db.get(
          'SELECT * FROM users WHERE googleId = ?',
          [googleId],
          (err, row) => {
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
              };
  
              db.run(
                'INSERT INTO users (googleId, displayName) VALUES (?, ?)',
                [newUser.googleId, newUser.displayName],
                function (err) {
                  if (err) {
                    return done(err);
                  }
                  // Return the new user with the inserted id
                  newUser.id = this.lastID;
                  return done(null, newUser);
                }
              );
            }
          }
        );
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        return done(err);
      }
      done(null, row);
    });
  });
}
