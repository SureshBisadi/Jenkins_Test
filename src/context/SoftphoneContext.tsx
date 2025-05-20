import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  AgentStatusType,
  CallInfoType,
  CallStateType,
  NotReadyReasonType,
  SentimentDataType,
  SentimentType,
  TranscriptionEntryType,
} from "@/lib/types";
import { defaultNotReadyReasons, getRandomPhoneNumber } from "@/lib/utils";
import { toast } from "sonner";

// State types
type SoftphoneState = {
  isLoggedIn: boolean;
  agentId: string;
  extension: string;
  password: string;
  agentStatus: AgentStatusType;
  notReadyReason: NotReadyReasonType | null;
  statusStartTime: Date | null;
  dialpadValue: string;
  call: CallInfoType | null;
  sentiment: SentimentDataType | null;
  transcription: TranscriptionEntryType[];
  isTranscriptionCollapsed: boolean;
  isMuted: boolean;
};

// Action types
type SoftphoneAction =
  | {
      type: "LOGIN";
      payload: { agentId: string; password: string; extension: string };
    }
  | { type: "LOGOUT" }
  | {
      type: "SET_AGENT_STATUS";
      status: AgentStatusType;
      reason?: NotReadyReasonType;
    }
  | { type: "SET_DIALPAD_VALUE"; value: string }
  | { type: "CLEAR_DIALPAD" }
  | { type: "START_CALL"; call: CallInfoType }
  | { type: "END_CALL" }
  | { type: "UPDATE_CALL_STATE"; state: CallStateType }
  | { type: "UPDATE_CALL_INFO"; info: Partial<CallInfoType> }
  | { type: "UPDATE_SENTIMENT"; sentiment: SentimentDataType }
  | { type: "ADD_TRANSCRIPTION_ENTRY"; entry: TranscriptionEntryType }
  | { type: "TOGGLE_TRANSCRIPTION_COLLAPSE" }
  | { type: "TOGGLE_MUTE" };

// Initial state
const initialState: SoftphoneState = {
  isLoggedIn: false,
  agentId: "",
  extension: "",
  password: "",
  agentStatus: "offline",
  notReadyReason: null,
  statusStartTime: null,
  dialpadValue: "",
  call: null,
  sentiment: null,
  transcription: [],
  isTranscriptionCollapsed: false,
  isMuted: false,
};

// Reducer
function softphoneReducer(
  state: SoftphoneState,
  action: SoftphoneAction
): SoftphoneState {
  switch (action.type) {
    case "LOGIN":
      toast.success(`Welcome, Agent ${action.payload.agentId}`);
      return {
        ...state,
        isLoggedIn: true,
        agentId: action.payload.agentId,
        password: action.payload.password,
        extension: action.payload.extension,
        agentStatus: "ready",
        statusStartTime: new Date(),
      };
    case "LOGOUT":
      return {
        ...initialState,
      };
    case "SET_AGENT_STATUS":
      return {
        ...state,
        agentStatus: action.status,
        notReadyReason:
          action.status === "not-ready" ? action.reason || null : null,
        statusStartTime: new Date(),
      };

    case "SET_DIALPAD_VALUE":
      return {
        ...state,
        dialpadValue: action.value,
      };

    case "CLEAR_DIALPAD":
      return {
        ...state,
        dialpadValue: "",
      };

    case "START_CALL":
      return {
        ...state,
        call: {
          ...action.call,
          ivr:
            action.call.direction === "inbound"
              ? `Menu-${Math.floor(Math.random() * 5) + 1}`
              : undefined,
          waitTime:
            action.call.direction === "inbound"
              ? Math.floor(Math.random() * 180)
              : undefined,
        },
        sentiment: {
          overallSentiment: "neutral",
          score: 0,
          history: [],
        },
        transcription: [],
      };

    case "END_CALL":
      return {
        ...state,
        call: null,
        agentStatus: "after-call",
        statusStartTime: new Date(),
      };

    case "UPDATE_CALL_STATE":
      return {
        ...state,
        call: state.call
          ? {
              ...state.call,
              state: action.state,
              holdStartTime:
                action.state === "hold" ? new Date() : state.call.holdStartTime,
            }
          : null,
      };

    case "UPDATE_CALL_INFO":
      return {
        ...state,
        call: state.call ? { ...state.call, ...action.info } : null,
      };

    case "UPDATE_SENTIMENT":
      return {
        ...state,
        sentiment: action.sentiment,
      };

    case "ADD_TRANSCRIPTION_ENTRY":
      return {
        ...state,
        transcription: [...state.transcription, action.entry],
      };

    case "TOGGLE_TRANSCRIPTION_COLLAPSE":
      return {
        ...state,
        isTranscriptionCollapsed: !state.isTranscriptionCollapsed,
      };

    case "TOGGLE_MUTE":
      return {
        ...state,
        isMuted: !state.isMuted,
      };

    default:
      return state;
  }
}

