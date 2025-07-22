import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Package, MapPin, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ShippingOption {
  id: string;
  name: string;
  provider: string;
  price: number;
  estimatedDays: string;
  description: string;
  icon: React.ReactNode;
}

interface ShippingCalculatorProps {
  cartTotal: number;
  onShippingSelect: (option: ShippingOption) => void;
}

export default function ShippingCalculator({ cartTotal, onShippingSelect }: ShippingCalculatorProps) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const cambodianCities = [
    { value: "phnom_penh", label: "Phnom Penh" },
    { value: "siem_reap", label: "Siem Reap" },
    { value: "battambang", label: "Battambang" },
    { value: "sihanoukville", label: "Sihanoukville" },
    { value: "kampong_cham", label: "Kampong Cham" },
    { value: "kampot", label: "Kampot" },
    { value: "kep", label: "Kep" },
    { value: "other", label: "Other" },
  ];

  const countries = [
    { value: "cambodia", label: "Cambodia" },
    { value: "thailand", label: "Thailand" },
    { value: "vietnam", label: "Vietnam" },
    { value: "singapore", label: "Singapore" },
    { value: "malaysia", label: "Malaysia" },
    { value: "usa", label: "United States" },
    { value: "australia", label: "Australia" },
    { value: "uk", label: "United Kingdom" },
  ];

  const calculateShipping = () => {
    setIsCalculating(true);
    
    // Simulate API call to shipping providers
    setTimeout(() => {
      const options: ShippingOption[] = [];
      
      if (selectedCountry === "cambodia") {
        // Local delivery options
        options.push({
          id: "local_express",
          name: "Express Delivery",
          provider: "Cambodia Post",
          price: 3.99,
          estimatedDays: "1-2",
          description: "Same day delivery in Phnom Penh, next day for other cities",
          icon: <Truck className="h-4 w-4" />,
        });
        
        options.push({
          id: "local_standard",
          name: "Standard Delivery",
          provider: "Cambodia Post",
          price: 1.99,
          estimatedDays: "2-3",
          description: "Regular delivery service",
          icon: <Package className="h-4 w-4" />,
        });
        
        if (cartTotal > 50) {
          options.push({
            id: "local_free",
            name: "Free Delivery",
            provider: "Cambodia Post",
            price: 0,
            estimatedDays: "2-4",
            description: "Free delivery for orders over $50",
            icon: <Package className="h-4 w-4" />,
          });
        }
      } else {
        // International shipping
        options.push({
          id: "dhl_express",
          name: "DHL Express",
          provider: "DHL",
          price: 29.99,
          estimatedDays: "3-5",
          description: "Fast international delivery with tracking",
          icon: <Truck className="h-4 w-4" />,
        });
        
        options.push({
          id: "fedex_international",
          name: "FedEx International",
          provider: "FedEx",
          price: 24.99,
          estimatedDays: "5-7",
          description: "Reliable international shipping",
          icon: <Truck className="h-4 w-4" />,
        });
        
        options.push({
          id: "ups_worldwide",
          name: "UPS Worldwide",
          provider: "UPS",
          price: 22.99,
          estimatedDays: "7-10",
          description: "Economy international shipping",
          icon: <Package className="h-4 w-4" />,
        });
      }
      
      setShippingOptions(options);
      setIsCalculating(false);
    }, 2000);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Shipping Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            {selectedCountry === "cambodia" ? (
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cambodianCities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Enter city name"
              />
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="postal">Postal Code</Label>
          <Input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Enter postal code"
          />
        </div>
        
        <Button 
          onClick={calculateShipping}
          disabled={!selectedCountry || !selectedCity || isCalculating}
          className="w-full mb-4"
        >
          {isCalculating ? "Calculating..." : "Calculate Shipping"}
        </Button>
        
        {shippingOptions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-dark-gray">Available Shipping Options:</h4>
            {shippingOptions.map((option) => (
              <div
                key={option.id}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onShippingSelect(option)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {option.icon}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.name}</span>
                        <Badge variant="outline">{option.provider}</Badge>
                      </div>
                      <p className="text-sm text-medium-gray">{option.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {option.price === 0 ? "Free" : `$${option.price}`}
                    </div>
                    <div className="text-sm text-medium-gray">
                      {option.estimatedDays} business days
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedCountry && cartTotal > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-medical-blue">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">
                Shipping to {countries.find(c => c.value === selectedCountry)?.label}
              </span>
            </div>
            {selectedCountry === "cambodia" && cartTotal > 50 && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Eligible for free shipping!
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}