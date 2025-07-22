import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, GraduationCap, Video, Building, Star } from "lucide-react";
import { useState } from "react";
import BookingModal from "./BookingModal";
import type { Dentist } from "@shared/schema";

interface DentistCardProps {
  dentist: Dentist;
  showBooking?: boolean;
}

export default function DentistCard({ dentist, showBooking = false }: DentistCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const formatPrice = (priceInCents: number | null) => {
    if (!priceInCents) return "Contact for pricing";
    return `$${(priceInCents / 100).toFixed(0)}`;
  };

  return (
    <>
      <Card className="hover:shadow-xl transition-shadow overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <img 
              src={dentist.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
              alt={dentist.name} 
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h4 className="text-xl font-semibold text-dark-gray">{dentist.name}</h4>
              <p className="text-medium-gray">{dentist.specialty}</p>
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

          <div className="mb-4">
            <p className="text-medium-gray text-sm mb-2">
              <MapPin className="inline mr-2 h-4 w-4" />
              {dentist.location || "Location not specified"}
            </p>
            {dentist.education && (
              <p className="text-medium-gray text-sm mb-2">
                <GraduationCap className="inline mr-2 h-4 w-4" />
                {dentist.education}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {dentist.offersVideo && (
              <Badge variant="secondary" className="bg-blue-100 text-medical-blue">
                <Video className="mr-1 h-3 w-3" />
                Video Consultation
              </Badge>
            )}
            {dentist.offersClinic && (
              <Badge variant="secondary" className="bg-green-100 text-success-green">
                <Building className="mr-1 h-3 w-3" />
                Clinic Visit
              </Badge>
            )}
          </div>

          <div className="mb-4">
            <p className="text-sm text-medium-gray mb-2">Next Available:</p>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-success-green text-white">
                Today 2:30 PM
              </Badge>
              <Badge variant="outline" className="bg-gray-200 text-dark-gray">
                Tomorrow 9:00 AM
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-medium-gray">Starting from</p>
              <p className="text-lg font-semibold text-dark-gray">
                {formatPrice(dentist.priceFrom)}
              </p>
            </div>
            <Button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-medical-blue hover:bg-medical-blue-dark"
            >
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {isBookingOpen && (
        <BookingModal 
          dentist={dentist}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </>
  );
}
