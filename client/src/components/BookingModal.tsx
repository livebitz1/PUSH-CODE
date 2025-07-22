import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin, GraduationCap, Video, Building, Star, Calendar, Clock, FileText, X } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Dentist } from "@shared/schema";

interface BookingModalProps {
  dentist: Dentist;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ dentist, isOpen, onClose }: BookingModalProps) {
  const [consultationType, setConsultationType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      await apiRequest("POST", "/api/appointments", bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been successfully booked.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      onClose();
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
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consultationType || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select consultation type, date, and time.",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      dentistId: dentist.id,
      date: selectedDate,
      startTime: selectedTime,
      endTime: getEndTime(selectedTime),
      consultationType,
      reason,
      price: dentist.priceFrom || 15000, // Default price in cents
    };

    bookingMutation.mutate(bookingData);
  };

  const getEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const dates = [
    { label: "Today", value: "2024-12-13" },
    { label: "Tomorrow", value: "2024-12-14" },
    { label: "Sat", value: "2024-12-15" },
    { label: "Sun", value: "2024-12-16" },
    { label: "Mon", value: "2024-12-17" },
    { label: "Tue", value: "2024-12-18" },
    { label: "Wed", value: "2024-12-19" },
  ];

  const timeSlots = [
    "09:00", "10:30", "14:00", "15:30", "16:00", "17:30"
  ];

  const formatPrice = (priceInCents: number | null) => {
    if (!priceInCents) return "$150";
    return `$${(priceInCents / 100).toFixed(0)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-dark-gray">Book Appointment</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Dentist Info */}
        <div className="py-6 border-b border-gray-200">
          <div className="flex items-center">
            <img 
              src={dentist.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
              alt={dentist.name} 
              className="w-20 h-20 rounded-full object-cover mr-4"
            />
            <div>
              <h4 className="text-xl font-semibold text-dark-gray">{dentist.name}</h4>
              <p className="text-medium-gray">{dentist.specialty}</p>
              <p className="text-medium-gray text-sm">{dentist.location}</p>
              <div className="flex items-center mt-1">
                <div className="flex text-yellow-400 mr-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-medium-gray text-sm">
                  {dentist.rating || "4.9"} ({dentist.reviewCount || 0} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="py-6">
          {/* Consultation Type */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-dark-gray mb-3 block">Consultation Type</Label>
            <RadioGroup value={consultationType} onValueChange={setConsultationType}>
              <div className="grid grid-cols-2 gap-4">
                {dentist.offersVideo && (
                  <div className="relative">
                    <RadioGroupItem value="video" id="video" className="sr-only" />
                    <Label 
                      htmlFor="video" 
                      className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                        consultationType === "video" ? "border-medical-blue bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      <div className="text-center">
                        <Video className="text-medical-blue text-2xl mb-2 mx-auto" />
                        <p className="font-medium text-dark-gray">Video Consultation</p>
                        <p className="text-sm text-medium-gray">Online appointment</p>
                      </div>
                    </Label>
                  </div>
                )}
                {dentist.offersClinic && (
                  <div className="relative">
                    <RadioGroupItem value="clinic" id="clinic" className="sr-only" />
                    <Label 
                      htmlFor="clinic" 
                      className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                        consultationType === "clinic" ? "border-medical-blue bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      <div className="text-center">
                        <Building className="text-success-green text-2xl mb-2 mx-auto" />
                        <p className="font-medium text-dark-gray">Clinic Visit</p>
                        <p className="text-sm text-medium-gray">In-person appointment</p>
                      </div>
                    </Label>
                  </div>
                )}
              </div>
            </RadioGroup>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-dark-gray mb-3 block">Select Date</Label>
            <div className="grid grid-cols-7 gap-2">
              {dates.map((date) => (
                <Button
                  key={date.value}
                  type="button"
                  variant={selectedDate === date.value ? "default" : "outline"}
                  className={`p-2 text-center ${
                    selectedDate === date.value 
                      ? "bg-medical-blue text-white" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedDate(date.value)}
                >
                  <div>
                    <p className="text-sm font-medium">{date.label}</p>
                    <p className="text-xs">{date.value.split('-').slice(1).join('/')}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-dark-gray mb-3 block">Available Time Slots</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`text-sm font-medium ${
                    selectedTime === time 
                      ? "bg-medical-blue text-white" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-dark-gray mb-3 block">Reason for Visit</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe your dental concern or reason for visit..."
              className="resize-none"
              rows={4}
            />
          </div>

          {/* Booking Summary */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h4 className="font-semibold text-dark-gray mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-medium-gray">Dentist:</span>
                  <span className="font-medium">{dentist.name}</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between">
                    <span className="text-medium-gray">Date:</span>
                    <span className="font-medium">{selectedDate}</span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex justify-between">
                    <span className="text-medium-gray">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                )}
                {consultationType && (
                  <div className="flex justify-between">
                    <span className="text-medium-gray">Type:</span>
                    <span className="font-medium">
                      {consultationType === "video" ? "Video Consultation" : "Clinic Visit"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-medium-gray">Total:</span>
                  <span className="font-semibold text-lg">{formatPrice(dentist.priceFrom)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-medical-blue hover:bg-medical-blue-dark"
              disabled={bookingMutation.isPending}
            >
              {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
