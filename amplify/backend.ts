import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";


// Replace with your own Knowledge Base ID
// https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-create.html
const KB_REGION = "eu-west-1";
const KB_ID = "DN5XHBICMZ";

const backend = defineBackend({
  auth,
  data,
});

const KnowledgeBaseDataSource =
  backend.data.resources.graphqlApi.addHttpDataSource(
    "KnowledgeBaseDataSource",
    `https://bedrock-agent-runtime.${KB_REGION}.amazonaws.com`,
    {
      authorizationConfig: {
        signingRegion: KB_REGION,
        signingServiceName: "bedrock",
      },
    }
  );

KnowledgeBaseDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [`arn:aws:bedrock:${KB_REGION}:*:knowledge-base/${KB_ID}`],
    actions: ["bedrock:Retrieve"],
  })
);

export { backend };