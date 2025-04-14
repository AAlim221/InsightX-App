export default {
    expo: {
      name: "InsightX App",
      slug: "insightx-app",
      version: "1.0.0",
      ios: {
        bundleIdentifier: "com.yourcompany.yourapp",
        googleServicesFile: "./GoogleService-Info.plist"
      },
      android: {
        googleServicesFile: "./google-services.json"
      },
      web: {
        config: {
          firebase: {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_PROJECT.firebaseapp.com"
          }
        }
      }
    }
  };
  