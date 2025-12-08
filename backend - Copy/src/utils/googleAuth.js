const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class GoogleAuth {
  static async verifyIdToken(idToken) {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      
      return {
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        emailVerified: payload.email_verified,
        picture: payload.picture
      };
    } catch (error) {
      throw new Error('Invalid Google ID token');
    }
  }
}

module.exports = GoogleAuth;