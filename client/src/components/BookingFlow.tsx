import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, CreditCard, Calendar, Video, Building, Globe } from "lucide-react";

export default function BookingFlow() {
  const steps = [
    {
      step: 1,
      title: "Select Dentist",
      description: "Choose from qualified professionals",
      icon: Globe,
      features: ["Verified credentials", "Patient reviews", "Language preference", "Location filter"]
    },
    {
      step: 2,
      title: "Choose Service",
      description: "Select your treatment type",
      icon: CheckCircle,
      features: ["General dentistry", "Cosmetic procedures", "Emergency care", "Specialized treatments"]
    },
    {
      step: 3,
      title: "Book Appointment",
      description: "Schedule your preferred time",
      icon: Calendar,
      features: ["Real-time availability", "Flexible scheduling", "Video or clinic visit", "Instant confirmation"]
    },
    {
      step: 4,
      title: "Payment & Confirmation",
      description: "Secure payment processing",
      icon: CreditCard,
      features: ["USD/KHR accepted", "Card payments", "Insurance support", "Receipt provided"]
    }
  ];

  const consultationTypes = [
    {
      title: "Video Consultation",
      description: "Perfect for consultations, follow-ups, and dental advice",
      icon: Video,
      price: "From $25",
      benefits: ["No travel required", "Flexible scheduling", "Same-day availability", "Prescription support"],
      popular: true
    },
    {
      title: "Clinic Visit",
      description: "In-person treatment for procedures and examinations",
      icon: Building,
      price: "From $35",
      benefits: ["Hands-on examination", "Full treatment options", "Advanced equipment", "Immediate care"],
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Booking Steps */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-dark-gray mb-4">Simple Booking Process</h3>
            <p className="text-medium-gray text-lg">Get dental care in 4 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <Card key={step.step} className="hover:shadow-lg transition-shadow relative">
                <CardContent className="p-6 text-center">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-medical-blue rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-medical-blue" />
                    </div>
                    <h4 className="font-semibold text-dark-gray mb-2">{step.title}</h4>
                    <p className="text-sm text-medium-gray mb-4">{step.description}</p>
                    
                    <ul className="space-y-2 text-xs text-medium-gray">
                      {step.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-success-green mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Consultation Types */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-dark-gray mb-4">Choose Your Consultation Type</h3>
            <p className="text-medium-gray text-lg">Flexible options to meet your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {consultationTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow relative">
                {type.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-medical-blue text-white">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="bg-medical-blue rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <type.icon className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-dark-gray mb-2">{type.title}</h4>
                    <p className="text-medium-gray mb-4">{type.description}</p>
                    <div className="text-2xl font-bold text-medical-blue">{type.price}</div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {type.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-success-green mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-medium-gray">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-medical-blue hover:bg-medical-blue-dark">
                    Book {type.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Care Notice */}
        <div className="mt-16">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800">Emergency Dental Care</h4>
                    <p className="text-red-600 text-sm">Available 24/7 for urgent dental problems</p>
                  </div>
                </div>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  Emergency Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}