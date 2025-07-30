import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RestaurantList from "@/components/RestaurantList";
import SelectedRestaurantsList from "@/components/SelectedRestaurantsList";
import AddRestaurantDialog from "@/components/AddRestaurantDialog";
import RestaurantSearchFilter from "@/components/RestaurantSearchFilter";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabaseClient";
import RestaurantSearchFilterPhone from "@/components/RestaurantSearchFilterPhone";
import RestaurantListPhone from "@/components/RestaurantListPhone";
import { toast } from "sonner";
import HamburgerMenu from "@/components/HamburgerMenu";
import AddRestaurantDialogPhone from "@/components/AddRestaurantDialogPhone";
import SelectedRestaurantListPhone from "@/components/SelectedRestaurantListPhone";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

const RegionalSelection = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const regionId = userData?.assigned_region;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    if (!regionId) return;
  
    const fetchAllRegionRestaurants = async (): Promise<any[]> => {
      const pageSize = 1000;
      let from = 0;
      let allData: any[] = [];
      let done = false;
  
      while (!done) {
        const { data, error } = await supabase
          .from("restaurants_table")
          .select("*")
          .eq("region_id", regionId)
          .or("created_by_jury.is.null,created_by_jury.eq.false")
          .range(from, from + pageSize - 1);
  
        if (error) {
          console.error("Error fetching region restaurants batch:", error.message);
          break;
        }
  
        if (data) {
          allData = allData.concat(data);
          if (data.length < pageSize) {
            done = true; // last batch
          } else {
            from += pageSize;
          }
        } else {
          done = true;
        }
      }
  
      return allData;
    };
  
    const fetchRestaurants = async () => {
      const allRestaurants = await fetchAllRegionRestaurants();
      console.log("Fetched regional restaurants:", allRestaurants.length);
  
      const mapped: Restaurant[] = allRestaurants.map(r => ({
        id: r.restaurant_id,
        name: r.restaurant_name,
        city: r.city_name,
      }));
  
      setRestaurants(mapped);
    };
  
    fetchRestaurants();
  }, [regionId]);
  

useEffect(() => {
  const fetchUserSelection = async () => {
    if (!userData?.uid || restaurants.length === 0) return;

    const { data, error } = await supabase
      .from("user_selection_table")
      .select("selected_regional_restaurants")
      .eq("user_id", userData.uid)
      .single();

    if (error) {
      console.error("Error fetching user selection:", error.message);
      return;
    }

    const selected = data?.selected_regional_restaurants || [];
    setSelectedRestaurants(selected); // safe because selected is full JSON
    setHasInitialized(true); // ✅ enable DB updates only after initial load
  };

  fetchUserSelection();
}, [userData?.uid, restaurants]);


// useEffect(() => {
//   const saveSelection = async () => {
//     if (!userData?.uid || !hasInitialized) return;

//     const { error } = await supabase
//       .from("user_selection_table")
//       .upsert({
//         user_id: userData.uid,
//         selected_regional_restaurants: selectedRestaurants,
//         updated_at: new Date().toISOString(),
//       });

//     if (error) {
//       console.error("Error saving selection:", error.message);
//     }
//   };

//   saveSelection();
// }, [selectedRestaurants]);


  const cities = [...new Set(restaurants.map(r => r.city))].sort();

// Helper function to normalize strings: remove accents and lowercase
  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredRestaurants = restaurants.filter(restaurant => {
    const normalizedSearch = normalize(searchTerm);
    const normalizedName = normalize(restaurant.name);
    const normalizedCity = normalize(restaurant.city);
    const normalizedSelectedCity = normalize(selectedCity);

    const matchesCity = selectedCity ? normalizedCity === normalizedSelectedCity : false;
    const matchesSearch = normalizedSearch ? normalizedName.includes(normalizedSearch) : true;

    return (selectedCity && matchesCity && matchesSearch) || (searchTerm && matchesSearch);
  });