// Context
type SoftphoneContextType = {
  state: SoftphoneState;
  // dispatch: React.Dispatch<SoftphoneAction>;
  setAgentStatus: (
    status: AgentStatusType,
    reason?: NotReadyReasonType
  ) => void;
  setDialpadValue: (value: string) => void;
  clearDialpad: () => void;
  makeCall: (phoneNumber: string) => void;
  answerCall: () => void;
  endCall: () => void;
  holdCall: () => void;
  unholdCall: () => void;
  transferCall: (destination: string) => void;
  conferenceCall: (destination: string) => void;
  toggleMute: () => void;
  toggleTranscriptionCollapse: () => void;
  logout: () => void;
  notReadyReasons: NotReadyReasonType[];
};

const SoftphoneContext = createContext<SoftphoneContextType | undefined>(
  undefined
);

// Provider
export function SoftphoneProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(softphoneReducer, {
    ...initialState,
    statusStartTime: new Date(),
  });
  const [notReadyReasons] = useState<NotReadyReasonType[]>(
    defaultNotReadyReasons
  );
  const [callDurationInterval, setCallDurationInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Demo incoming call simulation
  useEffect(() => {
    let incomingCallTimeout: NodeJS.Timeout | null = null;

    if (state.agentStatus === "ready" && !state.call) {
      // Simulate an incoming call shortly after going to Ready status
      incomingCallTimeout = setTimeout(() => {
        const phoneNumber = getRandomPhoneNumber();
        const callerNames = [
          "John Smith",
          "Maria Garcia",
          "Alex Taylor",
          "Sarah Johnson",
          "Michael Brown",
          "Emma Wilson",
          "David Chen",
          "Olivia Davis",
        ];
        const queueNames = [
          "Sales",
          "Support",
          "Billing",
          "New Accounts",
          "Technical Help",
        ];

        const incomingCall: CallInfoType = {
          id: `call-${Date.now()}`,
          direction: "inbound",
          state: "ringing",
          phoneNumber,
          callerName:
            callerNames[Math.floor(Math.random() * callerNames.length)],
          startTime: new Date(),
          duration: 0,
          queueName: queueNames[Math.floor(Math.random() * queueNames.length)],
          ivr: `Menu-${Math.floor(Math.random() * 5) + 1}`,
          waitTime: Math.floor(Math.random() * 180), // Random wait time up to 3 minutes
          notes:
            Math.random() > 0.7
              ? "Customer contacted us last week about billing issue #34928"
              : undefined,
        };

        dispatch({ type: "START_CALL", call: incomingCall });
        toast.info("Incoming call", {
          description: `${incomingCall.callerName} - ${phoneNumber}`,
        });
      }, 5000); // Call comes in after 5 seconds of being Ready
    }

    return () => {
      if (incomingCallTimeout) clearTimeout(incomingCallTimeout);
    };
  }, [state.agentStatus, state.call]);

  // Call duration timer
  useEffect(() => {
    if (state.call?.state === "connected" && !callDurationInterval) {
      const interval = setInterval(() => {
        if (state.call) {
          dispatch({
            type: "UPDATE_CALL_INFO",
            info: { duration: (state.call.duration || 0) + 1 },
          });
        }
      }, 1000);

      setCallDurationInterval(interval);
    } else if (
      (!state.call || state.call.state !== "connected") &&
      callDurationInterval
    ) {
      clearInterval(callDurationInterval);
      setCallDurationInterval(null);
    }

    return () => {
      if (callDurationInterval) clearInterval(callDurationInterval);
    };
  }, [state.call, callDurationInterval]);

  // Demo transcription and sentiment generator
  useEffect(() => {
    let transcriptionInterval: NodeJS.Timeout | null = null;

    if (state.call?.state === "connected") {
      // Generate fake transcription entries
      transcriptionInterval = setInterval(() => {
        const isSpeakingCustomer = Math.random() > 0.5;
        const sentimentOptions: SentimentType[] = [
          "positive",
          "neutral",
          "negative",
        ];
        const sentiment: SentimentType =
          sentimentOptions[Math.floor(Math.random() * sentimentOptions.length)];

        // Simple placeholder texts
        const customerPhrases = [
          "I need help with my recent order.",
          "When will my package arrive?",
          "This is taking too long, I'm frustrated.",
          "Thank you for your assistance today.",
          "Can you explain how this works?",
          "I'm still waiting for a resolution.",
          "Your service has been excellent.",
          "I've been a customer for years.",
          "This is not what I expected.",
          "I appreciate your patience.",
        ];

        const agentPhrases = [
          "I'd be happy to help you with that.",
          "Let me check your account information.",
          "I understand your concern.",
          "Is there anything else I can assist you with?",
          "I apologize for the inconvenience.",
          "Let me transfer you to a specialist.",
          "Thank you for your patience.",
          "Could you please provide more details?",
          "I'm working on resolving this for you.",
          "I appreciate your understanding.",
        ];

        const entry: TranscriptionEntryType = {
          id: `entry-${Date.now()}`,
          speaker: isSpeakingCustomer ? "customer" : "agent",
          text: isSpeakingCustomer
            ? customerPhrases[
                Math.floor(Math.random() * customerPhrases.length)
              ]
            : agentPhrases[Math.floor(Math.random() * agentPhrases.length)],
          timestamp: new Date(),
          sentiment: isSpeakingCustomer ? sentiment : "neutral",
        };

        dispatch({ type: "ADD_TRANSCRIPTION_ENTRY", entry });

        // Update sentiment if customer is speaking
        if (isSpeakingCustomer && state.sentiment) {
          const sentimentScore =
            sentiment === "positive"
              ? Math.random() * 0.5 + 0.5
              : sentiment === "negative"
              ? -Math.random() * 0.5 - 0.5
              : Math.random() * 0.6 - 0.3;

          const newHistory = [
            ...(state.sentiment.history || []),
            { timestamp: new Date(), sentiment, score: sentimentScore },
          ];

          // Calculate overall sentiment (average of last 5 entries)
          const recentEntries = newHistory.slice(
            Math.max(0, newHistory.length - 5)
          );
          const avgScore =
            recentEntries.reduce((sum, entry) => sum + entry.score, 0) /
            recentEntries.length;

          let overallSentiment: SentimentType = "neutral";
          if (avgScore > 0.2) overallSentiment = "positive";
          else if (avgScore < -0.2) overallSentiment = "negative";

          dispatch({
            type: "UPDATE_SENTIMENT",
            sentiment: {
              overallSentiment,
              score: avgScore,
              history: newHistory,
            },
          });
        }
      }, Math.random() * 5000 + 3000); // Between 3-8 seconds
    }

    return () => {
      if (transcriptionInterval) clearInterval(transcriptionInterval);
    };
  }, [state.call, state.sentiment]);

  // Methods
  const setAgentStatus = (
    status: AgentStatusType,
    reason?: NotReadyReasonType
  ) => {
    dispatch({ type: "SET_AGENT_STATUS", status, reason });

    // Show toast notification
    if (status === "ready") {
      toast.success("Status changed", {
        description: "You are now Ready",
      });
    } else if (status === "not-ready") {
      toast.info("Status changed", {
        description: `Not Ready: ${reason?.label || "No reason provided"}`,
      });
    } else if (status === "after-call") {
      toast.info("Status changed", {
        description: "After Call Work",
      });
    } else if (status === "offline") {
      toast.info("Status changed", {
        description: "You are now Offline",
      });
    }
  };

  const setDialpadValue = (value: string) => {
    dispatch({ type: "SET_DIALPAD_VALUE", value });
  };

  const clearDialpad = () => {
    dispatch({ type: "CLEAR_DIALPAD" });
  };

  const makeCall = (phoneNumber: string) => {
    if (!phoneNumber) return;

    // Cannot make a call when already on a call
    if (state.call) {
      toast.error("Cannot place call", {
        description: "You are already on a call",
      });
      return;
    }

    // Cannot make a call when not ready
    if (state.agentStatus !== "ready") {
      toast.error("Cannot place call", {
        description: "You must be in Ready status",
      });
      return;
    }

    const outgoingCall: CallInfoType = {
      id: `call-${Date.now()}`,
      direction: "outbound",
      state: "ringing",
      phoneNumber,
      startTime: new Date(),
      duration: 0,
    };

    dispatch({ type: "START_CALL", call: outgoingCall });

    // Auto-connect after a delay (simulating answer)
    setTimeout(() => {
      if (state.call && state.call.state === "ringing") {
        dispatch({ type: "UPDATE_CALL_STATE", state: "connected" });
        toast.success("Call connected", {
          description: phoneNumber,
        });
      }
    }, 2000);
  };

  const answerCall = () => {
    if (
      !state.call ||
      state.call.state !== "ringing" ||
      state.call.direction !== "inbound"
    ) {
      return;
    }

    dispatch({ type: "UPDATE_CALL_STATE", state: "connected" });
    toast.success("Call connected", {
      description: state.call.phoneNumber,
    });
  };

  const endCall = () => {
    if (!state.call) return;

    dispatch({ type: "END_CALL" });
    toast.info("Call ended", {
      description: state.call.phoneNumber,
    });
  };

  const holdCall = () => {
    if (!state.call || state.call.state !== "connected") return;

    dispatch({ type: "UPDATE_CALL_STATE", state: "hold" });
    toast.info("Call on hold", {
      description: state.call.phoneNumber,
    });
  };

  const unholdCall = () => {
    if (!state.call || state.call.state !== "hold") return;

    dispatch({ type: "UPDATE_CALL_STATE", state: "connected" });
    toast.info("Call resumed", {
      description: state.call.phoneNumber,
    });
  };

  const transferCall = (destination: string) => {
    if (
      !state.call ||
      (state.call.state !== "connected" && state.call.state !== "hold")
    )
      return;

    dispatch({ type: "UPDATE_CALL_STATE", state: "transferring" });
    toast.info("Transferring call", {
      description: `To: ${destination}`,
    });

    // Simulate transfer completion
    setTimeout(() => {
      dispatch({ type: "END_CALL" });
      toast.success("Call transferred", {
        description: `To: ${destination}`,
      });
    }, 2000);
  };

  const conferenceCall = (destination: string) => {
    if (
      !state.call ||
      (state.call.state !== "connected" && state.call.state !== "hold")
    )
      return;

    dispatch({ type: "UPDATE_CALL_STATE", state: "conferencing" });
    toast.info("Setting up conference", {
      description: `With: ${destination}`,
    });

    // Simulate conference setup
    setTimeout(() => {
      dispatch({ type: "UPDATE_CALL_STATE", state: "connected" });
      toast.success("Conference established", {
        description: `With: ${destination}`,
      });
    }, 3000);
  };

  const toggleMute = () => {
    dispatch({ type: "TOGGLE_MUTE" });
    toast.info(state.isMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const toggleTranscriptionCollapse = () => {
    dispatch({ type: "TOGGLE_TRANSCRIPTION_COLLAPSE" });
  };

  const logout = () => {
    // End any active call
    if (state.call) {
      endCall();
    }

    // Set status to offline
    setAgentStatus("offline");
    toast.info("Logged out successfully");
  };

  const contextValue: SoftphoneContextType = {
    state,
    setAgentStatus,
    setDialpadValue,
    clearDialpad,
    makeCall,
    answerCall,
    endCall,
    holdCall,
    unholdCall,
    transferCall,
    conferenceCall,
    toggleMute,
    toggleTranscriptionCollapse,
    logout,
    notReadyReasons,
  };

  return (
    <SoftphoneContext.Provider value={contextValue}>
      {children}
    </SoftphoneContext.Provider>
  );
}

export function useSoftphone() {
  const context = useContext(SoftphoneContext);

  if (!context) {
    throw new Error("useSoftphone must be used within a SoftphoneProvider");
  }

  return context;
}
