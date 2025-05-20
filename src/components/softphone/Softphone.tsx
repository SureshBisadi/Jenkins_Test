import { SoftphoneProvider } from "@/context/SoftphoneContext";
import { useState } from "react";
import { AgentStatusBar } from "./AgentStatusBar";
import { ActiveCall } from "./ActiveCall";
import { Dialpad } from "./Dialpad";
import { SentimentAnalysis } from "./SentimentAnalysis";
import { Transcription } from "./Transcription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Phone } from "lucide-react";
import { CallDetails } from "./CallDetails";
import { useSoftphone } from "@/context/SoftphoneContext";
import { LoginPage } from "./LoginPage";

interface SoftphoneProps {
  embedded?: boolean;
}

function SoftphoneContent() {
  const { state } = useSoftphone();
  const [activeTab, setActiveTab] = useState<string>("dialpad");

  // When a call is active, auto-switch to details tab if we're on dialpad
  // This ensures the agent sees the call details when a call comes in
  if (state.call && activeTab === "dialpad") {
    setActiveTab("details");
  }

  // if (!state.isLoggedIn) {
  //   return <LoginPage />;
  // }

  return (
    <div className="flex flex-col h-full">
      <AgentStatusBar />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col flex-1 h-[calc(100%-4.5rem)]"
      >
        <div className="flex-1 overflow-y-auto">
          <ActiveCall />

          {!state.call && (
            <TabsContent value="dialpad" className="m-0 flex-1">
              <Dialpad />
            </TabsContent>
          )}

          <TabsContent value="details" className="m-0 px-4 py-2">
            <CallDetails />
          </TabsContent>

          <SentimentAnalysis />
          <Transcription />
        </div>

        <TabsList className="grid grid-cols-2 border-t border-softphone-border rounded-none bg-softphone-surface mt-auto">
          <TabsTrigger
            value="dialpad"
            className="flex items-center gap-2"
            disabled={!!state.call}
          >
            <Phone size={16} />
            <span>Dialpad</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Details</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export function Softphone({ embedded = false }: SoftphoneProps) {
  return (
    <SoftphoneProvider>
      <div className={`softphone-container ${embedded ? "embedded" : ""}`}>
        <SoftphoneContent />
      </div>
    </SoftphoneProvider>
  );
}
