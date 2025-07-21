export function request(ctx) {
    const { input } = ctx.args;
    return {
      resourcePath: "/knowledgebases/DN5XHBICMZ/retrieve",
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          retrievalQuery: {
            text: input,
          },
        }),
      },
    };
  }
  
  export function response(ctx) {
    return JSON.stringify(ctx.result.body);
  }
  

// export function request(ctx) {
//   var input = ctx.args.input;
  
//   var requestPayload = {
//     retrievalQuery: {
//       text: input,
//     },
//     retrievalConfiguration: {
//       vectorSearchConfiguration: {
//         numberOfResults: 5
//       }
//     }
//   };
  
//   return {
//     resourcePath: "/knowledgebases/FRTBEFECWV/retrieve",
//     method: "POST",
//     params: {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestPayload),
//     },
//   };
// }

// export function response(ctx) {
//   try {
//     // Parse the response and format it for the AI conversation
//     var result = JSON.parse(ctx.result.body);
    
//     // Extract the retrieved passages and format them
//     var retrievedPassages = [];
//     if (result.retrievalResults && Array.isArray(result.retrievalResults)) {
//       for (var i = 0; i < result.retrievalResults.length; i++) {
//         var item = result.retrievalResults[i];
//         var passage = {
//           content: (item.content && item.content.text) ? item.content.text : 'No content available',
//           metadata: item.metadata || {},
//           location: item.location || {},
//           score: item.score || 0
//         };
//         retrievedPassages.push(passage);
//       }
//     }
    
//     // Return formatted response that includes both the text and source information
//     var textContent = [];
//     for (var j = 0; j < retrievedPassages.length; j++) {
//       textContent.push(retrievedPassages[j].content);
//     }
    
//     var formattedResponse = {
//       passages: retrievedPassages,
//       text: textContent.join('\n\n')
//     };
    
//     return JSON.stringify(formattedResponse);
//   } catch (error) {
//     throw error;
//   }
// } 