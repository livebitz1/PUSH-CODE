import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DentistCard from "@/components/DentistCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Booking() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: dentists, isLoading: dentistsLoading, error } = useQuery({
    queryKey: ["/api/dentists"],
    retry: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Handle API errors
  useEffect(() => {
    if (error && isUnauthorizedError(error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />
      
      {/* Dentist Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-dark-gray mb-4">Book Your Appointment</h3>
            <p className="text-medium-gray text-lg">Choose from verified dental professionals with excellent patient reviews</p>
          </div>

          {/* Dentist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dentistsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center mb-4">
                    <Skeleton className="w-16 h-16 rounded-full mr-4" />
                    <div>
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </Card>
              ))
            ) : dentists && dentists.length > 0 ? (
              dentists.map((dentist) => (
                <DentistCard key={dentist.id} dentist={dentist} showBooking={true} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-medium-gray text-lg">No dentists available</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
