import { Badge } from "@/components/ui/badge";
import { Brain, Eye, Headphones, PenTool, BookOpen, Users, Calculator, Clock } from "lucide-react";

const STYLE_ICONS = {
  visual: Eye,
  auditory: Headphones,
  kinesthetic: PenTool,
  reading: BookOpen,
  social: Users,
  solitary: Brain,
  logical: Calculator,
  sequential: Clock,
};

const STYLE_COLORS = {
  visual: "bg-blue-500 text-white",
  auditory: "bg-green-500 text-white",
  kinesthetic: "bg-orange-500 text-white",
  reading: "bg-purple-500 text-white",
  social: "bg-pink-500 text-white",
  solitary: "bg-indigo-500 text-white",
  logical: "bg-teal-500 text-white",
  sequential: "bg-red-500 text-white",
};

const STYLE_NAMES = {
  visual: "Visual",
  auditory: "Auditory",
  kinesthetic: "Kinesthetic",
  reading: "Reading",
  social: "Social",
  solitary: "Solitary",
  logical: "Logical",
  sequential: "Sequential",
};

interface LearningStyleBadgeProps {
  style: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export default function LearningStyleBadge({ 
  style, 
  size = "md", 
  showIcon = true 
}: LearningStyleBadgeProps) {
  const Icon = STYLE_ICONS[style as keyof typeof STYLE_ICONS];
  const color = STYLE_COLORS[style as keyof typeof STYLE_COLORS];
  const name = STYLE_NAMES[style as keyof typeof STYLE_NAMES];

  if (!Icon || !color || !name) {
    return <Badge variant="secondary">Unknown Style</Badge>;
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <Badge 
      className={`${color} ${sizeClasses[size]} flex items-center gap-1.5 font-medium`}
      data-testid={`badge-learning-style-${style}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {name}
    </Badge>
  );
}