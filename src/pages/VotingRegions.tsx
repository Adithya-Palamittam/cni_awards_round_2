import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext"; // ✅ Import your custom hook
import { Button } from "@/components/ui/button";
import HamburgerMenu from "@/components/HamburgerMenu";

const VotingRegions = () => {
  const navigate = useNavigate();
  const { user, userData } = useUser(); // ✅ Use context for user and userData

return (
  <div className="min-h-screen bg-white flex flex-col">
    {/* Header with Hamburger Menu */}
    <div className="flex justify-end items-center pt-2 pr-2">
      <HamburgerMenu />
    </div>

    {/* Main Content */}
    <div className="flex-grow flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-xl md:text-2xl text-blue-600 font-semibold mb-4">You are voting for</h1>

        {/* Region Display Text and Image
        {userData?.region_display_text && (
          <h2 className="text-lg md:text-xl font-bold mb-2">{userData.region_display_text}</h2>
        )} */}
        {/* {userData?.region_image && (
          <div className="flex justify-center mb-4">
            <img
              src={`/${userData.region_image?.toLowerCase()}.jpg`}
              alt={userData.region_display_text || "Region"}
              className="mx-auto mb-2 w-[10rem] h-[10rem] md:w-[16rem] md:h-[16rem] object-contain rounded"
            />
          </div>
        )} */}

        <p className="text-lg md:text-lg mb-1 mb-8 md:mb-6 md:mx-0 mx-4">
          {userData.region_display_text}

          {/* Restaurants in the cities:&nbsp;
          {userData?.cities?.map((c: any) => c.city_name).join(", ") || "Loading..."} */}
        </p>

        {/* <p className="text-sm md:text-lg mb-6">
          You will also have a chance to<br />
          nominate 5 restaurants from anywhere<br />
          in the country
        </p> */}
<div className="flex flex-col items-center mb-6 gap-y-8">
  <div className="relative">
    {/* <img src="/map.png" alt="TP Awards Logo" className="mx-auto mb-4 w-[14rem] h-[14rem] md:w-[22rem] md:h-[22rem] object-contain" /> */}
    <img
      src={`/${userData.region_image?.toLowerCase()}.jpg`}
      alt={userData.region_display_text || "Region"}
      className="mx-auto w-[12rem] h-[12rem] md:w-[16rem] md:h-[16rem] object-contain rounded"
    />
  </div>
  <div className="text-center text-xs md:text-sm text-gray-600">
    This map is for representative purpose only
  </div>
</div>



        <Button
          onClick={() => navigate("/regional-selection")}
          className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800 text-md"
        >
          Let's Go
        </Button>
      </div>
    </div>

    {/* Footer */}
    <footer className="bg-black text-white text-center py-2 text-xs md:fixed md:bottom-0 md:left-0 md:right-0 ">
      <p>© 2025 Condé Nast India</p>
    </footer>
  </div>
);

};

export default VotingRegions;
