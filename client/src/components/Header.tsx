import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Stethoscope, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "@/components/AuthModal";
import logoPath from "@assets/Logo png_1752749850863.png";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    },
  });

  const handleSignOut = () => {
    logoutMutation.mutate();
  };

  const handleSignIn = () => {
    setAuthMode("signin");
    setAuthModalOpen(true);
  };

  const handleSwitchAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <img 
              src={logoPath} 
              alt="Santepheap Dental Clinic" 
              className="h-10 w-10 mr-3 object-contain"
            />
            <h1 className="text-2xl font-bold text-dark-gray">Santepheap</h1>
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-medium-gray hover:text-medical-blue transition-colors">
                My Appointments
              </Link>
              <Link href="/booking" className="text-medium-gray hover:text-medical-blue transition-colors">
                Book Appointment
              </Link>
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/products">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Shop Products
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  {user?.profileImageUrl && (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.firstName || "User"} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-dark-gray font-medium">
                    {user?.firstName || "User"}
                  </span>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="km">🇰🇭 ខ្មែរ</SelectItem>
                  </SelectContent>
                </Select>
              </>
            ) : (
              <>
                <Button onClick={handleSignIn}>
                  Sign In
                </Button>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="km">🇰🇭 ខ্মែរ</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={handleSwitchAuthMode}
      />
    </header>
  );
}
