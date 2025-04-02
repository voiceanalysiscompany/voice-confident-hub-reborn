
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { InfoIcon } from 'lucide-react';
import { setElevenLabsApiKey, getElevenLabsApiKey } from '@/services/elevenLabsService';

const ApiSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    elevenLabsApiKey: '',
    twelveLabsApiKey: '',
    makeWebhookUrl: '',
    useAdvancedVoiceAnalysis: true,
    shareFeedbackData: false
  });

  useEffect(() => {
    // Load saved API key if available
    const savedKey = getElevenLabsApiKey();
    if (savedKey) {
      setFormData(prev => ({ ...prev, elevenLabsApiKey: savedKey }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would save the API settings to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save the ElevenLabs API key to our service
      setElevenLabsApiKey(formData.elevenLabsApiKey);
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
      console.error('Settings error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async (service: string) => {
    let key = '';
    
    if (service === 'elevenlabs') {
      key = formData.elevenLabsApiKey;
    } else if (service === 'twelvelabs') {
      key = formData.twelveLabsApiKey;
    } else if (service === 'make') {
      key = formData.makeWebhookUrl;
    }
    
    if (!key) {
      toast.error(`Please enter your ${service} API key first.`);
      return;
    }
    
    toast.info(`Testing connection to ${service}...`);
    
    // In a real app, this would test the connection to the service
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (service === 'elevenlabs') {
      // Save the key temporarily for the test
      setElevenLabsApiKey(key);
    }
    
    // Simulate successful test
    toast.success(`Successfully connected to ${service}!`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>ElevenLabs API Integration</CardTitle>
            <CardDescription>
              Connect to ElevenLabs for advanced voice synthesis and analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="elevenLabsApiKey">
                API Key
                <span className="ml-2 text-xs text-muted-foreground">
                  (Get your API key from the ElevenLabs dashboard)
                </span>
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="elevenLabsApiKey"
                  name="elevenLabsApiKey"
                  type="password" 
                  placeholder="Enter your ElevenLabs API key"
                  value={formData.elevenLabsApiKey}
                  onChange={handleChange}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => handleTest('elevenlabs')}
                >
                  Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Twelve Labs API Integration</CardTitle>
            <CardDescription>
              Connect to Twelve Labs for video and audio content understanding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twelveLabsApiKey">
                API Key
                <span className="ml-2 text-xs text-muted-foreground">
                  (Get your API key from the Twelve Labs dashboard)
                </span>
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="twelveLabsApiKey"
                  name="twelveLabsApiKey"
                  type="password" 
                  placeholder="Enter your Twelve Labs API key"
                  value={formData.twelveLabsApiKey}
                  onChange={handleChange}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => handleTest('twelvelabs')}
                >
                  Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Make.com Integration</CardTitle>
            <CardDescription>
              Connect to Make.com for custom workflow automation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="makeWebhookUrl">
                Webhook URL
                <span className="ml-2 text-xs text-muted-foreground">
                  (Create a webhook in Make.com and paste the URL here)
                </span>
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="makeWebhookUrl"
                  name="makeWebhookUrl"
                  placeholder="Enter your Make.com webhook URL"
                  value={formData.makeWebhookUrl}
                  onChange={handleChange}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => handleTest('make')}
                >
                  Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
            <CardDescription>
              Configure how the voice analysis features work.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="useAdvancedVoiceAnalysis">Use Advanced Voice Analysis</Label>
                <p className="text-sm text-muted-foreground">
                  Enable more detailed voice metrics and insights.
                </p>
              </div>
              <Switch
                id="useAdvancedVoiceAnalysis"
                checked={formData.useAdvancedVoiceAnalysis}
                onCheckedChange={(checked) => 
                  handleSwitchChange('useAdvancedVoiceAnalysis', checked)
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="shareFeedbackData">Share Anonymous Feedback Data</Label>
                <p className="text-sm text-muted-foreground">
                  Help us improve by sharing anonymous usage data.
                </p>
              </div>
              <Switch
                id="shareFeedbackData"
                checked={formData.shareFeedbackData}
                onCheckedChange={(checked) => 
                  handleSwitchChange('shareFeedbackData', checked)
                }
              />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t px-6 py-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <InfoIcon className="h-4 w-4 mr-2" />
              <span>Your API keys are stored securely and only used for connecting to the respective services.</span>
            </div>
          </CardFooter>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">Cancel</Button>
          <Button 
            type="submit" 
            className="gradient-bg" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ApiSettings;
