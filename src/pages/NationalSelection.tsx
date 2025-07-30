import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RestaurantList from "@/components/RestaurantList";
import SelectedRestaurantsList from "@/components/SelectedRestaurantsList";
import RestaurantSearchFilter from "@/components/RestaurantSearchFilter";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/contexts/UserContext";
import RestaurantSearchFilterPhone from "@/components/RestaurantSearchFilterPhone";
import RestaurantListPhone from "@/components/RestaurantListPhone";
import SelectedRestaurantListPhone from "@/components/SelectedRestaurantListPhone";
import HamburgerMenu from "@/components/HamburgerMenu";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

const NationalSelection = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurantsLoaded, setRestaurantsLoaded] = useState(false);

  const MAX_SELECTION = 15;

  // Fetch all restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      const { data, error } = await supabase
        .from("restaurants_table")
        .select("*")
        .or("created_by_jury.is.null,created_by_jury.eq.false");

      if (error) {
        console.error("Error fetching restaurants:", error.message);
        return;
      }

      const mapped: Restaurant[] = data.map(r => ({
        id: r.restaurant_id,
        name: r.restaurant_name,
        city: r.city_name,
      }));

      setRestaurants(mapped);
      setRestaurantsLoaded(true);
    };

    if (userData?.uid) fetchRestaurants();
  }, [userData?.uid]);

  // Load saved selection
  useEffect(() => {
    const fetchSelection = async () => {
      if (!userData?.uid || !restaurantsLoaded) return;

      const { data, error } = await supabase
        .from("user_selection_table_round_2")
        .select("selected_national_restaurants")
        .eq("user_id", userData.uid)
        .single();

      if (error) {
        console.error("Error loading selection:", error.message);
        return;
      }

      setSelectedRestaurants(data?.selected_national_restaurants || []);
    };

    fetchSelection();
  }, [userData?.uid, restaurantsLoaded]);

  // Save selection
  useEffect(() => {
    const saveSelection = async () => {
      if (!userData?.uid || !restaurantsLoaded) return;

      const { error } = await supabase
        .from("user_selection_table_round_2")
        .upsert(
          {
            user_id: userData.uid,
            selected_national_restaurants: selectedRestaurants,
          },
          { onConflict: "user_id" }
        );

      if (error) console.error("Error saving selection:", error.message);
    };

    saveSelection();
  }, [selectedRestaurants, userData?.uid]);

  // Helpers
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
    } else if (selectedRestaurants.length < MAX_SELECTION) {
      setSelectedRestaurants(prev => [...prev, restaurant]);
    }
  };

  const removeRestaurant = (restaurantId: string) => {
    setSelectedRestaurants(prev => prev.filter(r => r.id !== restaurantId));
  };

  const canProceed = selectedRestaurants.length === MAX_SELECTION;

  const handleProceed = () => {
    navigate("/restaurant-review");
  };

  const cities = [...new Set(restaurants.map(r => r.city))].sort();

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden px-4 pt-2 md:p-6 md:h-[calc(100vh-48px)]">
          <div className="flex justify-between items-center">
            <h2 className="text-sm md:text-xl md:font-semibold mb-1 text-left pr-4 md:pr-10">
              Choose {MAX_SELECTION} restaurants from anywhere across India.
            </h2>
            <HamburgerMenu />
          </div>
          <hr className="border-t border-gray-300 mb-2 md:mb-4" />

          {/* ---------- Mobile Layout ---------- */}
          <div className="block md:hidden flex-1 grid grid-rows-[10%_75%_15%] gap-2 min-h-0">
            <RestaurantSearchFilterPhone
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              cities={cities}
            />

            <RestaurantListPhone
              restaurants={filteredRestaurants}
              selectedRestaurants={selectedRestaurants}
              onRestaurantToggle={handleRestaurantToggle}
              maxSelections={MAX_SELECTION}
            />

            <div className="bg-gray-300 flex flex-col -mx-4">
              <div className="text-sm text-center py-1">Your Selection</div>
              <SelectedRestaurantListPhone
                selectedRestaurants={selectedRestaurants}
                onRemoveRestaurant={removeRestaurant}
                maxSelections={MAX_SELECTION}
              />
              <div className="flex justify-center mt-2 px-4 pb-2">
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
                  maxSelections={MAX_SELECTION}
                />
              </div>
            </div>

            <div className="w-[40%] flex flex-col gap-1">
              <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg">
                <SelectedRestaurantsList
                  selectedRestaurants={selectedRestaurants}
                  onRemoveRestaurant={removeRestaurant}
                  maxSelections={MAX_SELECTION}
                />
              </div>
            </div>
          </div>

          <div className="hidden md:flex justify-end mt-6 text-md">
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

      <footer className="bg-black text-white text-center py-3 text-xs md:fixed md:bottom-0 md:left-0 md:right-0">
        <p>© 2025 Condé Nast India</p>
      </footer>
    </div>
  );
};

export default NationalSelection;
