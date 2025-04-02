
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceRecorder from '@/components/VoiceRecorder';
import AnalysisHistory from '@/components/dashboard/AnalysisHistory';
import { Mic, BarChart2, History } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("record");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Mock function for analysis - in production this would call your API
  const handleAnalyzeVoice = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate API call to ElevenLabs/TwelveLabs
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful analysis
      toast.success("Voice analysis complete!");
      setActiveTab("results");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze voice. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Voice Analysis Dashboard</h1>
      
      <Tabs defaultValue="record" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="record" className="flex items-center">
            <Mic className="mr-2 h-4 w-4" />
            Record Voice
          </TabsTrigger>
          <TabsTrigger value="results">
            <BarChart2 className="mr-2 h-4 w-4" />
            Latest Results
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="record">
          <Card>
            <CardHeader>
              <CardTitle>Record Your Voice</CardTitle>
              <CardDescription>
                Record a sample of your voice to analyze for tone, pitch, clarity, and confidence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceRecorder onAnalyze={handleAnalyzeVoice} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Detailed breakdown of your most recent voice analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="waveform-container mb-6">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="waveform-bar"
                        style={{
                          height: `${Math.sin(i / 2) * 50 + 50}%`,
                          animationDelay: `${i * 0.05}s`,
                          animationDuration: `${0.8 + Math.random() * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-lg">Analyzing your voice...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Confidence Score</h3>
                      <div className="flex items-center">
                        <div className="text-3xl font-bold text-brand-500">75%</div>
                        <div className="ml-4 text-sm text-muted-foreground">
                          Your voice projects confidence, but there's room for improvement in consistency.
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Clarity Score</h3>
                      <div className="flex items-center">
                        <div className="text-3xl font-bold text-accent1">82%</div>
                        <div className="ml-4 text-sm text-muted-foreground">
                          Your enunciation is good, with minimal mumbling or unclear pronunciation.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Pitch Analysis</h3>
                    <div className="h-40 bg-white rounded border flex items-center justify-center">
                      <p className="text-muted-foreground">Pitch visualization will appear here</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Feedback & Recommendations</h3>
                    <ul className="space-y-2">
                      <li className="flex">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Good pace and rhythm throughout most of the recording</span>
                      </li>
                      <li className="flex">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Strong, clear opening statement</span>
                      </li>
                      <li className="flex">
                        <span className="text-yellow-500 mr-2">!</span>
                        <span>Try varying your tone more to emphasize key points</span>
                      </li>
                      <li className="flex">
                        <span className="text-yellow-500 mr-2">!</span>
                        <span>Watch for trailing off at the end of sentences</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>
                Track your progress over time and see how your voice metrics have improved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalysisHistory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
