import { GoogleGenAI, Type, FunctionDeclaration, Content, GenerateContentResponse } from "@google/genai";
import { type CreativeConcept, type GeneratedCampaign, type AspectRatio, type ImageQuality, type VideoQuality, Format, type TestCase, type TestResult } from '../types';
import { MOCK_BRAND_GUIDELINES } from '../constants';

// Create a new instance for each call to ensure the latest API key is used
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const AGENT_SYSTEM_PROMPT = `
ROLE:
You are the Enterprise Creative Director Agent. Your goal is to produce high-quality, brand-compliant visual assets (images and video). You act as a blend of creative visionary, strict brand guardian, and technical producer.

CORE OPERATIONAL LOOP (THINK -> ACT -> OBSERVE):
For every user request, you must follow this strict reasoning process before generating final output:

1.  **ANALYZE (Think):**
    * Deconstruct the user's request. Identify the subject, desired style, medium (video/image), and intended platform.
    * Identify missing critical information (e.g., aspect ratio, specific product version).

2.  **CONSULT (Act - Internal):**
    * Use the \`retrieve_brand_guidelines\` tool (RAG) to retrieve specific rules regarding the requested subject (e.g., "Show me the visual identity rules for the Q4 Product Line").
    * *CRITICAL:* Do not generate assets based on your training data alone. You must ground your style prompts in the retrieved brand documents.

3.  **EVALUATE (Decision Gate):**
    * **IF** the request violates brand guidelines (e.g., "make it look like a competitor's ad"): **REFUSE** and explain why based on the retrieved guidelines. Your response must be a plain string explaining the refusal.
    * **IF** the request is ambiguous (e.g., "make a cool video"): **ASK** a clarifying question. Do not guess on expensive video generation tasks. Your response must be a plain string with the question.
    * **IF** the request is clear and compliant: **PROCEED** to generation concepts by returning a JSON object.

4.  **EXECUTE (Act - External):**
    * Construct a detailed, technical prompt for \`generate_image\` or \`generate_video\`.
    * Include specific technical parameters (lighting, camera angle, resolution) derived from the Brand Guidelines.

5.  **OBSERVE & REFINE:**
    * Review the tool output. If the tool returns an error, retry with adjusted parameters.
`;


// Tool: Retrieve Brand Guidelines
const retrieveBrandGuidelinesTool: FunctionDeclaration = {
  name: 'retrieve_brand_guidelines',
  description: 'Queries the Enterprise Brand Knowledge Base. Use this to find hex codes, tone guidelines, and safety policies before generating any creative concepts.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'A specific question like "What are the brand safety policies?" or "Summarize the tone of voice."',
      },
    },
    required: ['query'],
  },
};

// Tool: Generate Image
const generateImageTool: FunctionDeclaration = {
    name: "generate_image",
    description: "Generates a high-quality image based on a text description. Use this tool when the user asks for visual assets, illustrations, or photographs.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            prompt: {
                type: Type.STRING,
                description: "A highly detailed, descriptive prompt for the image generation model. Include details about style, lighting, composition, and mood."
            },
            aspect_ratio: {
                type: Type.STRING,
                enum: ["1:1", "16:9", "9:16", "4:3", "3:4"],
                description: "The aspect ratio of the generated image."
            },
        },
        required: ["prompt", "aspect_ratio"]
    }
};

// Tool: Generate Video
const generateVideoTool: FunctionDeclaration = {
    name: "generate_video",
    description: "Generates a short video clip based on a text prompt. Use this tool when the user requests motion graphics, video snippets, or animated visualizations.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            prompt: {
                type: Type.STRING,
                description: "A detailed description of the video content, including the subject, action, camera movement, and artistic style."
            },
            aspect_ratio: {
                type: Type.STRING,
                enum: ["16:9", "9:16", "1:1"],
                description: "The aspect ratio of the output video."
            },
            resolution: {
                type: Type.STRING,
                enum: ["1080p", "720p"],
                description: "The resolution of the output video. High resolution (1080p) increases generation latency."
            }
        },
        required: ["prompt", "aspect_ratio", "resolution"]
    }
};


// This function simulates the execution of the tool on the client side.
function executeRetrieveBrandGuidelines(query: string): { [key: string]: any } {
  console.log(`[Brand Guardian] Executing tool 'retrieve_brand_guidelines' with query: "${query}"`);
  const context_str = MOCK_BRAND_GUIDELINES.join('\n');
  return { result: `Found Brand Guidelines:\n${context_str}` };
}

