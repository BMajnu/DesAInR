
'use client';

import { Button } from '@/components/ui/button';
import { BotMessageSquare, Plane, RotateCcw, ListChecks, ClipboardList, Palette, Lightbulb, Sparkle, Sparkles, MessageSquarePlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserProfile } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

export type ActionType = 
  | 'processMessage'
  | 'analyzeRequirements' 
  | 'generateEngagementPack' // Changed from generateBrief
  | 'generateDelivery'
  | 'generateRevision'
  | 'designIdea'
  | 'designPrompt';

interface ActionButton {
  id: ActionType;
  label: string; // Full label for tooltip
  shortLabel: string; // Short label for button text
  icon: React.ElementType;
  description: string;
}

const actionButtonsConfig: ActionButton[] = [
  { id: 'processMessage', label: 'Process Client Message', shortLabel: 'Chat', icon: BotMessageSquare, description: 'Full analysis, plan, Bengali translation, and English reply suggestions based on conversation.' },
  { id: 'analyzeRequirements', label: 'Analyze Requirements', shortLabel: 'Requirements', icon: ListChecks, description: 'Detailed analysis of requirements, prioritization, Bangla translation, and design message.' },
  { id: 'generateEngagementPack', label: 'Generate Engagement Pack', shortLabel: 'Brief', icon: ClipboardList, description: 'Generates a personalized intro, job reply, budget/timeline/software ideas, and clarifying questions.' },
  { id: 'generateDelivery', label: 'Generate Delivery Message', shortLabel: 'Delivery', icon: Plane, description: 'Platform-ready delivery messages and follow-ups.' },
  { id: 'generateRevision', label: 'Generate Revision Message', shortLabel: 'Revision', icon: RotateCcw, description: 'Platform-ready revision messages and follow-ups.' },
];

// Design action buttons (sub-buttons for Design dropdown)
const designActionButtonsConfig: ActionButton[] = [
  { 
    id: 'designIdea', 
    label: 'Generate Design Ideas', 
    shortLabel: 'Idea', 
    icon: Lightbulb, 
    description: 'Browse the web for similar designs and generate 5 creative design ideas plus 2 typography design ideas based on the text or saying.'
  },
  { 
    id: 'designPrompt', 
    label: 'Generate Design Prompts', 
    shortLabel: 'Prompt', 
    icon: Sparkle, 
    description: 'Convert design ideas into detailed AI image generation prompts with solid color backgrounds and suitable formatting.'
  },
];

interface ActionButtonsPanelProps {
  onAction: (action: ActionType) => void;
  isLoading: boolean;
  currentUserMessage: string; 
  profile: UserProfile | null;
  currentAttachedFilesDataLength: number; 
}

export function ActionButtonsPanel({ onAction, isLoading, currentUserMessage, profile, currentAttachedFilesDataLength }: ActionButtonsPanelProps) {
  
  const isActionDisabled = (_actionId: ActionType) => {
    if (isLoading || !profile) {
      return true;
    }
    // Buttons are active regardless of currentUserMessage or currentAttachedFilesDataLength,
    // unless loading or profile is missing.
    return false; 
  };

  return (
    <div className={cn(
        "flex flex-wrap items-center justify-end gap-1.5 md:gap-2", 
        (!profile || isLoading) && "opacity-60 pointer-events-none" 
      )}
      data-component-name="ActionButtonsPanel"
    >
      {actionButtonsConfig.map((btn) => (
        <TooltipProvider key={btn.id} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm" 
                onClick={() => onAction(btn.id)}
                disabled={isActionDisabled(btn.id)}
                className="px-2.5 py-1.5 md:px-3 md:py-2 h-auto" 
              >
                <btn.icon className="h-4 w-4 mr-1 md:mr-1.5" />
                <span className="text-xs md:text-sm">{btn.shortLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="font-semibold">{btn.label}</p>
              <p className="text-xs text-muted-foreground max-w-xs">{btn.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      
      {/* Design Dropdown Button with sub-options */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isActionDisabled('designIdea')}
                  className="px-2.5 py-1.5 md:px-3 md:py-2 h-auto"
                >
                  <Palette className="h-4 w-4 mr-1 md:mr-1.5" />
                  <span className="text-xs md:text-sm">Design</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {designActionButtonsConfig.map((btn) => (
                  <DropdownMenuItem 
                    key={btn.id}
                    onClick={() => onAction(btn.id)}
                    disabled={isActionDisabled(btn.id)}
                    className="flex items-center gap-2"
                  >
                    <btn.icon className="h-4 w-4" />
                    <span>{btn.shortLabel}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="max-w-xs">
            <p className="font-semibold">Design Tools</p>
            <p className="text-xs text-muted-foreground">Generate design ideas and AI prompts based on client requirements</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
