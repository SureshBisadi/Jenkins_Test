
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  AgentStatusType, 
  CallDirectionType, 
  CallStateType, 
  NotReadyReasonType, 
  SentimentType 
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format phone number to (XXX) XXX-XXXX
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return "";
  
  // Strip all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, "");
  
  // Format the number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  }
  
  return phoneNumber;
}

// Format seconds to MM:SS
export function formatDuration(seconds: number): string {
  if (!seconds) return "00:00";
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Get color class based on agent status
export function getStatusColorClass(status: AgentStatusType): string {
  switch (status) {
    case "ready":
      return "bg-softphone-ready text-white";
    case "not-ready":
      return "bg-softphone-notready text-white";
    case "after-call":
      return "bg-softphone-aftercall text-white";
    case "offline":
    default:
      return "bg-softphone-neutral text-white";
  }
}

// Get readable status name
export function getStatusName(status: AgentStatusType): string {
  switch (status) {
    case "ready":
      return "Ready";
    case "not-ready":
      return "Not Ready";
    case "after-call":
      return "After Call Work";
    case "offline":
      return "Offline";
    default:
      return status;
  }
}

// Get label for call direction
export function getCallDirectionLabel(direction: CallDirectionType): string {
  switch (direction) {
    case "inbound":
      return "Incoming Call";
    case "outbound":
      return "Outgoing Call";
    case "internal":
      return "Internal Call";
    default:
      return direction;
  }
}

// Get label for call state
export function getCallStateLabel(state: CallStateType): string {
  switch (state) {
    case "idle":
      return "Idle";
    case "ringing":
      return "Ringing";
    case "connected":
      return "Connected";
    case "hold":
      return "On Hold";
    case "transferring":
      return "Transferring";
    case "conferencing":
      return "Conferencing";
    case "after-call":
      return "After Call Work";
    default:
      return state;
  }
}

// Get sentiment color class
export function getSentimentColorClass(sentiment: SentimentType): string {
  switch (sentiment) {
    case "positive":
      return "sentiment-positive";
    case "negative":
      return "sentiment-negative";
    case "neutral":
    default:
      return "sentiment-neutral";
  }
}

// Default list of Not Ready reasons
export const defaultNotReadyReasons: NotReadyReasonType[] = [
  { id: "break", label: "Break" },
  { id: "lunch", label: "Lunch" },
  { id: "meeting", label: "Meeting" },
  { id: "training", label: "Training" },
  { id: "system-issue", label: "System Issue" },
  { id: "personal", label: "Personal Time" },
  { id: "admin", label: "Administrative Work" },
  { id: "coaching", label: "Coaching Session" },
];

// Simulate incoming calls (for demo purposes)
export function getRandomPhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const prefix = Math.floor(Math.random() * 900) + 100;
  const lineNumber = Math.floor(Math.random() * 9000) + 1000;
  
  return `${areaCode}${prefix}${lineNumber}`;
}
