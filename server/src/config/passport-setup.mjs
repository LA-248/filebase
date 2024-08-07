import passport from 'passport';
import { User } from '../models/user-model.mjs';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export default function configurePassport(db) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          // Extract user's Google ID from the profile
          const googleId = profile.id;

          const user = await User.retrieveUserByGoogleId(googleId);

          if (user) {
            // User already exists
            return done(null, user);
          } else {
            // If the user does not exist, create a new user
            const newUser = await User.insertNewUser(googleId);
            console.log(newUser);
            return done(null, newUser);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Defines how to store user information in the session
  // Store only the user's ID in the session
  passport.serializeUser((user, done) => {
    // Check if user object has an id property
    if (user && user.id) {
      done(null, user.id);
    } else {
      done(new Error('User object does not have an id property'));
    }
  });

  // Defines how to retrieve user information from the session
  // Fetch all user information from the database using the stored user ID
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.retrieveUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
