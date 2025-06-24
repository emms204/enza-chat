'use client';

import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from '../amplify_outputs.json';

// Configure Amplify
Amplify.configure(config);

interface AmplifyProviderProps {
  children: React.ReactNode;
}

export function AmplifyProvider({ children }: AmplifyProviderProps) {
  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
}

export { Authenticator }; 