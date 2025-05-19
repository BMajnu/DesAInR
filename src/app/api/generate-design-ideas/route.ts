// API route for generating creative design ideas
import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';

// Schema for the design ideas generation input
const GenerateDesignIdeasInputSchema = z.object({
  text: z.string().describe("The text or saying to base design ideas on"),
  userProfile: z.any().optional().describe("The user's profile information"),
  modelId: z.string().optional().describe("The model ID to use for generation")
});

// Schema for the design ideas generation output
const GenerateDesignIdeasOutputSchema = z.object({
  creativeDesignIdeas: z.string().describe("5 creative design ideas based on the text"),
  typographyIdeas: z.string().describe("2 creative typography design ideas based on the text")
});

// Define the prompt for generating design ideas
const generateDesignIdeasPrompt = ai.definePrompt({
  name: 'generateDesignIdeasPrompt',
  input: { schema: GenerateDesignIdeasInputSchema },
  output: { schema: GenerateDesignIdeasOutputSchema },
  prompt: `You are a professional graphic designer tasked with generating creative design ideas based on the provided text or saying. 

Given this text: "{{text}}"

Generate the following:

1. 5 detailed creative design ideas inspired by this text. For each idea, provide:
   - A clear visual concept description
   - Style suggestions (vintage, modern, minimalist, etc.)
   - Color palette ideas
   - Visual elements to include

2. 2 creative typography-only design ideas (no graphics) inspired by this text. For each idea, provide:
   - Font style suggestions
   - Typography layout concepts
   - Treatment ideas (effects, arrangements, etc.)

Format your response with clear sections for each idea. Be detailed, creative, and diverse in your suggestions.
`,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, userProfile, modelId = DEFAULT_MODEL_ID } = body;
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    try {
      // Generate design ideas using the Genkit AI
      const { output } = await generateDesignIdeasPrompt(
        { text },
        { model: modelId }
      );

      return NextResponse.json(output);
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      
      // Fallback response if AI generation fails
      const fallbackResponse = {
        creativeDesignIdeas: `Based on "${text}", here are 5 creative design ideas:\n\n` +
          `1. A bold, minimalist design featuring a central illustration of ${text} in a flat design style. Use a vibrant color palette with teal, orange, and navy blue against a clean white background. Include simple geometric shapes to frame the main elements.\n\n` +
          `2. A vintage-inspired design with distressed textures and retro typography. Create a badge/emblem style layout with ${text} as the centerpiece. Use a muted color palette of burgundy, cream, and forest green with subtle textures.\n\n` +
          `3. A modern, abstract interpretation using fluid shapes and gradients. The text should flow within or around organic forms, creating a sense of movement. Use a gradient color scheme transitioning from deep purple to electric blue.\n\n` +
          `4. A hand-drawn illustration style with whimsical elements related to ${text}. Include playful doodles and casual handlettering. Use a bright, cheerful color palette of coral, sunshine yellow, and turquoise.\n\n` +
          `5. A geometric, tech-inspired design with clean lines and a futuristic feel. Arrange ${text} within a structured grid layout. Use a monochromatic color scheme with one accent color for emphasis.`,
        
        typographyIdeas: `Typography Design Ideas for "${text}":\n\n` +
          `1. A dynamic, layered typography design where each word has different weights and sizes. Use a combination of serif and sans-serif fonts with varying opacities. Position words at different angles to create visual interest, with key terms emphasized through size and bold weight.\n\n` +
          `2. A single-font approach using a versatile family like Montserrat or Roboto, exploring the full range of weights from thin to black. Arrange the words in a circular or spiral pattern, with size increasing or decreasing to create rhythm and flow. Use tracking and kerning variations to add sophisticated spacing dynamics.`
      };
      
      return NextResponse.json(fallbackResponse);
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Failed to generate design ideas' }, { status: 500 });
  }
}
