import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smile, Zap, Wrench, Heart, Shield, Sparkles, Camera, Stethoscope } from "lucide-react";

export default function ServicesGrid() {
  const services = [
    {
      icon: Smile,
      title: "General Dentistry",
      description: "Comprehensive oral health care including cleanings, fillings, and checkups",
      features: ["Regular Checkups", "Dental Cleaning", "Fillings", "Oral Exams"],
      price: "From $25",
      popular: true
    },
    {
      icon: Sparkles,
      title: "Cosmetic Dentistry",
      description: "Enhance your smile with veneers, whitening, and cosmetic procedures",
      features: ["Teeth Whitening", "Veneers", "Bonding", "Smile Makeover"],
      price: "From $150",
      popular: false
    },
    {
      icon: Wrench,
      title: "Orthodontics",
      description: "Straighten your teeth with modern braces and Invisalign treatments",
      features: ["Traditional Braces", "Invisalign", "Retainers", "Bite Correction"],
      price: "From $800",
      popular: false
    },
    {
      icon: Zap,
      title: "Emergency Care",
      description: "Urgent dental care for pain relief and emergency treatments",
      features: ["24/7 Support", "Pain Relief", "Emergency Extractions", "Trauma Care"],
      price: "From $50",
      popular: false
    },
    {
      icon: Heart,
      title: "Pediatric Dentistry",
      description: "Specialized dental care for children and teenagers",
      features: ["Child-Friendly Care", "Fluoride Treatments", "Sealants", "Education"],
      price: "From $30",
      popular: false
    },
    {
      icon: Shield,
      title: "Oral Surgery",
      description: "Surgical procedures including extractions and implants",
      features: ["Wisdom Teeth", "Extractions", "Implant Surgery", "Bone Grafting"],
      price: "From $200",
      popular: false
    },
    {
      icon: Camera,
      title: "Dental Implants",
      description: "Replace missing teeth with permanent implant solutions",
      features: ["Single Implants", "Multiple Implants", "All-on-4", "Bone Grafting"],
      price: "From $500",
      popular: true
    },
    {
      icon: Stethoscope,
      title: "Periodontics",
      description: "Specialized treatment for gum disease and periodontal health",
      features: ["Gum Treatment", "Deep Cleaning", "Scaling", "Root Planing"],
      price: "From $100",
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-dark-gray mb-4">Our Dental Services</h3>
          <p className="text-medium-gray text-lg">Comprehensive dental care for all your oral health needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow relative">
              {service.popular && (
                <Badge className="absolute -top-2 -right-2 bg-medical-blue text-white">
                  Popular
                </Badge>
              )}
              <CardContent className="p-6">
                <div className="bg-medical-blue rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-dark-gray mb-2">{service.title}</h4>
                <p className="text-sm text-medium-gray mb-4">{service.description}</p>
                
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="text-medical-blue mr-2">•</span>
                      <span className="text-xs text-medium-gray">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-dark-gray">{service.price}</span>
                    <Button size="sm" className="bg-medical-blue hover:bg-medical-blue-dark">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-medical-blue hover:bg-medical-blue-dark mr-4">
            View All Services
          </Button>
          <Button variant="outline">
            Download Price List
          </Button>
        </div>
      </div>
    </section>
  );
}