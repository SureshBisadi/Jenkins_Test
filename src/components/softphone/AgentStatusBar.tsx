
import { Check, ChevronDown, Clock, LogOut, Phone, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSoftphone } from "@/context/SoftphoneContext";
import { AgentStatusType, NotReadyReasonType } from "@/lib/types";
import { formatDuration, getStatusName } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AgentStatusBar() {
  const { state, setAgentStatus, logout, notReadyReasons } = useSoftphone();
  const [showReasonMenu, setShowReasonMenu] = useState(false);
  const [statusDuration, setStatusDuration] = useState("00:00");
  const agentExtension = "1234"; // In a real app, this would come from auth or context
  
  // Update agent status duration timer
  useEffect(() => {
    let statusTimer: NodeJS.Timeout;
    
    if (state.statusStartTime) {
      const updateStatusTimer = () => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - state.statusStartTime!.getTime()) / 1000);
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
  }, [state.statusStartTime]);
  
  const handleStatusChange = (status: AgentStatusType) => {
    if (status === 'not-ready') {
      setShowReasonMenu(true);
    } else {
      setAgentStatus(status);
    }
  };
  
  const handleSelectReason = (reason: NotReadyReasonType) => {
    setAgentStatus('not-ready', reason);
    setShowReasonMenu(false);
  };
  
  const getStatusIcon = () => {
    switch (state.agentStatus) {
      case 'ready':
        return <Check size={18} />;
      case 'not-ready':
        return <X size={18} />;
      case 'after-call':
        return <Clock size={18} />;
      case 'offline':
        return <X size={18} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col px-4 py-3 border-b border-softphone-border bg-softphone-surface">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            softphone-button-status ${state.agentStatus}
          `}>
            {getStatusIcon()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-softphone-foreground">
              {getStatusName(state.agentStatus)}
            </span>
            {state.notReadyReason && (
              <span className="text-xs text-softphone-foreground-muted truncate max-w-[120px]">
                {state.notReadyReason.label}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-softphone-foreground-muted">
            <Clock size={12} className="shrink-0" />
            <span>{statusDuration}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-1.5 rounded-md border border-softphone-border hover:bg-softphone-surface-hover focus:outline-none focus:ring-2 focus:ring-softphone-accent focus:ring-opacity-50 transition-colors duration-150">
              <span className="text-sm">Status</span>
              <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2"
                disabled={state.agentStatus === 'ready' || !!state.call}
                onClick={() => handleStatusChange('ready')}
              >
                <div className="w-3 h-3 rounded-full bg-softphone-ready" />
                <span>Ready</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2"
                disabled={state.agentStatus === 'not-ready'}
                onClick={() => handleStatusChange('not-ready')}
              >
                <div className="w-3 h-3 rounded-full bg-softphone-notready" />
                <span>Not Ready</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2"
                disabled={state.agentStatus === 'after-call'}
                onClick={() => handleStatusChange('after-call')}
              >
                <div className="w-3 h-3 rounded-full bg-softphone-aftercall" />
                <span>After Call Work</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className="p-2 rounded-md border border-softphone-border hover:bg-softphone-surface-hover focus:outline-none focus:ring-2 focus:ring-softphone-accent focus:ring-opacity-50 transition-colors duration-150"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Agent extension display */}
      <div className="flex items-center mt-2 text-xs text-softphone-foreground-muted">
        <Phone size={12} className="mr-1 shrink-0" />
        <span>Extension: {agentExtension}</span>
      </div>
      
      {/* Not Ready Reason Modal */}
      <DropdownMenu open={showReasonMenu} onOpenChange={setShowReasonMenu}>
        <DropdownMenuTrigger className="hidden">Not Ready Reasons</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Select a reason</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notReadyReasons.map((reason) => (
            <DropdownMenuItem 
              key={reason.id}
              onClick={() => handleSelectReason(reason)}
            >
              {reason.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
