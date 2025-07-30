import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RestaurantList from "@/components/RestaurantList";
import SelectedRestaurantsList from "@/components/SelectedRestaurantsList";
import AddRestaurantDialog from "@/components/AddRestaurantDialog";
import RestaurantSearchFilter from "@/components/RestaurantSearchFilter";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/contexts/UserContext"; // Ensure this is correctly implemented
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

const NationalSelection = () => {
  const navigate = useNavigate();
  const { userData } = useUser(); // Make sure userData.uid is available
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([]);
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [restaurantsLoaded, setRestaurantsLoaded] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);


  // Fetch restaurant list and excluded (regional) selections
useEffect(() => {
// Fetch all restaurants in batches (pagination)
const fetchAllRestaurants = async (): Promise<any[]> => {
  const pageSize = 1000;
  let from = 0;
  let allData: any[] = [];
  let done = false;

  while (!done) {
    const { data, error } = await supabase
      .from("restaurants_table")
      .select("*")
      .or("created_by_jury.is.null,created_by_jury.eq.false")
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Error fetching restaurants batch:", error.message);
      break;
    }

    if (data) {
      allData = allData.concat(data);
      if (data.length < pageSize) {
        done = true; // last page
      } else {
        from += pageSize;
      }
    } else {
      done = true;
    }
  }

  return allData;
};

const fetchData = async () => {
  if (!userData?.uid) return;

  // Step 1: Fetch regional selection to exclude
  const { data: userSelection, error: selectionError } = await supabase
    .from("user_selection_table")
    .select("selected_regional_restaurants")
    .eq("user_id", userData.uid)
    .single();

  if (selectionError) {
    console.error("Error fetching regional selections:", selectionError.message);
    return;
  }

  const excluded = userSelection?.selected_regional_restaurants?.map((r: Restaurant) => r.id) || [];
  setExcludedIds(excluded);

  // Step 2: Fetch all restaurants in batches
  const allRestaurants = await fetchAllRestaurants();

  // Step 3: Map and filter
  const mapped: Restaurant[] = allRestaurants
    .map(r => ({
      id: r.restaurant_id,
      name: r.restaurant_name,
      city: r.city_name,
    }))
    .filter(r => !excluded.includes(r.id));

  // Final state set
  setRestaurants(mapped);
  setRestaurantsLoaded(true);
};


  fetchData();
}, [userData?.uid]);


  // Load national selection from Supabase
useEffect(() => {
  const fetchNationalSelection = async () => {
    if (!userData?.uid || !restaurantsLoaded) return;

    const { data, error } = await supabase
      .from("user_selection_table")
      .select("selected_national_restaurants")
      .eq("user_id", userData.uid)
      .single();

    if (error) {
      console.error("Error fetching national selection:", error.message);
      return;
    }

    const selected = data?.selected_national_restaurants || [];
    setSelectedRestaurants(selected);
  };

  fetchNationalSelection();
}, [userData?.uid, restaurantsLoaded]); // ✅ Now it waits for both


  // Sync changes to Supabase
  useEffect(() => {
    const updateSelection = async () => {
      if (!userData?.uid || !restaurantsLoaded) return;
      const { error } = await supabase
        .from("user_selection_table")
        .upsert(
          {
            user_id: userData.uid,
            selected_national_restaurants: selectedRestaurants,
          },
          { onConflict: "user_id" }
        );
      if (error) {
        console.error("Error updating national selection:", error.message);
      }
    };

    updateSelection();
  }, [selectedRestaurants, userData?.uid]);

  const cities = [...new Set(restaurants.map(r => r.city))].sort();

