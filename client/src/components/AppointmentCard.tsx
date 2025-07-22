import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Building, FileText } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { AppointmentWithDentist } from "@shared/schema";

interface AppointmentCardProps {
  appointment: AppointmentWithDentist;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/appointments/${appointment.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success-green text-white";
      case "pending":
        return "bg-warning-amber text-white";
      case "cancelled":
        return "bg-error-red text-white";
      case "completed":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (startTime: string, endTime: string) => {
    const formatTimeString = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    return `${formatTimeString(startTime)} - ${formatTimeString(endTime)}`;
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      cancelMutation.mutate();
    }
  };

  const handleJoinCall = () => {
    // TODO: Implement video call functionality
    toast({
      title: "Video Call",
      description: "Video call feature will be available soon.",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img 
              src={appointment.dentist.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
              alt={appointment.dentist.name} 
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div>
              <h4 className="font-semibold text-dark-gray">{appointment.dentist.name}</h4>
              <p className="text-sm text-medium-gray">{appointment.dentist.specialty}</p>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-medium-gray">
            <Calendar className="mr-3 h-4 w-4" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center text-sm text-medium-gray">
            <Clock className="mr-3 h-4 w-4" />
            <span>{formatTime(appointment.startTime, appointment.endTime)}</span>
          </div>
          <div className="flex items-center text-sm text-medium-gray">
            {appointment.consultationType === "video" ? (
              <Video className="mr-3 h-4 w-4" />
            ) : (
              <Building className="mr-3 h-4 w-4" />
            )}
            <span>
              {appointment.consultationType === "video" ? "Video Consultation" : "Clinic Visit"}
            </span>
          </div>
          {appointment.reason && (
            <div className="flex items-center text-sm text-medium-gray">
              <FileText className="mr-3 h-4 w-4" />
              <span>{appointment.reason}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" size="sm" disabled>
            Reschedule
          </Button>
          <div className="flex space-x-2">
            {appointment.status === "confirmed" && appointment.consultationType === "video" && (
              <Button 
                size="sm" 
                onClick={handleJoinCall}
                className="bg-medical-blue hover:bg-medical-blue-dark"
              >
                Join Call
              </Button>
            )}
            {appointment.status === "pending" && (
              <Button 
                size="sm" 
                className="bg-gray-300 text-gray-500 cursor-not-allowed"
                disabled
              >
                Pending Confirmation
              </Button>
            )}
            {appointment.status !== "cancelled" && appointment.status !== "completed" && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
