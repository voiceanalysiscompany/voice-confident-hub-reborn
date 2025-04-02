
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, BarChart2, LineChart, Brain, Bot, Lightbulb, Repeat, Settings } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: "Voice Analysis",
      description: "Get detailed analysis of your voice including pitch, tone, clarity, and emotion.",
      icon: <BarChart2 className="h-12 w-12 text-accent1" />
    },
    {
      title: "AI Feedback",
      description: "Receive personalized feedback and suggestions for improvement from our AI.",
      icon: <Brain className="h-12 w-12 text-accent2" />
    },
    {
      title: "Progress Tracking",
      description: "Track your improvement over time with detailed metrics and visualizations.",
      icon: <LineChart className="h-12 w-12 text-brand-500" />
    },
    {
      title: "Voice Cloning",
      description: "Create a digital version of your voice for practicing and comparison.",
      icon: <Mic className="h-12 w-12 text-accent1" />
    },
    {
      title: "Practice Scenarios",
      description: "Practice with AI-generated scenarios for presentations, interviews, and more.",
      icon: <Bot className="h-12 w-12 text-accent2" />
    },
    {
      title: "Personalized Tips",
      description: "Get customized tips and exercises to improve specific aspects of your voice.",
      icon: <Lightbulb className="h-12 w-12 text-brand-500" />
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Advanced Features for <span className="gradient-text">Voice Improvement</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with practical voice improvement techniques to help you sound more confident.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border bg-card hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-xl shadow-sm border">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div className="h-32 w-32 rounded-full gradient-bg flex items-center justify-center">
                <Settings className="h-16 w-16 text-white" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-2">Easy Integration with ElevenLabs & Twelve Labs</h3>
              <p className="text-muted-foreground mb-4">
                Connect your ElevenLabs and Twelve Labs accounts to unlock advanced voice analysis and synthesis capabilities.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <Repeat className="h-5 w-5 text-green-500 mr-2" />
                  <span>Simple API setup</span>
                </div>
                <div className="flex items-center">
                  <Repeat className="h-5 w-5 text-green-500 mr-2" />
                  <span>One-click integration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
