import { Amplify } from 'aws-amplify';
import config from '../amplify_outputs.json';

// Configure Amplify for both client and server-side
Amplify.configure(config, {
  ssr: true, // Enable SSR support
});

export default config; 