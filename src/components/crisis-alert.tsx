import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Phone,
  MessageSquare,
  Heart,
  ExternalLink,
  X,
} from "lucide-react";
import { useState } from "react";
import type { CrisisLevel } from "@/lib/crisisKeywords";

interface CrisisAlertProps {
  level: CrisisLevel;
  triggers?: string[];
  onDismiss?: () => void;
  className?: string;
}

const crisisResources = {
  high: {
    title: "🆘 Immediate Support Needed",
    description:
      "You mentioned some concerning thoughts. Please reach out for immediate support - you don't have to face this alone.",
    urgentMessage: "If you're in immediate danger, call 911 now.",
    backgroundColor: "bg-destructive/10 border-destructive/30",
    titleColor: "text-destructive",
    resources: [
      {
        title: "988 Suicide & Crisis Lifeline",
        description: "24/7 crisis support",
        action: "Call Now",
        icon: Phone,
        href: "tel:988",
        primary: true,
      },
      {
        title: "Crisis Text Line",
        description: "Text HOME to 741741",
        action: "Text Now",
        icon: MessageSquare,
        href: "sms:741741?body=HOME",
        primary: true,
      },
    ],
  },
  medium: {
    title: "💙 Support Available",
    description:
      "It sounds like you're going through a difficult time. Help is available and you deserve support.",
    backgroundColor:
      "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800/30",
    titleColor: "text-orange-800 dark:text-orange-200",
    resources: [
      {
        title: "988 Suicide & Crisis Lifeline",
        description: "24/7 support available",
        action: "Call for Support",
        icon: Phone,
        href: "tel:988",
        primary: false,
      },
      {
        title: "Crisis Text Line",
        description: "Text HOME to 741741",
        action: "Text for Help",
        icon: MessageSquare,
        href: "sms:741741?body=HOME",
        primary: false,
      },
    ],
  },
  low: {
    title: "💚 Resources Available",
    description:
      "Remember that support is always available if you need it. You're taking a positive step by reaching out.",
    backgroundColor:
      "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/30",
    titleColor: "text-blue-800 dark:text-blue-200",
    resources: [
      {
        title: "988 Suicide & Crisis Lifeline",
        description: "Always here when you need support",
        action: "Learn More",
        icon: Phone,
        href: "tel:988",
        primary: false,
      },
    ],
  },
};

const copingStrategies = {
  high: [
    "Focus on your breathing: Inhale for 4 counts, hold for 4, exhale for 6",
    "Call a trusted friend or family member right now",
    "Go to a safe place with other people around",
    "Remove any items that could cause harm",
  ],
  medium: [
    "Practice the 5-4-3-2-1 grounding technique",
    "Reach out to a trusted person in your life",
    "Try gentle physical activity like walking",
    "Use a warm compress or take a warm shower",
  ],
  low: [
    "Take 5 deep breaths and focus on the present moment",
    "Write down your thoughts in a journal",
    "Listen to calming music or sounds",
    "Consider talking to a counselor or trusted person",
  ],
};

export function CrisisAlert({
  level,
  triggers,
  onDismiss,
  className,
}: CrisisAlertProps) {
  const [isExpanded, setIsExpanded] = useState(level === "high");
  const config = crisisResources[level];

  return (
    <Card
      className={`${config.backgroundColor} ${className} animate-in slide-in-from-top-2 duration-300`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${config.titleColor}`} />
            <CardTitle className={`text-lg ${config.titleColor}`}>
              {config.title}
            </CardTitle>
          </div>
          {onDismiss && level !== "high" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Dismiss alert</span>
            </Button>
          )}
        </div>
        <CardDescription className="text-sm">
          {config.description}
        </CardDescription>
        {config.urgentMessage && (
          <Alert className="mt-2 border-destructive/50">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription className="font-medium text-destructive">
              {config.urgentMessage}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Emergency Resources */}
        <div className="grid gap-2">
          {config.resources.map((resource, index) => (
            <Button
              key={index}
              variant={resource.primary ? "default" : "outline"}
              className={`h-auto p-3 justify-start ${
                resource.primary
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : ""
              }`}
              asChild
            >
              <a href={resource.href} className="flex items-center gap-3">
                <resource.icon className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{resource.title}</div>
                  <div className="text-xs opacity-80">
                    {resource.description}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto flex-shrink-0" />
              </a>
            </Button>
          ))}
        </div>

        {/* Expandable Coping Strategies */}
        <div className="border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0 h-auto font-medium text-left hover:bg-transparent"
          >
            <Heart className="w-4 h-4 mr-2" />
            {isExpanded ? "Hide" : "Show"} Immediate Coping Strategies
          </Button>

          {isExpanded && (
            <div className="mt-3 space-y-2 animate-in slide-in-from-top-1 duration-200">
              {copingStrategies[level].map((strategy, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm p-2 rounded-md bg-background/50"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="leading-relaxed">{strategy}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Context for Development */}
        {process.env.NODE_ENV === "development" &&
          triggers &&
          triggers.length > 0 && (
            <details className="mt-4 text-xs">
              <summary className="cursor-pointer opacity-60">
                Debug: Crisis Detection Details
              </summary>
              <div className="mt-2 p-2 bg-muted rounded text-muted-foreground">
                <p>
                  <strong>Level:</strong> {level}
                </p>
                <p>
                  <strong>Triggers:</strong> {triggers.join(", ")}
                </p>
              </div>
            </details>
          )}
      </CardContent>
    </Card>
  );
}

// Utility function to determine if crisis alert should be shown
export function shouldShowCrisisAlert(level: CrisisLevel): boolean {
  return level === "high" || level === "medium" || level === "low";
}

// Hook for managing crisis alert state
export function useCrisisAlert() {
  const [activeAlert, setActiveAlert] = useState<{
    level: CrisisLevel;
    triggers: string[];
  } | null>(null);

  const showAlert = (level: CrisisLevel, triggers: string[] = []) => {
    setActiveAlert({ level, triggers });
  };

  const dismissAlert = () => {
    setActiveAlert(null);
  };

  return {
    activeAlert,
    showAlert,
    dismissAlert,
  };
}
