import { Softphone } from "@/components/softphone/Softphone";
import { useState } from "react";
import { Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginPage } from "@/components/softphone/LoginPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("softphone");
  const [demoMode, setDemoMode] = useState<"standalone" | "embedded">(
    "standalone"
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-6 w-6 text-softphone-accent" />
            {/* <h1 className="text-xl font-medium">Contact Center Hub</h1> */}
          </div>

          <div className="flex items-center gap-4">
            {/* <Button variant="ghost" size="sm" className="gap-1">
              <Globe className="h-4 w-4" />
              Documentation
            </Button> */}

            <Button
              size="sm"
              onClick={() =>
                setDemoMode(
                  demoMode === "standalone" ? "embedded" : "standalone"
                )
              }
            >
              {demoMode === "standalone"
                ? "Show Embedded Mode"
                : "Show Standalone Mode"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            {/* <div className="md:w-1/3 lg:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Center</CardTitle>
                  <CardDescription>
                    Manage your calls and interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <TabsList className="grid w-full grid-cols-1 rounded-none border-b">
                    <TabsTrigger
                      value="overview"
                      className="justify-start py-3 px-6"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="softphone"
                      className="justify-start py-3 px-6"
                    >
                      Softphone
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>
            </div> */}

            <div className="md:w-2/3 lg:w-3/4">
              {/* <TabsContent value="overview" className="m-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Center Softphone</CardTitle>
                    <CardDescription>
                      A modern, embeddable softphone interface for contact
                      center agents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      This softphone interface includes all the essential
                      features for contact center agents:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Agent status management (Ready/Not Ready/After Call
                        Work)
                      </li>
                      <li>
                        Comprehensive call controls (Answer, End, Hold,
                        Transfer, Conference)
                      </li>
                      <li>Interactive dialpad with visual feedback</li>
                      <li>Real-time sentiment analysis visualization</li>
                      <li>
                        Live call transcription with speaker identification
                      </li>
                      <li>
                        Responsive design for embedding in CRMs like Salesforce
                        or MS Dynamics
                      </li>
                    </ul>
                    <div>
                      <Button onClick={() => setActiveTab("softphone")}>
                        Open Softphone
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}

              <TabsContent value="softphone" className="m-0">
                <div
                  className={`${
                    demoMode === "embedded"
                      ? "w-full h-[600px] border rounded-lg overflow-hidden"
                      : "flex justify-center py-8"
                  }`}
                >
                  <LoginPage />
                  {/* <Softphone embedded={demoMode === "embedded"} /> */}
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
