// API route for generating design prompts for AI image generation
import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';

// Schema for the design prompts generation input
const GenerateDesignPromptsInputSchema = z.object({
  text: z.string().describe("The text or saying to base design prompts on"),
  userProfile: z.any().optional().describe("The user's profile information"),
  modelId: z.string().optional().describe("The model ID to use for generation")
});

// Schema for the design prompts generation output
const GenerateDesignPromptsOutputSchema = z.object({
  creativeDesignPrompts: z.array(z.string()).describe("5 creative design prompts for AI image generation"),
  typographyPrompts: z.array(z.string()).describe("2 creative typography prompts for AI image generation")
});

// Define the prompt for generating design prompts
const generateDesignPromptsPrompt = ai.definePrompt({
  name: 'generateDesignPromptsPrompt',
  input: { schema: GenerateDesignPromptsInputSchema },
  output: { schema: GenerateDesignPromptsOutputSchema },
  prompt: `You are a professional graphic designer tasked with creating detailed AI image generation prompts based on the provided text or saying.

Given this text: "{{text}}"

Create the following:

1. 5 highly detailed prompts for AI image generation based on creative design ideas. For each prompt:
   - Be highly detailed but skip unnecessary words
   - Avoid using terms like "T-shirt," "Mug," "POD," etc.
   - Use suitable alternatives like "typography design," "vector design," "vintage design," "minimalist design", "printing design"
   - Specify a solid color background (mostly black or white, with colors suited for the background)
   - For designs intended for mugs, always specify a white background

2. 2 highly detailed prompts for AI image generation based on typography-only design ideas (no graphics). Follow the same guidelines as above.

Format your output as an array of 5 creative design prompts and an array of 2 typography prompts.
Each prompt should be concise, detailed, and optimized for AI image generation.
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
      // Generate design prompts using the Genkit AI
      const { output } = await generateDesignPromptsPrompt(
        { text },
        { model: modelId }
      );

      return NextResponse.json(output);
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      
      // Fallback response if AI generation fails
      const fallbackResponse = {
        creativeDesignPrompts: [
          `Detailed vector design inspired by "${text}", minimalist style, clean lines, bold typography, solid black background, high contrast colors, commercial quality, high resolution`,
          `Vintage design featuring "${text}", distressed texture, retro typography, halftone shadows, solid white background, printing design, vector art, high resolution`,
          `Artistic interpretation of "${text}", watercolor style, elegant typography, fluid brush strokes, solid light background, minimal color palette, printing design, high resolution`,
          `Abstract geometric design with "${text}" integrated into pattern, modern style, clean shapes, solid black background, vibrant accent colors, vector design, high resolution`,
          `Hand-drawn illustration style featuring "${text}", sketchy lines, organic shapes, playful elements, solid white background, minimal color palette, printing design, high resolution`
        ],
        typographyPrompts: [
          `Typography design of "${text}", multiple font styles and weights, dynamic arrangement, no images or graphics, solid white background, elegant hierarchy, minimalist design, high resolution`,
          `Creative lettering of "${text}", flowing script and bold sans serif combination, dynamic layout, no images, solid black background, high contrast, typography design, high resolution`
        ]
      };
      
      return NextResponse.json(fallbackResponse);
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Failed to generate design prompts' }, { status: 500 });
  }
}
