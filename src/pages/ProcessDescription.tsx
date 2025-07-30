import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HamburgerMenu from "@/components/HamburgerMenu";

const ProcessDescription = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white h-screen flex flex-col">
      {/* Header with Hamburger Menu */}
      <div className="flex justify-end items-center pt-2 pr-2">
        <HamburgerMenu />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-2 md:py-0 md:px-0 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="text-center md:mb-4">
            <img
              src="/logo.png"
              alt="TP Awards Logo"
              className="mx-auto mb-1 md:mb-2 w-[8rem] h-[8rem] md:w-[12rem] md:h-[12rem] object-contain"
            />
          </div>

          {/* Steps */}
          <div className="space-y-2 md:space-y-6 text-center text-sm md:text-md">
            <h1 className="text-lg md:text-xl font-semibold text-red-600 mb-4">
              Give us your 15 favourite restaurants
            </h1>

            <div>
              <h2 className="text-base md:text-lg font-semibold text-blue-600 mb-1 md:mb-2">Step 1</h2>
              <p className="text-gray-700 leading-snug">
                Choose 10 favourite restaurants from your region.
              </p>
            </div>

            <div>
              <h2 className="text-base md:text-lg font-semibold text-blue-600 mb-1 md:mb-2">Step 2</h2>
              <p className="text-gray-700 leading-snug mb-2">
                Pick 5 more restaurants. Here is your chance to nominate
                restaurants from outside your region. Alternatively, you
                can include more from your region.
              </p>
              {/* <p className="text-gray-700 leading-snug">
                If there's a restaurant that's not in our list you can add it
                manually through the "Add a Restaurant" button.
              </p> */}
            </div>

            <div>
              <h2 className="text-base md:text-lg font-semibold text-blue-600 mb-1 md:mb-2">Step 3</h2>
              <p className="text-gray-700 leading-snug mb-4 md:mb-6">
                Once your list of 15 is ready, proceed to the final stage to
                rate these for Food, Service and Ambience.
              </p>

              <Button
                onClick={() => navigate("/regions")}
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
