import { defineFunction } from "@aws-amplify/backend";

export const bedrockKbFunction = defineFunction({
  name: "bedrock-kb-api",
  environment: {
    // Environment variables your function needs
    KNOWLEDGE_BASE_ID: "FRTBEFECWV", // Your actual Knowledge Base ID
    REGION: "us-east-1" // Adjust to your region
  },
  // Configure function with proper timeout and memory
  timeoutSeconds: 60, // 60 seconds timeout for Bedrock calls
  memoryMB: 1024 // Increase memory for better performance
});
