
import { useSoftphone } from "@/context/SoftphoneContext";
import { getSentimentColorClass } from "@/lib/utils";
import { AlertTriangle, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export function SentimentAnalysis() {
  const { state } = useSoftphone();
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (state.sentiment?.history) {
      const data = state.sentiment.history.map((entry, index) => ({
        name: index,
        value: entry.score,
      }));
      setChartData(data);
    } else {
      setChartData([]);
    }
  }, [state.sentiment]);
  
  if (!state.call || !state.sentiment) return null;
  
  const getSentimentIcon = () => {
    switch (state.sentiment.overallSentiment) {
      case 'positive':
        return <ThumbsUp className="w-5 h-5 sentiment-positive" />;
      case 'negative':
        return <ThumbsDown className="w-5 h-5 sentiment-negative" />;
      case 'neutral':
      default:
        return <AlertTriangle className="w-5 h-5 sentiment-neutral" />;
    }
  };
  
  const getSentimentLabel = () => {
    switch (state.sentiment.overallSentiment) {
      case 'positive':
        return "Positive";
      case 'negative':
        return "Negative";
      case 'neutral':
      default:
        return "Neutral";
    }
  };
  
  const getSentimentAreaColor = () => {
    switch (state.sentiment.overallSentiment) {
      case 'positive':
        return "#0ea5e9";
      case 'negative':
        return "#f43f5e";
      case 'neutral':
      default:
        return "#64748b";
    }
  };
  
  return (
    <div className="softphone-glassmorphism p-3 mx-4 mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Customer Sentiment</h3>
        <div className={`flex items-center space-x-1 ${getSentimentColorClass(state.sentiment.overallSentiment)}`}>
          {getSentimentIcon()}
          <span className="text-xs font-medium">{getSentimentLabel()}</span>
        </div>
      </div>
      
      {chartData.length > 2 && (
        <div className="h-16 w-full mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getSentimentAreaColor()} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={getSentimentAreaColor()} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis hide={true} />
              <YAxis hide={true} domain={[-1, 1]} />
              <Tooltip 
                content={({active, payload}) => {
                  if (active && payload && payload.length) {
                    const value = parseFloat(payload[0].value.toString());
                    let sentiment = 'Neutral';
                    if (value > 0.2) sentiment = 'Positive';
                    else if (value < -0.2) sentiment = 'Negative';
                    
                    return (
                      <div className="softphone-glassmorphism p-2 text-xs">
                        <p>{sentiment}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={getSentimentAreaColor()} 
                fillOpacity={1} 
                fill="url(#sentimentGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
