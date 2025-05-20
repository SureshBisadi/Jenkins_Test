
import { useSoftphone } from "@/context/SoftphoneContext";
import { formatDuration, formatPhoneNumber } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function CallDetails() {
  const { state } = useSoftphone();
  const [statusDuration, setStatusDuration] = useState("00:00");
  
  // Update agent status duration timer
  useEffect(() => {
    let statusTimer: NodeJS.Timeout;
    
    if (state.agentStatus !== 'offline') {
      const startTime = state.statusStartTime || new Date();
      
      const updateStatusTimer = () => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setStatusDuration(formatDuration(diffInSeconds));
      };
      
      // Initial update
      updateStatusTimer();
      
      // Update every second
      statusTimer = setInterval(updateStatusTimer, 1000);
    }
    
    return () => {
      if (statusTimer) clearInterval(statusTimer);
    };
  }, [state.agentStatus, state.statusStartTime]);
  
  if (!state.call) {
    return (
      <div className="softphone-glassmorphism p-4 space-y-3">
        <h3 className="text-sm font-medium">Agent Information</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-softphone-foreground-muted">Status</span>
          <span className="text-sm">{state.agentStatus}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm flex items-center gap-1 text-softphone-foreground-muted">
            <Clock size={14} />
            <span>Time in status</span>
          </span>
          <span className="text-sm">{statusDuration}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="softphone-glassmorphism p-4 space-y-3">
      <h3 className="text-sm font-medium">Call Details</h3>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-softphone-foreground-muted">Call ID</span>
        <span className="text-sm font-mono">{state.call.id || 'Unknown'}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-softphone-foreground-muted">Direction</span>
        <span className="text-sm">{state.call.direction}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-softphone-foreground-muted">Number</span>
        <span className="text-sm">{formatPhoneNumber(state.call.phoneNumber || '')}</span>
      </div>
      
      {state.call.ivr && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-softphone-foreground-muted">IVR Exit Point</span>
          <span className="text-sm">{state.call.ivr}</span>
        </div>
      )}
      
      {state.call.queueName && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-softphone-foreground-muted">Queue</span>
          <span className="text-sm">{state.call.queueName}</span>
        </div>
      )}
      
      {state.call.waitTime !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-softphone-foreground-muted">Wait Time</span>
          <span className="text-sm">{formatDuration(state.call.waitTime)}</span>
        </div>
      )}
      
      {state.call.notes && (
        <div className="space-y-1">
          <span className="text-sm text-softphone-foreground-muted">Notes</span>
          <p className="text-sm p-2 bg-softphone-surface rounded">{state.call.notes}</p>
        </div>
      )}
    </div>
  );
}