const handleRestaurantToggle = async (restaurant: Restaurant) => {
  const isSelected = selectedRestaurants.some(r => r.id === restaurant.id);
  let updatedList: Restaurant[];

  if (isSelected) {
    updatedList = selectedRestaurants.filter(r => r.id !== restaurant.id);
  } else {
    if (selectedRestaurants.length >= 10) return;
    updatedList = [...selectedRestaurants, restaurant];
  }

  setSelectedRestaurants(updatedList);

  const { error } = await supabase
    .from("user_selection_table")
    .upsert({
      user_id: userData.uid,
      selected_regional_restaurants: updatedList,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error saving selection after toggle:", error.message);
  }
};


const removeRestaurant = async (restaurantId: string) => {
  const updatedList = selectedRestaurants.filter(r => r.id !== restaurantId);
  setSelectedRestaurants(updatedList);

  const { error } = await supabase
    .from("user_selection_table")
    .upsert({
      user_id: userData.uid,
      selected_regional_restaurants: updatedList,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error saving after removal:", error.message);
  }

  // Optional: You may re-fetch if needed for consistency
  // But keeping it local is faster unless strict consistency is critical
};


const addCustomRestaurant = async (restaurant: Restaurant) => {
  if (!regionId || !hasInitialized) {
    alert("Please wait until data is loaded before adding a restaurant.");
    return;
  }

  try {
    const { data: cityMatch, error: cityError } = await supabase
      .from("cities_table")
      .select("city_id")
      .eq("city_name", restaurant.city)
      .single();

    // If city is not found, use null for city_id
    const city_id = (cityError || !cityMatch) ? null : cityMatch.city_id;

    const { data: existing, error: fetchError } = await supabase
      .from("restaurants_table")
      .select("restaurant_id")
      .eq("restaurant_name", restaurant.name)
      .eq("city_name", restaurant.city)
      .eq("region_id", regionId)
      .or("created_by_jury.is.null,created_by_jury.eq.false");

    if (fetchError) {
      alert("Something went wrong. Please try again.");
      return;
    }

    if (existing && existing.length > 0) {
      alert("This restaurant is already on our list. Use the search bar to select and add.");
      return;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("restaurants_table")
      .insert([
        {
          restaurant_name: restaurant.name,
          city_name: restaurant.city,
          city_id: city_id,
          region_id: regionId,
          created_by_jury: true,
        },
      ])
      .select()
      .single();

    if (insertError || !inserted) {
      alert("Failed to add restaurant.");
      return;
    }

    const newRestaurant: Restaurant = {
      id: inserted.restaurant_id,
      name: inserted.restaurant_name,
      city: inserted.city_name,
    };

    if (selectedRestaurants.length < 10) {
      const updatedList = [...selectedRestaurants, newRestaurant];
      setSelectedRestaurants(updatedList);

      const { error } = await supabase
        .from("user_selection_table")
        .upsert({
          user_id: userData.uid,
          selected_regional_restaurants: updatedList,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Error saving after adding custom restaurant:", error.message);
      }
    }

    // setRestaurants(prev => [...prev, newRestaurant]);

    setSuccessDialogOpen(true);
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An error occurred while adding the restaurant.");
  }
};



  const canProceed = selectedRestaurants.length === 10;

  const handleProceed = () => {
    navigate("/national-selection");
  };

return (
  <div className="h-screen flex flex-col bg-white">
    {/* Main Content Wrapper */}
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      
      {/* Inner Content Section */}
      <div className="flex-1 flex flex-col overflow-hidden px-4 pt-2 md:p-6 md:h-[calc(100vh-48px)]">
        <div className="flex justify-between items-center">
        <h2 className="text-sm md:text-xl md:font-semibold  mb-1 text-left pr-10">Choose 10 restaurants from your region</h2>
        <HamburgerMenu />  
        </div>
        <hr className="border-t border-gray-300 mb-2 md:mb-4" />
        

        {/* ---------- Mobile Layout ---------- */}
        <div className="block md:hidden flex-1 grid grid-rows-[10%_35%_3%_5%_auto] gap-2 min-h-0">
          {/* Search + Filter */}
          <div className="row-span-1 min-h-0">
            <RestaurantSearchFilterPhone
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              cities={cities}
            />
          </div>

          {/* Restaurant List */}
          <div className="row-span-1 min-h-0 border border-gray-300 rounded-lg overflow-hidden bg-gray-300 ">
            <RestaurantListPhone
              restaurants={filteredRestaurants}
              selectedRestaurants={selectedRestaurants}
              onRestaurantToggle={handleRestaurantToggle}
              maxSelections={10}
            />
          </div>

          {/* Add Custom Restaurant */}
          <p className="row-span-1 min-h-0 text-center text-sm">Want to add a restaurant that is not on this list?</p>
          <div className="row-span-1 min-h-0">
            <AddRestaurantDialogPhone 
              cities={cities}
              selectedRestaurants={selectedRestaurants}
              onAddRestaurant={addCustomRestaurant}
              maxSelections={10}
            />
          </div>

          {/* Selected Restaurants Display + Done Button */}
          <div className="row-span-1 min-h-0 flex flex-col -mx-4 bg-gray-300">
            <div className="text-sm text-center py-1 shrink-0">Your Selection</div>
            <div className="flex-1 min-h-0">
              <SelectedRestaurantListPhone
                selectedRestaurants={selectedRestaurants}
                onRemoveRestaurant={removeRestaurant}
                maxSelections={10}
              />
            </div>
            <div className="shrink-0 flex items-center justify-center mt-2 px-4 pb-2">
              <Button
                onClick={handleProceed}
                disabled={!canProceed}
                className="bg-black text-xs h-6 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Done
              </Button>
            </div>
          </div>
        </div>

        {/* ---------- Desktop Layout ---------- */}
        <div className="hidden md:flex gap-6 flex-1 overflow-hidden">
          {/* Left Column */}
          <div className="w-[60%] border border-gray-300 rounded-lg p-4 flex flex-col overflow-hidden">
            <RestaurantSearchFilter
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              cities={cities}
            />
            <div className="flex-1 overflow-hidden">
              <RestaurantList
                restaurants={filteredRestaurants}
                selectedRestaurants={selectedRestaurants}
                onRestaurantToggle={handleRestaurantToggle}
                maxSelections={10}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-[40%] flex flex-col gap-1">
            <AddRestaurantDialog
              cities={cities}
              selectedRestaurants={selectedRestaurants}
              onAddRestaurant={addCustomRestaurant}
              maxSelections={10}
            />
            <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg">
              <SelectedRestaurantsList
                selectedRestaurants={selectedRestaurants}
                onRemoveRestaurant={removeRestaurant}
                maxSelections={10}
              />
            </div>
          </div>
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:flex justify-between items-center mt-6 text-md">
          <Button
            variant="outline"
            onClick={() => navigate("/process")}
            className="flex items-center gap-2"
          >
            Back to Home
          </Button>

          <Button
            onClick={handleProceed}
            disabled={!canProceed}
            className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Done
          </Button>
        </div>
      </div>
    </div>

    {/* Success Dialog */}
    <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
      <DialogContent className="max-w-md w-[90%] flex flex-col items-center justify-center text-center gap-2 py-4">
        <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto" />
        <div className="text-lg font-semibold">Restaurant added successfully!</div>
        <button
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
          onClick={() => setSuccessDialogOpen(false)}
        >
          Ok
        </button>
      </DialogContent>
    </Dialog>

    {/* Footer - Fixed on Desktop Only */}
    <footer className="bg-black text-white text-center py-2 md:text-xs text-2xs md:fixed md:bottom-0 md:left-0 md:right-0">
      <p>© 2025 Condé Nast India</p>
    </footer>
  </div>
);

};

export default RegionalSelection;
