import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppointmentCard from "@/components/AppointmentCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: appointments, isLoading: appointmentsLoading, error } = useQuery({
    queryKey: ["/api/appointments"],
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

  const upcomingAppointments = appointments?.filter(
    (appointment) => appointment.status !== "cancelled" && appointment.status !== "completed"
  ) || [];

  const pastAppointments = appointments?.filter(
    (appointment) => appointment.status === "completed"
  ) || [];

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />
      
      {/* User Dashboard */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-dark-gray mb-4">My Appointments</h3>
            <p className="text-medium-gray text-lg">Manage your upcoming and past dental appointments</p>
          </div>

          {/* Upcoming Appointments */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-dark-gray mb-6">Upcoming Appointments</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointmentsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="flex items-center mb-4">
                      <Skeleton className="w-12 h-12 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </Card>
                ))
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-medium-gray text-lg">No upcoming appointments</p>
                </div>
              )}
            </div>
          </div>

          {/* Past Appointments */}
          <div>
            <h4 className="text-2xl font-semibold text-dark-gray mb-6">Past Appointments</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointmentsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="flex items-center mb-4">
                      <Skeleton className="w-12 h-12 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </Card>
                ))
              ) : pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-medium-gray text-lg">No past appointments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
