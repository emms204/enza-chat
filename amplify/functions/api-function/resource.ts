import { defineFunction } from "@aws-amplify/backend";

export const bedrockKbFunction = defineFunction({
  name: "bedrock-kb-api",
  environment: {
    // Environment variables your function needs
    KNOWLEDGE_BASE_ID: "DN5XHBICMZ", // Your actual Knowledge Base ID
    REGION: "eu-west-1" // Adjust to your region
  },
  // Configure function with proper timeout and memory
  timeoutSeconds: 60, // 60 seconds timeout for Bedrock calls
  memoryMB: 1024 // Increase memory for better performance
});
