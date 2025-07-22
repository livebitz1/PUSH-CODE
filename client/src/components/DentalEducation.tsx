import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Heart, Shield, Sparkles } from "lucide-react";

export default function DentalEducation() {
  const educationContent = [
    {
      icon: Heart,
      title: "Preventive Care",
      description: "Regular checkups and cleanings prevent serious dental issues",
      tips: ["Brush twice daily", "Floss regularly", "Use fluoride toothpaste", "Visit dentist every 6 months"],
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Shield,
      title: "Gum Health",
      description: "Healthy gums are foundation of good oral health",
      tips: ["Watch for bleeding gums", "Avoid tobacco", "Eat vitamin C foods", "Use antibacterial mouthwash"],
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Sparkles,
      title: "Teeth Whitening",
      description: "Safe whitening options for a brighter smile",
      tips: ["Professional treatments", "Avoid staining foods", "Use whitening toothpaste", "Regular cleaning"],
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: BookOpen,
      title: "Dental Tourism",
      description: "Guide for international visitors to Santepheap",
      tips: ["Research dentist credentials", "Plan multiple visits", "Understand costs", "Check insurance coverage"],
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-dark-gray mb-4">Dental Health Education</h3>
          <p className="text-medium-gray text-lg">Expert advice for maintaining optimal oral health</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {educationContent.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6">
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-dark-gray mb-2">{item.title}</h4>
                <p className="text-sm text-medium-gray mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start">
                      <span className="text-medical-blue mr-2">•</span>
                      <span className="text-xs text-medium-gray">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-medical-blue hover:bg-medical-blue-dark">
            View All Health Tips
          </Button>
        </div>
      </div>
    </section>
  );
}