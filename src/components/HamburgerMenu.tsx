import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleTermsClick = () => {
    navigate("/terms");
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <Button
        variant="ghost"
      
        onClick={toggleMenu}
        className="right-4 md:top-6 md:right-6 w-8 h-8 text-lg "
      >
        {isOpen ? <X className="w-full h-full" /> : <Menu className="w-full h-full" />} 

      </Button>

      {/* Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={toggleMenu}
          />
          
          {/* Menu Content */}
          <div className="absolute top-10 right-4 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[200px] py-2">
            <div className="px-4 py-2 border-b border-gray-600">
              <h3 className="text-sm font-medium text-gray-900">Menu</h3>
            </div>
            
            <div className="py-1">
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50"
              >
                <a
                  href="https://www.cntraveller.in/info/terms-and-conditions-tra-2025-applicant/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full h-full"
                  onClick={() => setIsOpen(false)}
                >
                  <FileText size={16} className="mr-3" />
                  Terms & Conditions
                </a>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu; 