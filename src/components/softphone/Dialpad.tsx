
import { useSoftphone } from "@/context/SoftphoneContext";
import { Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Dialpad() {
  const { state, setDialpadValue, clearDialpad, makeCall } = useSoftphone();
  const [ripples, setRipples] = useState<Array<{ id: string; key: string }>>([]);
  
  useEffect(() => {
    // Clean up ripples after animation completes
    const timeout = setTimeout(() => {
      if (ripples.length > 0) {
        setRipples([]);
      }
    }, 600);
    
    return () => clearTimeout(timeout);
  }, [ripples]);
  
  const handleKeyPress = (key: string) => {
    // Add a ripple effect
    const newRipple = { id: `ripple-${Date.now()}`, key };
    setRipples([...ripples, newRipple]);
    
    // Play DTMF tone (in a real implementation)
    // playDTMFTone(key);
    
    // Update dialpad value
    setDialpadValue(state.dialpadValue + key);
  };
  
  const handleMakeCall = () => {
    if (state.dialpadValue) {
      makeCall(state.dialpadValue);
    }
  };
  
  return (
    <div className="p-4 space-y-4">
      <div className="relative h-12 softphone-surface flex items-center px-4">
        <input
          type="tel"
          className="w-full bg-transparent border-none focus:outline-none text-lg text-center"
          value={state.dialpadValue}
          readOnly
          placeholder="Enter number"
        />
        {state.dialpadValue && (
          <button
            onClick={clearDialpad}
            className="absolute right-2 p-1 rounded-full hover:bg-softphone-surface-hover"
            aria-label="Clear"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-3 mx-auto max-w-xs">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
          <button
            key={key}
            className="dialpad-button relative"
            onClick={() => handleKeyPress(key)}
          >
            {key}
            {key === '0' && <span className="text-xs text-softphone-foreground-muted">+</span>}
            {ripples.filter(r => r.key === key).map((ripple) => (
              <span key={ripple.id} className="softphone-ripple" />
            ))}
          </button>
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <button
          onClick={handleMakeCall}
          disabled={!state.dialpadValue || !!state.call}
          className={`softphone-button softphone-button-call w-14 h-14 ${
            !state.dialpadValue || !!state.call ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Call"
        >
          <Phone size={24} />
        </button>
      </div>
    </div>
  );
}