async function getAgentFirstResponse(request: string, onProgress: (message: string) => void): Promise<{response: GenerateContentResponse, history: Content[], toolResult: any}> {
    const ai = getAI();
    const model = 'gemini-2.5-flash';

    const conversationHistory: Content[] = [{
      role: 'user',
      parts: [{ text: `${AGENT_SYSTEM_PROMPT}\n\n**User's Request:** "${request}"` }]
    }];
  
    onProgress("Agent is consulting Brand Guidelines...");
    const firstResponse = await ai.models.generateContent({
      model: model,
      contents: conversationHistory,
      config: {
        tools: [{ functionDeclarations: [retrieveBrandGuidelinesTool] }],
      }
    });
    
    conversationHistory.push(firstResponse.candidates[0].content);
  
    const functionCalls = firstResponse.functionCalls;
    let toolResult = null;
    let finalResponse;
  
    if (functionCalls && functionCalls.length > 0 && functionCalls[0].name === 'retrieve_brand_guidelines') {
      const fc = functionCalls[0];
      toolResult = executeRetrieveBrandGuidelines(fc.args.query as string);
      
      conversationHistory.push({
        role: 'tool',
        parts: [{
          functionResponse: {
            name: fc.name,
            response: toolResult,
          }
        }]
      });
      
      onProgress("Agent is formulating a response...");
      finalResponse = await ai.models.generateContent({
        model: model,
        contents: conversationHistory,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              concepts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    style: { type: Type.STRING },
                    image_prompt: { type: Type.STRING },
                    video_prompt: { type: Type.STRING },
                  },
                  required: ["id", "title", "description", "style", "image_prompt", "video_prompt"],
                }
              }
            },
            required: ["concepts"],
          }
        }
      });
    } else {
      finalResponse = firstResponse;
    }

    return { response: finalResponse, history: conversationHistory, toolResult };
}


export async function generateCreativeConcepts(request: string, onProgress: (message: string) => void): Promise<CreativeConcept[] | { aiResponseType: 'clarification' | 'refusal', message: string }> {
  
  const { response } = await getAgentFirstResponse(request, onProgress);
  
  const jsonText = response.text.trim();

  // Check if the response is a refusal or clarification
  if (!jsonText.startsWith('{') && !jsonText.startsWith('[')) {
      const isRefusal = jsonText.toLowerCase().includes('cannot') || jsonText.toLowerCase().includes('prohibited');
      return {
          aiResponseType: isRefusal ? 'refusal' : 'clarification',
          message: jsonText,
      };
  }

  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed.concepts) {
      throw new Error(`The AI response did not contain the expected 'concepts' array. Response: ${jsonText}`);
    }
    return parsed.concepts.map((concept: CreativeConcept, index: number) => ({...concept, id: concept.id || index + 1 }));
  } catch (e) {
      console.error("Failed to parse JSON from AI response:", jsonText);
      throw new Error(`The AI returned a non-JSON response, possibly refusing the request. Please check the prompt. AI Response: ${jsonText}`);
  }
}

async function generateImage(prompt: string, aspectRatio: AspectRatio, imageSize: ImageQuality): Promise<string> {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            imageConfig: {
                aspectRatio: aspectRatio,
                imageSize: imageSize,
            },
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image data found in response");
}

async function generateVideo(prompt: string, aspectRatio: AspectRatio, resolution: VideoQuality): Promise<string> {
    const ai = getAI();
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: resolution,
            aspectRatio: aspectRatio
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }
    
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const blob = await videoResponse.blob();
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}


