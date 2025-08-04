import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Heart, 
  Trophy, 
  Brain, 
  Volume2,
  VolumeX,
  Sparkles,
  MessageCircle,
  Bell,
  Zap,
  Target,
  Clock
} from 'lucide-react';

interface CompanionSettingsProps {
  preferences: {
    enableEncouragement: boolean;
    enableCelebrations: boolean;
    enableTips: boolean;
    enableSounds: boolean;
    frequency: 'high' | 'medium' | 'low';
    showProgress: boolean;
    enableMotivationalQuotes: boolean;
    smartTiming: boolean;
  };
  onPreferencesChange: (preferences: any) => void;
  onClose?: () => void;
}

export function CompanionSettings({ 
  preferences, 
  onPreferencesChange, 
  onClose 
}: CompanionSettingsProps) {
  const [localPreferences, setLocalPreferences] = useState(preferences);

  const handlePreferenceChange = (key: string, value: any) => {
    const newPreferences = { ...localPreferences, [key]: value };
    setLocalPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  const getFrequencyDescription = (frequency: string) => {
    switch (frequency) {
      case 'high':
        return 'More frequent encouragement and tips (every 2-3 minutes)';
      case 'medium':
        return 'Balanced interaction frequency (every 5-10 minutes)';
      case 'low':
        return 'Minimal interruptions (only for major achievements)';
      default:
        return '';
    }
  };

  const resetToDefaults = () => {
    const defaults = {
      enableEncouragement: true,
      enableCelebrations: true,
      enableTips: true,
      enableSounds: false,
      frequency: 'medium' as const,
      showProgress: true,
      enableMotivationalQuotes: true,
      smartTiming: true
    };
    setLocalPreferences(defaults);
    onPreferencesChange(defaults);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <CardTitle>AI Study Companion Settings</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
        <CardDescription>
          Customize your personalized learning experience
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Core Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Core Features</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <div>
                  <Label className="text-sm font-medium">Encouragement</Label>
                  <p className="text-xs text-muted-foreground">Motivational messages</p>
                </div>
              </div>
              <Switch
                checked={localPreferences.enableEncouragement}
                onCheckedChange={(checked) => handlePreferenceChange('enableEncouragement', checked)}
                data-testid="switch-encouragement"
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <div>
                  <Label className="text-sm font-medium">Celebrations</Label>
                  <p className="text-xs text-muted-foreground">Achievement rewards</p>
                </div>
              </div>
              <Switch
                checked={localPreferences.enableCelebrations}
                onCheckedChange={(checked) => handlePreferenceChange('enableCelebrations', checked)}
                data-testid="switch-celebrations"
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-500" />
                <div>
                  <Label className="text-sm font-medium">Smart Tips</Label>
                  <p className="text-xs text-muted-foreground">Contextual study advice</p>
                </div>
              </div>
              <Switch
                checked={localPreferences.enableTips}
                onCheckedChange={(checked) => handlePreferenceChange('enableTips', checked)}
                data-testid="switch-tips"
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-500" />
                <div>
                  <Label className="text-sm font-medium">Progress Display</Label>
                  <p className="text-xs text-muted-foreground">Show detailed stats</p>
                </div>
              </div>
              <Switch
                checked={localPreferences.showProgress}
                onCheckedChange={(checked) => handlePreferenceChange('showProgress', checked)}
                data-testid="switch-progress"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Advanced Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Advanced Features</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-purple-500" />
                <div>
                  <Label className="text-sm font-medium">Motivational Quotes</Label>
                  <p className="text-xs text-muted-foreground">Inspirational messages</p>
                </div>
              </div>
              <Switch
                checked={localPreferences.enableMotivationalQuotes}
                onCheckedChange={(checked) => handlePreferenceChange('enableMotivationalQuotes', checked)}
                data-testid="switch-quotes"
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <div>
                  <Label className="text-sm font-medium">Smart Timing</Label>
                  <p className="text-xs text-muted-foreground">Context-aware messages</p>
                </div>
              </div>
              <Switch
                checked={localPreferences.smartTiming}
                onCheckedChange={(checked) => handlePreferenceChange('smartTiming', checked)}
                data-testid="switch-timing"
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                {localPreferences.enableSounds ? 
                  <Volume2 className="w-4 h-4 text-green-500" /> : 
                  <VolumeX className="w-4 h-4 text-gray-400" />
                }
                <div>
                  <Label className="text-sm font-medium">Sound Effects</Label>
                  <p className="text-xs text-muted-foreground">Audio feedback</p>
                </div>
              </div>
              <Switch
                checked={localPreferences.enableSounds}
                onCheckedChange={(checked) => handlePreferenceChange('enableSounds', checked)}
                data-testid="switch-sounds"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Interaction Frequency */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Interaction Frequency</span>
          </h3>
          
          <RadioGroup
            value={localPreferences.frequency}
            onValueChange={(value) => handlePreferenceChange('frequency', value)}
            className="space-y-3"
          >
            {(['high', 'medium', 'low'] as const).map((freq) => (
              <div key={freq} className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value={freq} id={freq} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={freq} className="text-sm font-medium capitalize flex items-center space-x-2">
                    <span>{freq}</span>
                    {freq === 'medium' && <Badge variant="secondary" className="text-xs">Recommended</Badge>}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getFrequencyDescription(freq)}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Preview & Actions */}
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-medium text-sm mb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Preview</span>
            </h4>
            <p className="text-sm text-muted-foreground">
              {localPreferences.enableEncouragement && localPreferences.enableCelebrations 
                ? "Your companion will provide full support with encouragement, celebrations, and smart tips."
                : localPreferences.enableEncouragement
                ? "Your companion will provide encouragement and support during your studies."
                : localPreferences.enableTips
                ? "Your companion will focus on providing helpful study tips and guidance."
                : "Your companion will have minimal interactions, only showing essential information."
              }
            </p>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={resetToDefaults} data-testid="button-reset-defaults">
              Reset to Defaults
            </Button>
            <div className="flex space-x-2">
              {onClose && (
                <Button variant="outline" onClick={onClose} data-testid="button-close-settings">
                  Close
                </Button>
              )}
              <Button data-testid="button-save-settings">
                Settings Saved
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CompanionSettings;