// Helper to normalize and remove accents/special characters
  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredRestaurants = restaurants.filter(restaurant => {
    const normalizedSearch = normalize(searchTerm);
    const normalizedName = normalize(restaurant.name);
    const normalizedCity = normalize(restaurant.city);

    const matchesCity = selectedCity ? normalizedCity === normalize(selectedCity) : false;
    const matchesSearch = normalizedSearch ? normalizedName.includes(normalizedSearch) : true;

    return (selectedCity && matchesCity && matchesSearch) || (searchTerm && matchesSearch);
  });


  const handleRestaurantToggle = (restaurant: Restaurant) => {
    const isSelected = selectedRestaurants.some(r => r.id === restaurant.id);
    if (isSelected) {
      setSelectedRestaurants(prev => prev.filter(r => r.id !== restaurant.id));
    } else if (selectedRestaurants.length < 5) {
      setSelectedRestaurants(prev => [...prev, restaurant]);
    }
  };

  const removeRestaurant = (restaurantId: string) => {
    setSelectedRestaurants(prev => prev.filter(r => r.id !== restaurantId));
  };

  const addCustomRestaurant = async (restaurant: Restaurant) => {
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
        .or("created_by_jury.is.null,created_by_jury.eq.false");

      if (fetchError || (existing && existing.length > 0)) {
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

      setSelectedRestaurants(prev => [...prev, newRestaurant]);
      setSuccessDialogOpen(true);
    } catch (err) {
      alert("An error occurred while adding the restaurant.");
    }
  };

  const canProceed = selectedRestaurants.length === 5;

  const handleProceed = () => {
    navigate("/restaurant-review");
  };

  return (
  <div className="h-screen flex flex-col bg-white">
    {/* Main Content Wrapper */}
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      
      {/* Inner Content Section */}
      <div className="flex-1 flex flex-col overflow-hidden px-4 pt-2 md:p-6 md:h-[calc(100vh-48px)]">
        <div className="flex justify-between items-center">
          <h2 className="text-sm md:text-xl md:font-semibold  mb-1 text-left pr-4 md:pr-10">
            Choose 5 restaurants from anywhere across India. Or add more from your region.
          </h2>
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
          <div className="row-span-1 min-h-0 rounded-lg overflow-hidden bg-gray-100">
            <RestaurantListPhone
              restaurants={filteredRestaurants}
              selectedRestaurants={selectedRestaurants}
              onRestaurantToggle={handleRestaurantToggle}
              maxSelections={5}
            />
          </div>

          {/* Add Custom Restaurant */}
          <p className="row-span-1 min-h-0 text-center text-sm">Want to add a restaurant that is not on this list?</p>
          <div className="row-span-1 min-h-0">
            <AddRestaurantDialogPhone
              cities={cities}
              selectedRestaurants={selectedRestaurants}
              onAddRestaurant={addCustomRestaurant}
              maxSelections={5}
            />
          </div>

          {/* Selected Restaurants Display + Done Button */}
          <div className="row-span-1 min-h-0 flex flex-col -mx-4 bg-gray-300">
            <div className="text-sm text-center py-1 shrink-0">Your Selection</div>
            <div className="flex-1 min-h-0">
              <SelectedRestaurantListPhone
                selectedRestaurants={selectedRestaurants}
                onRemoveRestaurant={removeRestaurant}
                maxSelections={5}
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
                maxSelections={5}
              />
            </div>
          </div>

          <div className="w-[40%] flex flex-col gap-1">
            <AddRestaurantDialog
              cities={cities}
              selectedRestaurants={selectedRestaurants}
              onAddRestaurant={addCustomRestaurant}
              maxSelections={5}
            />
            <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg">
              <SelectedRestaurantsList
                selectedRestaurants={selectedRestaurants}
                onRemoveRestaurant={removeRestaurant}
                maxSelections={5}
              />
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center mt-6 text-md">
          <Button
            variant="outline"
            onClick={() => navigate("/regional-selection")}
            className="flex items-center gap-2"
          >
            Back to Regional Selection
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

    {/* Footer - Fixed on Desktop */}
    <footer className="bg-black text-white text-center py-3 text-xs md:fixed md:bottom-0 md:left-0 md:right-0">
      <p>© 2025 Condé Nast India</p>
    </footer>
  </div>
);

};

export default NationalSelection;
