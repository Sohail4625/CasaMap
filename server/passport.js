const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {User} = require("./database");
const crypto = require("crypto");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails } = profile;
        const baseUsername = displayName
          .replace(/[^a-zA-Z0-9]/g, "")
          .toLowerCase(); // Clean up the display name

        // Generate a unique username
        let username = baseUsername;
        let unique = false;

        while (!unique) {
          const existingUser = await User.findOne({ username });
          if (!existingUser) {
            unique = true;
          } else {
            // Append a random string to the username to ensure uniqueness
            username = `${baseUsername}${crypto
              .randomBytes(4)
              .toString("hex")}`;
          }
        }

        // Find or create user
        const existingUser = await User.findOne({ googleId: id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const email =
          emails && emails[0] ? emails[0].value : null ;

        // Create a new user
        const newUser = new User({
          googleId: id,
          name: displayName,
          username: username,
          email: email,
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
