import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot, Loader2, Lightbulb, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AITutorProps {
  topic: string;
  onClose?: () => void;
}

export function AITutor({ topic, onClose }: AITutorProps) {
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [specificQuestion, setSpecificQuestion] = useState("");
  const [guidance, setGuidance] = useState("");
  const [marketContext, setMarketContext] = useState("");
  const { toast } = useToast();

  const tutorMutation = useMutation({
    mutationFn: async (data: { topic: string; userLevel: string; specificQuestion?: string }) => {
      return await apiRequest('/api/ai/tutor', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (data) => {
      setGuidance(data.guidance);
    },
    onError: (error) => {
      toast({
        title: "AI Tutor Error",
        description: error instanceof Error ? error.message : "Failed to get tutoring guidance",
        variant: "destructive"
      });
    }
  });

  const contextMutation = useMutation({
    mutationFn: async (topic: string) => {
      return await apiRequest(`/api/ai/market-context/${encodeURIComponent(topic)}`);
    },
    onSuccess: (data) => {
      setMarketContext(data.context);
    },
    onError: (error) => {
      toast({
        title: "Market Context Error", 
        description: error instanceof Error ? error.message : "Failed to get market context",
        variant: "destructive"
      });
    }
  });

  const getTutoring = () => {
    tutorMutation.mutate({
      topic,
      userLevel,
      specificQuestion: specificQuestion.trim() || undefined
    });
  };

  const getMarketContext = () => {
    contextMutation.mutate(topic);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Tutor - {topic}
          </CardTitle>
          <CardDescription>
            Get personalized guidance and explanations for your finance studies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Level</label>
            <Select value={userLevel} onValueChange={(value: any) => setUserLevel(value)}>
              <SelectTrigger data-testid="select-user-level">
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Specific Question (Optional)</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Ask a specific question about this topic..."
              value={specificQuestion}
              onChange={(e) => setSpecificQuestion(e.target.value)}
              data-testid="textarea-specific-question"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={getTutoring}
              disabled={tutorMutation.isPending}
              data-testid="button-get-tutoring"
            >
              {tutorMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lightbulb className="h-4 w-4 mr-2" />
              )}
              Get Tutoring
            </Button>

            <Button 
              variant="outline"
              onClick={getMarketContext}
              disabled={contextMutation.isPending}
              data-testid="button-market-context"
            >
              {contextMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-2" />
              )}
              Market Context
            </Button>
          </div>
        </CardContent>
      </Card>

      {guidance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              Personalized Guidance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">{guidance}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {marketContext && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Current Market Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">{marketContext}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {onClose && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose} data-testid="button-close-tutor">
            Close
          </Button>
        </div>
      )}
    </div>
  );
}