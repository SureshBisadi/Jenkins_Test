
// Agent status types
export type AgentStatusType = 'ready' | 'not-ready' | 'after-call' | 'offline';

export type NotReadyReasonType = {
  id: string;
  label: string;
};

// Call related types
export type CallDirectionType = 'inbound' | 'outbound' | 'internal';

export type CallStateType = 
  | 'idle' 
  | 'ringing' 
  | 'connected' 
  | 'hold' 
  | 'transferring' 
  | 'conferencing' 
  | 'after-call';

export type CallInfoType = {
  id?: string;
  direction: CallDirectionType;
  state: CallStateType;
  phoneNumber?: string;
  callerName?: string;
  duration?: number;
  startTime?: Date;
  holdTime?: number;
  holdStartTime?: Date;
  queueName?: string;
  notes?: string;
  ivr?: string;
  waitTime?: number;
};

// Sentiment analysis
export type SentimentType = 'positive' | 'neutral' | 'negative';

export type SentimentDataType = {
  overallSentiment: SentimentType;
  score: number; // -1 to 1 scale
  history: Array<{
    timestamp: Date;
    sentiment: SentimentType;
    score: number;
  }>;
};

// Transcription
export type TranscriptionEntryType = {
  id: string;
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: Date;
  sentiment?: SentimentType;
};
