
import { useSoftphone } from "@/context/SoftphoneContext";
import { formatDuration, formatPhoneNumber, getCallDirectionLabel, getCallStateLabel } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Phone, PhoneOff, Pause, Play, UserPlus, Radio, MicOff, Mic } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ActiveCall() {
  const { state, answerCall, endCall, holdCall, unholdCall, transferCall, conferenceCall, toggleMute } = useSoftphone();
  const [callDuration, setCallDuration] = useState("00:00");
  const [holdDuration, setHoldDuration] = useState("00:00");
  const [transferNumber, setTransferNumber] = useState("");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [conferenceNumber, setConferenceNumber] = useState("");
  const [conferenceDialogOpen, setConferenceDialogOpen] = useState(false);
  
  useEffect(() => {
    if (state.call?.duration) {
      setCallDuration(formatDuration(state.call.duration));
    } else {
      setCallDuration("00:00");
    }
    
    if (state.call?.state === 'hold' && state.call?.holdStartTime) {
      const updateHoldTimer = () => {
        if (state.call?.holdStartTime) {
          const now = new Date();
          const diffInSeconds = Math.floor((now.getTime() - state.call.holdStartTime.getTime()) / 1000);
          setHoldDuration(formatDuration(diffInSeconds));
        }
      };
      
      // Initial update
      updateHoldTimer();
      
      // Update every second
      const interval = setInterval(updateHoldTimer, 1000);
      return () => clearInterval(interval);
    } else {
      setHoldDuration("00:00");
    }
  }, [state.call]);
  
  if (!state.call) return null;
  
  const handleTransfer = () => {
    if (transferNumber) {
      transferCall(transferNumber);
      setTransferDialogOpen(false);
      setTransferNumber("");
    }
  };
  
  const handleConference = () => {
    if (conferenceNumber) {
      conferenceCall(conferenceNumber);
      setConferenceDialogOpen(false);
      setConferenceNumber("");
    }
  };
  
  return (
    <div className="p-4 space-y-4">
      <div className="softphone-glassmorphism p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-xs text-softphone-foreground-muted">
              {getCallDirectionLabel(state.call.direction)}
            </div>
            <div className="text-lg font-medium text-softphone-foreground">
              {state.call.callerName || "Unknown"}
            </div>
            <div className="text-base text-softphone-foreground-muted">
              {formatPhoneNumber(state.call.phoneNumber || "")}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-softphone-foreground-muted">
              {getCallStateLabel(state.call.state)}
            </span>
            <span className="text-base font-medium">
              {callDuration}
            </span>
            {state.call.state === 'hold' && (
              <span className="text-xs text-softphone-accent">
                Hold: {holdDuration}
              </span>
            )}
          </div>
        </div>
        
        {/* Call Actions */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-softphone-border">
          {state.call.state === 'ringing' && state.call.direction === 'inbound' ? (
            <div className="flex justify-center w-full space-x-4">
              <button 
                onClick={endCall}
                className="softphone-button softphone-button-end w-12 h-12"
                aria-label="Decline Call"
              >
                <PhoneOff size={20} />
              </button>
              <button 
                onClick={answerCall}
                className="softphone-button softphone-button-call w-12 h-12"
                aria-label="Answer Call"
              >
                <Phone size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-between w-full">
              <button 
                onClick={toggleMute}
                className={`softphone-button ${state.isMuted ? 'bg-softphone-notready text-white' : ''}`}
                aria-label={state.isMuted ? "Unmute" : "Mute"}
              >
                {state.isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              
              {state.call.state === 'hold' ? (
                <button 
                  onClick={unholdCall}
                  className="softphone-button"
                  aria-label="Resume Call"
                >
                  <Play size={20} />
                </button>
              ) : (
                <button 
                  onClick={holdCall}
                  className="softphone-button"
                  aria-label="Hold Call"
                  disabled={state.call.state !== 'connected'}
                >
                  <Pause size={20} />
                </button>
              )}
              
              <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="softphone-button"
                    aria-label="Transfer Call"
                    disabled={!['connected', 'hold'].includes(state.call.state)}
                  >
                    <Radio size={20} />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transfer Call</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="transfer-number">Transfer to number</Label>
                      <Input 
                        id="transfer-number"
                        value={transferNumber}
                        onChange={(e) => setTransferNumber(e.target.value)}
                        placeholder="Enter phone number"
                        type="tel"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleTransfer}>
                        Transfer
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={conferenceDialogOpen} onOpenChange={setConferenceDialogOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="softphone-button"
                    aria-label="Conference Call"
                    disabled={!['connected', 'hold'].includes(state.call.state)}
                  >
                    <UserPlus size={20} />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add to Conference</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="conference-number">Add participant</Label>
                      <Input 
                        id="conference-number"
                        value={conferenceNumber}
                        onChange={(e) => setConferenceNumber(e.target.value)}
                        placeholder="Enter phone number"
                        type="tel"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setConferenceDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleConference}>
                        Add
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <button 
                onClick={endCall}
                className="softphone-button softphone-button-end"
                aria-label="End Call"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
