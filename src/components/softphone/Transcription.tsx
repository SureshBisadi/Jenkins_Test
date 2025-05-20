
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSoftphone } from "@/context/SoftphoneContext";
import { useState, useRef, useEffect } from "react";
import { getSentimentColorClass } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function Transcription() {
  const { state, toggleTranscriptionCollapse } = useSoftphone();
  const transcriptionEndRef = useRef<HTMLDivElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    setIsCollapsed(state.isTranscriptionCollapsed);
  }, [state.isTranscriptionCollapsed]);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (transcriptionEndRef.current && !isCollapsed) {
      transcriptionEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.transcription, isCollapsed]);
  
  if (!state.call || !state.transcription.length) return null;
  
  const handleToggleCollapse = () => {
    toggleTranscriptionCollapse();
  };
  
  return (
    <div className="px-4 pb-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-softphone-foreground">Live Transcription</h3>
        <button 
          onClick={handleToggleCollapse}
          className="p-1 rounded-full hover:bg-softphone-surface-hover"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="softphone-glassmorphism overflow-y-auto max-h-32 p-3 space-y-3">
          {state.transcription.map((entry, index) => (
            <div 
              key={entry.id}
              className={`flex ${entry.speaker === 'agent' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`relative max-w-[85%] p-2 rounded-lg text-sm
                  ${entry.speaker === 'agent' 
                    ? 'bg-softphone-accent text-white rounded-tr-none' 
                    : 'bg-softphone-surface-hover text-softphone-foreground rounded-tl-none'
                  }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium opacity-75">
                    {entry.speaker === 'agent' ? 'Agent' : 'Customer'}
                  </span>
                  {entry.sentiment && entry.speaker === 'customer' && (
                    <span className={`text-xs ${getSentimentColorClass(entry.sentiment)}`}>
                      {entry.sentiment === 'positive' ? '😊' : entry.sentiment === 'negative' ? '😞' : '😐'}
                    </span>
                  )}
                </div>
                <p>{entry.text}</p>
              </div>
            </div>
          ))}
          <div ref={transcriptionEndRef} />
        </div>
      )}
      
      {isCollapsed && <Separator />}
    </div>
  );
}
