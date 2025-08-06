import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HamburgerMenu from "@/components/HamburgerMenu";

const ProcessDescription = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="pt-2 pr-2 flex justify-end items-center">
        <HamburgerMenu />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 pb-6">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="text-center md:mb-4 mb-4">
            <img
              src="/logo.png"
              alt="TP Awards Logo"
              className="mx-auto mb-1 md:mb-2 w-[8rem] h-[8rem] md:w-[12rem] md:h-[12rem] object-contain"
            />
          </div>

          {/* Steps */}
          <div className="space-y-6 text-center text-sm md:text-md">
            <h1 className="text-xl md:text-xl font-semibold text-red-600 mb-4">
              These are India’s Top 100. Now select your favourites
            </h1>

            <div>
              <h2 className="text-lg md:text-lg font-semibold text-blue-600 mb-1">
                Step 1
              </h2>
              <p className="text-gray-700 text-[clamp(1rem,1.05rem,1.125rem)] md:text-md leading-snug">
                The top 100 restaurants have been chosen based on ratings by 80 jury members from across 10 regions of India. 
                Please scroll down the list–your city and beyond–and select your favourite 15.
              </p>
            </div>

            <div>
              <h2 className="text-lg md:text-lg font-semibold text-blue-600 mb-1">
                Step 2
              </h2>
              <p className="text-gray-700 text-[clamp(1rem,1.05rem,1.125rem)] md:text-md leading-snug mb-2">
               Once your list of 15 is ready, proceed to the final stage to rate these for Food, Service and Ambience.
              </p>
            </div>

            <div className="pb-10 md:pb-0">
              <Button
                onClick={() => navigate("/national-selection")}
                className="bg-black text-white text-md px-6 md:py-2 rounded hover:bg-gray-800"
              >
                Proceed
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-2 text-xs">
        <p>© 2025 Condé Nast India</p>
      </footer>
    </div>
  );
};

export default ProcessDescription;
