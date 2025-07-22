import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  onSwitchMode: () => void;
}

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [step, setStep] = useState<"phone" | "otp" | "details">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      return apiRequest("POST", "/api/auth/send-otp", { phoneNumber: phone });
    },
    onSuccess: () => {
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code. Demo OTP: 123456",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      return apiRequest("POST", "/api/auth/verify-otp", { 
        phoneNumber: phone, 
        otp,
        mode 
      });
    },
    onSuccess: (data) => {
      if (mode === "signup" && data.needsDetails) {
        setStep("details");
      } else {
        // Login successful
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        toast({
          title: "Success",
          description: mode === "signin" ? "Signed in successfully!" : "Account created successfully!",
        });
        onClose();
        resetForm();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Invalid OTP",
        variant: "destructive",
      });
    },
  });

  const completeSignupMutation = useMutation({
    mutationFn: async (details: { firstName: string; lastName: string; email: string }) => {
      return apiRequest("POST", "/api/auth/complete-signup", {
        phoneNumber,
        ...details,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully!",
      });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete signup",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setStep("phone");
    setPhoneNumber("");
    setOtp("");
    setFirstName("");
    setLastName("");
    setEmail("");
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleSendOtp = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }
    sendOtpMutation.mutate(phoneNumber);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    verifyOtpMutation.mutate({ phone: phoneNumber, otp });
  };

  const handleCompleteSignup = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    completeSignupMutation.mutate({ firstName, lastName, email });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-medical-blue">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === "phone" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+855 12 345 678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-center"
                />
                <p className="text-sm text-gray-500 text-center">
                  We'll send you a verification code
                </p>
              </div>

              <Button
                onClick={handleSendOtp}
                disabled={sendOtpMutation.isPending}
                className="w-full bg-medical-blue hover:bg-medical-blue-dark"
              >
                {sendOtpMutation.isPending ? "Sending..." : "Send Verification Code"}
              </Button>

              <div className="text-center">
                <button
                  onClick={onSwitchMode}
                  className="text-medical-blue hover:underline text-sm"
                >
                  {mode === "signin" 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-medium">Enter Verification Code</h3>
                  <p className="text-sm text-gray-500">
                    Sent to {phoneNumber}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Demo OTP: 123456
                  </p>
                </div>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOtp}
                  disabled={verifyOtpMutation.isPending || otp.length !== 6}
                  className="w-full bg-medical-blue hover:bg-medical-blue-dark"
                >
                  {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setStep("phone")}
                  className="w-full"
                >
                  Change Phone Number
                </Button>
              </div>
            </>
          )}

          {step === "details" && (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-medium">Complete Your Profile</h3>
                  <p className="text-sm text-gray-500">
                    Just a few more details to get started
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCompleteSignup}
                disabled={completeSignupMutation.isPending}
                className="w-full bg-medical-blue hover:bg-medical-blue-dark"
              >
                {completeSignupMutation.isPending ? "Creating Account..." : "Complete Registration"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}