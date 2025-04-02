
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for the history chart
const mockHistoryData = [
  { date: 'Jan 1', confidence: 65, clarity: 70, pace: 60 },
  { date: 'Jan 8', confidence: 68, clarity: 72, pace: 65 },
  { date: 'Jan 15', confidence: 70, clarity: 74, pace: 68 },
  { date: 'Jan 22', confidence: 73, clarity: 75, pace: 72 },
  { date: 'Jan 29', confidence: 75, clarity: 78, pace: 75 },
  { date: 'Feb 5', confidence: 78, clarity: 80, pace: 77 },
];

// Mock data for past recordings
const mockRecordings = [
  { id: 1, date: 'February 5, 2023 - 3:45 PM', duration: '1:23', confidence: 78, clarity: 80 },
  { id: 2, date: 'January 29, 2023 - 2:12 PM', duration: '0:58', confidence: 75, clarity: 78 },
  { id: 3, date: 'January 22, 2023 - 11:30 AM', duration: '1:45', confidence: 73, clarity: 75 },
  { id: 4, date: 'January 15, 2023 - 4:05 PM', duration: '1:12', confidence: 70, clarity: 74 },
];

const AnalysisHistory = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold">Progress Over Time</h3>
        <div className="flex items-center space-x-4">
          <Select defaultValue="6w">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1w">Last Week</SelectItem>
              <SelectItem value="2w">Last 2 Weeks</SelectItem>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockHistoryData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="#1091e6" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="clarity" 
                stroke="#8B5CF6" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="pace" 
                stroke="#0EA5E9" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mt-8">Past Recordings</h3>
      
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clarity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockRecordings.map((recording) => (
                <tr key={recording.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{recording.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{recording.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{recording.confidence}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-brand-500 h-2 rounded-full" 
                          style={{ width: `${recording.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{recording.clarity}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-accent1 h-2 rounded-full" 
                          style={{ width: `${recording.clarity}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Play</Button>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;
