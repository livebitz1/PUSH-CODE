import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function PatientTestimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const testimonials = [
    {
      name: "Sarah Mitchell",
      location: "Expat from UK, Phnom Penh",
      rating: 5,
      treatment: "Dental Implants",
      image: "https://images.unsplash.com/photo-1494790108755-2616b67d70b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      testimonial: "Excellent service! The staff spoke perfect English and made me feel comfortable throughout my implant procedure. Much more affordable than back home with the same quality.",
      dentist: "Dr. Sarah Johnson"
    },
    {
      name: "Kosal Phan",
      location: "Local resident, Siem Reap",
      rating: 5,
      treatment: "Orthodontics",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      testimonial: "ពេទ្យធ្មេញល្អបំផុត! ការផ្តល់សេវាកម្មគុណភាពខ្ពស់ និងមានការយកចិត្តទុកដាក់ចំពោះអ្នកជំងឺ។ ខ្ញុំបានទទួលការព្យាបាលដ៏ល្អ។",
      dentist: "Dr. Michael Chen"
    },
    {
      name: "David Thompson",
      location: "Australian Tourist, Battambang",
      rating: 4,
      treatment: "Emergency Care",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      testimonial: "Had a dental emergency during my holiday. Dr. Wilson was available same day and fixed my problem quickly. Great communication and fair pricing for tourists.",
      dentist: "Dr. James Wilson"
    },
    {
      name: "Lisa Chen",
      location: "Expat from Singapore, Phnom Penh",
      rating: 5,
      treatment: "Cosmetic Dentistry",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      testimonial: "Amazing smile makeover! Dr. Davis understood exactly what I wanted. Santepheap clinic is modern and clean, staff is professional. Highly recommend for expats.",
      dentist: "Dr. Amanda Davis"
    },
    {
      name: "Pierre Dubois",
      location: "French Expat, Sihanoukville",
      rating: 5,
      treatment: "General Dentistry",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      testimonial: "Excellent dental care by the coast! Dr. Martinez speaks good English and French. The prices are very reasonable compared to Europe. Regular checkups made easy.",
      dentist: "Dr. David Martinez"
    },
    {
      name: "Sophea Lim",
      location: "Local resident, Phnom Penh",
      rating: 4,
      treatment: "Pediatric Care",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      testimonial: "កូនរបស់ខ្ញុំចូលចិត្តទៅពេទ្យធ្មេញនេះ។ ពេទ្យមានបទពិសោធខ្ពស់ក្នុងការព្យាបាលកុមារ។ តម្លៃសមរម្យ និងគុណភាពល្អ។",
      dentist: "Dr. James Wilson"
    }
  ];

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlay, currentSlide]);

  const getCurrentSlideTestimonials = () => {
    const start = currentSlide * itemsPerSlide;
    return testimonials.slice(start, start + itemsPerSlide);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-dark-gray mb-4">What Our Patients Say</h3>
          <p className="text-medium-gray text-lg">Real testimonials from locals, expats, and international visitors</p>
        </div>

        <div className="relative">
          {/* Slider Container */}
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentSlideTestimonials().map((testimonial, index) => (
                <Card key={`${currentSlide}-${index}`} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-dark-gray">{testimonial.name}</h4>
                        <p className="text-sm text-medium-gray">{testimonial.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400 mr-2">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.treatment}
                      </Badge>
                    </div>

                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-medical-blue opacity-20" />
                      <p className="text-medium-gray text-sm italic leading-relaxed mb-4 pl-6">
                        {testimonial.testimonial}
                      </p>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-xs text-medium-gray">
                        Treated by <span className="font-semibold text-medical-blue">{testimonial.dentist}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 z-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-medical-blue' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-medium-gray mb-4">Join thousands of satisfied patients across Cambodia</p>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-medical-blue">15,000+</div>
              <div className="text-sm text-medium-gray">Patients Treated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-medical-blue">4.8/5</div>
              <div className="text-sm text-medium-gray">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-medical-blue">95%</div>
              <div className="text-sm text-medium-gray">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}