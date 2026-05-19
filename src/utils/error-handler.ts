/**
 * Error handling utilities for Printify MCP
 */

/**
 * Format an error response for tool output
 */
export function formatErrorResponse(
  error: any,
  step: string,
  context: Record<string, any> = {},
  tips: string[] = []
) {
  const errorMessage = error.message || 'Unknown error';

  let text = `❌ **Error in ${step}**\n\n`;
  text += `- **Error**: ${errorMessage}\n\n`;

  if (error.response) {
    text += `- **API Response Status**: ${error.response.status}\n\n`;
  }
  
  // Add tips if provided
  if (tips.length > 0) {
    text += `\n🔄 Please try again with a different prompt or parameters.\n\n`;
    text += '💡 **Tips**:\n';
    tips.forEach(tip => {
      text += `• ${tip}\n`;
    });
  }
  
  return {
    content: [{ type: "text", text }],
    isError: true
  };
}

/**
 * Format a success response for tool output
 */
export function formatSuccessResponse(
  title: string,
  data: Record<string, any> = {},
  additionalText: string = ''
) {
  let text = `✅ **${title}**\n\n`;
  
  // Add data information
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string' && value.includes('"')) {
      text += `- **${key}**: ${value}\n`;
    } else if (typeof value === 'object') {
      text += `- **${key}**: ${JSON.stringify(value)}\n`;
    } else {
      text += `- **${key}**: "${value}"\n`;
    }
  });
  
  // Add additional text if provided
  if (additionalText) {
    text += `\n${additionalText}`;
  }
  
  return {
    content: [{ type: "text", text }]
  };
}
