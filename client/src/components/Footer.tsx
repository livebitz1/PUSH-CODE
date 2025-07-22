import { Facebook, Twitter, Instagram } from "lucide-react";
import logoPath from "@assets/Logo png_1752749850863.png";

export default function Footer() {
  return (
    <footer className="bg-dark-gray text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src={logoPath} 
                alt="Santepheap Dental Clinic" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-4">ISO 9001:2015 Certified dental clinic providing world-class dental care with professional multilingual support.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Patients</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Find Dentists</a></li>
              <li><a href="#" className="hover:text-white">Book Appointment</a></li>
              <li><a href="#" className="hover:text-white">Video Consultation</a></li>
              <li><a href="#" className="hover:text-white">My Appointments</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Dentists</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Join Santepheap</a></li>
              <li><a href="#" className="hover:text-white">Manage Profile</a></li>
              <li><a href="#" className="hover:text-white">Schedule Management</a></li>
              <li><a href="#" className="hover:text-white">Patient Reviews</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Santepheap Dental Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}