export async function generateFinalAsset(
    concept: CreativeConcept,
    format: Format,
    aspectRatio: AspectRatio,
    imageQuality: ImageQuality,
    videoQuality: VideoQuality,
    onProgress: (message: string) => void
): Promise<GeneratedCampaign | { aiResponseType: 'refusal', message: string }> {
    console.log(`[Memory] User has selected style: '${concept.style}'. Agent is now in execution mode.`);
    const ai = getAI();
    const model = 'gemini-2.5-flash';

    const tools = format === 'image' ? [generateImageTool] : [generateVideoTool];
    const promptForFinalAsset = `
      You are the Technical Producer AI. The user has approved a creative concept.
      Your task is to execute the final generation using the correct tool.
      
      **Approved Concept Details:**
      - **Title:** ${concept.title}
      - **Description:** ${concept.description}
      - **Style:** ${concept.style}
      - **Image Prompt:** ${concept.image_prompt}
      - **Video Prompt:** ${concept.video_prompt}

      The user wants a final asset in **'${format}'** format.
      
      **Your Action:**
      1.  Analyze the approved concept and the requested format ('${format}').
      2.  Call the appropriate tool ('generate_image' or 'generate_video') to create the asset.
      3.  Use the concept's specific prompts ('image_prompt' or 'video_prompt') to generate the asset.
      4.  Ensure the aspect ratio and quality settings are passed correctly to the tool.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: promptForFinalAsset }] }],
        config: {
            tools: [{ functionDeclarations: tools }],
        }
    });

    const fc = response.functionCalls?.[0];

    if (!fc) {
        const textResponse = response.text.trim();
        return {
            aiResponseType: 'refusal',
            message: textResponse || "Agent failed to call a generation tool. It may have refused the request based on its instructions."
        };
    }

    let mediaUrl: string;

    if (fc.name === 'generate_image') {
        onProgress('Generating high-resolution image...');
        const args = fc.args as { prompt: string, aspect_ratio: AspectRatio };
        const imageData = await generateImage(args.prompt, args.aspect_ratio, imageQuality);
        mediaUrl = `data:image/png;base64,${imageData}`;
    } else if (fc.name === 'generate_video') {
        onProgress('Rendering video... This may take a few minutes.');
        const args = fc.args as { prompt: string, aspect_ratio: AspectRatio, resolution: VideoQuality };
        mediaUrl = await generateVideo(args.prompt, args.aspect_ratio, args.resolution);
    } else {
        throw new Error(`Agent called an unknown tool: ${fc.name}`);
    }

    return {
        ...concept,
        format,
        mediaUrl,
    };
}


async function evaluateWithLlmJudge(userInput: string, ragContext: string, agentAction: string): Promise<any> {
  const ai = getAI();
  const model = 'gemini-2.5-flash';

  const judgePrompt = `
    SYSTEM ROLE:
    You are the Brand Compliance Auditor. Your job is to evaluate the "Creative Director Agent" based on a strict rubric.

    INPUT DATA:
    1. **User Request:** ${userInput}
    2. **Retrieved Context (Brand Guidelines):** ${ragContext}
    3. **Agent's Final Action:** ${agentAction}

    EVALUATION RUBRIC (1-5):
    * **5 (Perfect):** The tool parameters (prompt, aspect ratio) perfectly align with the User Request AND the Retrieved Context. No prohibited terms used.
    * **3 (Acceptable):** The tool parameters match the User Request, but ignore some stylistic nuance from the Retrieved Context.
    * **1 (Fail):** The agent ignored the Retrieved Context (e.g., used a prohibited color) OR failed to address the User Request.

    TASK:
    Compare the Agent's Action against the Brand Guidelines in the Retrieved Context.
    Output valid JSON:
    {
      "score": INTEGER,
      "reasoning": "STRING",
      "violation_detected": BOOLEAN
    }
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: [{ role: 'user', parts: [{ text: judgePrompt }] }],
    config: {
        responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text.trim());
}

export async function runAndEvaluateTestCase(testCase: TestCase, onProgress: (message: string) => void): Promise<TestResult> {
    const trajectory: string[] = [];
    
    try {
        trajectory.push(`[USER PROMPT] -> ${testCase.userPrompt}`);

        const { response, toolResult } = await getAgentFirstResponse(testCase.userPrompt, (msg) => {
            onProgress(msg);
            trajectory.push(`[AGENT STEP] -> ${msg}`);
        });

        const ragContext = toolResult?.result || "No RAG context retrieved.";
        const agentAction = response.text.trim();
        
        trajectory.push(`[FINAL ACTION] -> ${agentAction}`);
        onProgress("Evaluating agent's response...");

        const evaluation = await evaluateWithLlmJudge(testCase.userPrompt, ragContext, agentAction);

        return {
            testCase,
            trajectory,
            finalAction: agentAction,
            evaluation,
        };

    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("Error running test case:", errorMessage);
        return {
            testCase,
            trajectory,
            finalAction: "Error occurred during test.",
            evaluation: null,
            error: errorMessage,
        };
    }
}
