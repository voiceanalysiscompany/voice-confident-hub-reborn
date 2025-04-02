
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceRecorder from '@/components/VoiceRecorder';
import AnalysisHistory from '@/components/dashboard/AnalysisHistory';
import { Mic, BarChart2, History } from 'lucide-react';
import { toast } from "sonner";
import { analyzeVoiceWithElevenLabs, VoiceAnalysisResponse, getElevenLabsApiKey } from '@/services/elevenLabsService';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("record");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisResponse | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  useEffect(() => {
    // Check if API key is set
    setHasApiKey(!!getElevenLabsApiKey());
  }, []);
  
  const handleAnalyzeVoice = async (audioBlob: Blob) => {
    if (!hasApiKey) {
      toast.error("Please set your ElevenLabs API key in Settings first.");
      return;
    }
    
    setIsAnalyzing(true);
    setActiveTab("results");
    
    try {
      const result = await analyzeVoiceWithElevenLabs(audioBlob);
      
      if (result) {
        setAnalysisResult(result);
        toast.success("Voice analysis complete!");
      }
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
                Record a sample of your voice (up to 12 seconds) to analyze for tone, pitch, clarity, and confidence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceRecorder onAnalyze={handleAnalyzeVoice} maxRecordingTime={12} />
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
              ) : analysisResult ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Confidence Score</h3>
                      <div className="flex items-center">
                        <div className="text-3xl font-bold text-brand-500">{Math.round(analysisResult.confidence_score)}%</div>
                        <div className="ml-4 text-sm text-muted-foreground">
                          {analysisResult.confidence_score > 80 
                            ? "Your voice projects strong confidence and authority."
                            : analysisResult.confidence_score > 60
                              ? "Your voice projects confidence, but there's room for improvement in consistency."
                              : "Work on projecting more confidence in your voice."}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Clarity Score</h3>
                      <div className="flex items-center">
                        <div className="text-3xl font-bold text-accent1">{Math.round(analysisResult.clarity_score)}%</div>
                        <div className="ml-4 text-sm text-muted-foreground">
                          {analysisResult.clarity_score > 80 
                            ? "Your enunciation is excellent, with clear and precise pronunciation."
                            : analysisResult.clarity_score > 60
                              ? "Your enunciation is good, with minimal mumbling or unclear pronunciation."
                              : "Work on improving your enunciation for better clarity."}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Pitch Analysis</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Average: {Math.round(analysisResult.pitch_analysis.average)} Hz</span>
                      <span className="text-sm">Variation: {Math.round(analysisResult.pitch_analysis.variation)}%</span>
                    </div>
                    <div className="h-40 bg-white rounded border p-2">
                      <div className="h-full w-full relative flex items-end">
                        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between text-xs text-gray-400">
                          <div>{analysisResult.pitch_analysis.range[1]} Hz</div>
                          <div>{analysisResult.pitch_analysis.range[0]} Hz</div>
                        </div>
                        {Array.from({ length: 20 }).map((_, i) => {
                          const height = 30 + Math.sin(i / 3) * 20 + Math.random() * 30;
                          return (
                            <div 
                              key={i}
                              className="bg-indigo-500 w-full mx-0.5"
                              style={{ height: `${height}%`, opacity: 0.7 + Math.random() * 0.3 }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Feedback & Recommendations</h3>
                    <ul className="space-y-2">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex">
                          <span className={index < 2 ? "text-green-500 mr-2" : "text-yellow-500 mr-2"}>
                            {index < 2 ? "✓" : "!"}
                          </span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Record your voice first to see analysis results here</p>
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
