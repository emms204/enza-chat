import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

// Create the knowledge base HTTP data source for AppSync
const KnowledgeBaseDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "KnowledgeBaseDataSource",
  `https://bedrock-agent-runtime.${cdk.Stack.of(backend.data).region}.amazonaws.com`,
  {
    authorizationConfig: {
      signingRegion: cdk.Stack.of(backend.data).region,
      signingServiceName: "bedrock",
    },
  },
);

// Grant permissions to retrieve from the knowledge base
KnowledgeBaseDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      `arn:aws:bedrock:${cdk.Stack.of(backend.data).region}:[634775120307]:knowledge-base/[FRTBEFECWV]`
    ],
    actions: ["bedrock:Retrieve"],
  }),
);

export { backend };
