import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Phone } from "lucide-react";

export function LoginPage() {
  //   const { dispatch } = useSoftphone();
  const [agentId, setAgentId] = useState("");
  const [password, setPassword] = useState("");
  const [extension, setExtension] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    agentId: false,
    password: false,
    extension: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      agentId: agentId.trim() === "",
      password: password.trim() === "",
      extension: extension.trim() === "",
    };
    setErrors(newErrors);

    // Stop submission if any field is empty
    if (Object.values(newErrors).some((error) => error)) return;

    setIsLoading(true);

    // Simulated login process
    setTimeout(() => {
      console.log("Logging in with:", { agentId, password, extension });
      setIsLoading(false);
    }, 800);
  };

  // This function allows only numeric input for all fields
  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
    field: keyof typeof errors
  ) => {
    const value = e.target.value;
    // Only update state if the input is empty or contains only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setter(value);
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-lg mx-auto bg-login-surface">
      <div className="px-4 py-3 border-b border-login-border bg-login-surface/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center">
          <Phone className="h-6 w-6 text-login-accent mr-2" />
          <h1 className="text-lg font-medium">Agent Login</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-full max-w-lg mx-auto"
        >
          {/* Agent ID Field */}

          <div className="space-y-2">
            <label
              htmlFor="agentId"
              className="text-sm font-medium text-login-foreground flex items-center gap-2"
            >
              <User
                size={16}
                className={
                  errors.agentId ? "text-red-500" : "text-login-accent"
                }
              />
              Agent ID
            </label>
            <Input
              id="agentId"
              type="text"
              value={agentId}
              onChange={(e) => handleNumericInput(e, setAgentId, "agentId")}
              required
              placeholder="Enter your agent ID"
              className={"border-login-border"}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

          {/* Password Field */}

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-login-foreground flex items-center gap-2"
            >
              <Lock
                size={16}
                className={
                  errors.password ? "text-red-500" : "text-login-accent"
                }
              />
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handleNumericInput(e, setPassword, "password")}
              required
              placeholder="Enter your password"
              className={"border-login-border"}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="extension"
              className="text-sm font-medium text-login-foreground flex items-center gap-2"
            >
              <Phone
                size={16}
                className={
                  errors.extension ? "text-red-500" : "text-login-accent"
                }
              />
              Extension
            </label>
            <Input
              id="extension"
              type="text"
              value={extension}
              onChange={(e) => handleNumericInput(e, setExtension, "extension")}
              required
              placeholder="Enter your extension"
              className={"border-login-border"}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

          {/* Submit Button */}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-login-primary text-login-primary-foreground hover:bg-login-accent"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
