import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit2, CircleAlert } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabaseClient";
import HamburgerMenu from "@/components/HamburgerMenu";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface Rating {
  food: number;
  service: number;
  ambience: number;
}

const FinalRatings = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [editingRating, setEditingRating] = useState<Rating>({ food: 0, service: 0, ambience: 0 });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user } = useUser();

useEffect(() => {
  const fetchData = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("user_selection_table_round_2")
      .select("selected_national_restaurants, restaurant_ratings")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching selections:", error.message);
      return;
    }

    const allRestaurants: Restaurant[] = data?.selected_national_restaurants || [];
    const restaurantRatings: Record<string, Rating> = data?.restaurant_ratings || {};

    // === Extra Rule: More than 15 ratings ===
    if (Object.keys(restaurantRatings).length > 15) {
      const { error: deleteError } = await supabase
        .from("user_selection_table_round_2")
        .update({ restaurant_ratings: {} })
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Error clearing ratings:", deleteError.message);
      } else {
        console.log("✅ Cleared extra ratings for user", user.id);
      }

      setRedirectPath("/rating");
      setErrorDialogOpen(true);
      return;
    }

    // Sort restaurants for display
    allRestaurants.sort((a, b) => {
      const cityCompare = a.city.localeCompare(b.city);
      return cityCompare !== 0 ? cityCompare : a.name.localeCompare(b.name);
    });

    setRestaurants(allRestaurants);
    setRatings(restaurantRatings);

    // === Data integrity check ===
    const has15Restaurants = allRestaurants.length === 15;
    const has15Ratings = Object.keys(restaurantRatings).length === 15;

    const anyInvalidRating = allRestaurants.some(r => {
      const rating = restaurantRatings[r.id];
      return !rating || rating.food < 1 || rating.service < 1 || rating.ambience < 1;
    });

    if (!has15Restaurants) {
      setRedirectPath("/national-selection");
      setErrorDialogOpen(true);
    } else if (!has15Ratings || anyInvalidRating) {
      setRedirectPath("/rating");
      setErrorDialogOpen(true);
    }
  };

  fetchData();
}, [user, navigate]);


  const handleEditRating = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setEditingRating(ratings[restaurant.id] || { food: 0, service: 0, ambience: 0 });
    setIsEditDialogOpen(true);
  };

  const saveEditedRating = async () => {
    if (!editingRestaurant || !user?.id) return;

    const updatedRatings = {
      ...ratings,
      [editingRestaurant.id]: editingRating
    };

    setRatings(updatedRatings);

    const { error } = await supabase
      .from("user_selection_table_round_2")
      .update({ restaurant_ratings: updatedRatings })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating ratings:", error.message);
    }

    setIsEditDialogOpen(false);
    setEditingRestaurant(null);
  };

  const updateEditingRating = (category: keyof Rating, value: number) => {
    setEditingRating(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const StarRating = ({
    value,
    onChange,
    label,
    readonly = false
  }: {
    value: number;
    onChange?: (rating: number) => void;
    label: string;
    readonly?: boolean;
  }) => {
    return (
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium">{label}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => !readonly && onChange && onChange(star)}
              className={`text-2xl ${star <= value ? 'text-yellow-400' : 'text-gray-300'} ${!readonly ? 'hover:text-yellow-400 transition-colors' : ''}`}
              disabled={readonly}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    );
  };
const handleSubmit = async () => {
  if (!user?.id) {
    alert("User not logged in.");
    return;
  }

  try {
    // Get latest ratings from DB
    const { data, error } = await supabase
      .from("user_selection_table_round_2")
      .select("selected_national_restaurants, restaurant_ratings")
      .eq("user_id", user.id)
      .single();

    if (error) {
      throw new Error("Failed to fetch latest ratings: " + error.message);
    }

    const allRestaurants: Restaurant[] = data?.selected_national_restaurants || [];
    const latestRatings: Record<string, Rating> = data?.restaurant_ratings || {};

    // Validation
    const has15Restaurants = allRestaurants.length === 15;
    const has15Ratings = Object.keys(latestRatings).length === 15;
    const anyInvalidRating = allRestaurants.some(r => {
      const rating = latestRatings[r.id];
      return !rating || rating.food < 1 || rating.service < 1 || rating.ambience < 1;
    });

    if (!has15Restaurants) {
      alert("You must select 15 restaurants before submitting.");
      navigate("/national-selection");
      return;
    }

    if (!has15Ratings || anyInvalidRating) {
      alert("Please rate all restaurants with a score from 1 to 5 before submitting.");
      navigate("/rating");
      return;
    }

    // Prepare entries for insert
    const entries = allRestaurants.map((restaurant) => ({
      user_id: user.id,
      restaurant_id: restaurant.id,
      restaurant_name: restaurant.name,
      food_rating: latestRatings[restaurant.id].food,
      service_rating: latestRatings[restaurant.id].service,
      ambience_rating: latestRatings[restaurant.id].ambience,
      is_complete: true
    }));

    // Step 1: Insert into ratings table
    const { error: insertError } = await supabase.from("ratings_table_round_2").insert(entries);
    if (insertError) {
      throw new Error("Error submitting ratings: " + insertError.message);
    }

    // Step 2: Update user completion status
    const { error: updateError } = await supabase
      .from("users_table_round_2")
      .update({ is_completed: true })
      .eq("uid", user.id);
    if (updateError) {
      throw new Error("Error updating completion status: " + updateError.message);
    }

    // Step 3: Verify insert
    const { data: verifyData, error: verifyError } = await supabase
      .from("ratings_table_round_2")
      .select("restaurant_id")
      .eq("user_id", user.id);

    if (verifyError) {
      throw new Error("Verification query failed: " + verifyError.message);
    }

    if (!verifyData || verifyData.length !== 15) {
      throw new Error("Verification failed: not all ratings were saved.");
    }

    // Step 4: Sign out and navigate
    await supabase.auth.signOut();
    navigate("/thank-you");

  } catch (err: any) {
    console.error(err);
    alert(err.message || "There was an error saving your ratings. Please try again.");
  }
};


  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:pt-4">
        <div className="relative flex items-center md:pt-0 pt-4">
          <div className="flex-1"></div>
          <h2 className="absolute md:font-base font-semibold left-1/2 transform -translate-x-1/2 text-xl md:text-2xl text-center w-max">Your Final Ratings</h2>
          <HamburgerMenu />
        </div>
      </div>

      <div className="md:p-4 px-4 pb-4 pt-2 md:p-6">
        <div className="hidden md:block md:px-[6rem] lg:px-[18rem]">
          <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
            {restaurants.map((restaurant, index) => (
              <div key={restaurant.id} className="border border-gray-300 rounded-lg px-4 pt-4">
                <div className="flex justify-between items-start mb-4 border-b border-gray-300">
                  <div>
                    <div className="text-blue-600 font-medium text-md">{restaurant.city}</div>
                    <h2 className="text-2xl font-bold pb-2">{restaurant.name}</h2>
                  </div>
                  <div className="text-red-500 text-xs">{index + 1}<span className="text-blue-600">/15</span></div>
                </div>
                <div className="grid grid-cols-[80%_15%] relative">
                  <div>
                    <StarRating label="Food" value={ratings[restaurant.id]?.food || 0} readonly />
                    <StarRating label="Service" value={ratings[restaurant.id]?.service || 0} readonly />
                    <StarRating label="Ambience" value={ratings[restaurant.id]?.ambience || 0} readonly />
                  </div>
                  <div className="absolute bottom-0 right-0 pb-3">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleEditRating(restaurant)}
                      className="flex flex-col items-center justify-center bg-gray-600 text-white hover:bg-black px-2 py-1 h-auto gap-0"
                    >
                      <Edit2 className="w-1 h-1" />
                      <div className="text-xs">Edit</div>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="block md:hidden">
          <div className="space-y-4 mb-8">
            {restaurants.map((restaurant, index) => (
              <div key={restaurant.id} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-blue-600 font-medium text-sm">{restaurant.city}</div>
                    <h3 className="text-lg font-bold pb-2">{restaurant.name}</h3>
                  </div>
                  <div className="text-red-500 text-sm">{index + 1}<span className="text-blue-600">/15</span></div>
                </div>
                <hr className="border-gray-300 mb-4" />
                <div className="grid grid-cols-[75%_15%] relative">
                  <div>
                    <StarRating label="Food" value={ratings[restaurant.id]?.food || 0} readonly />
                    <StarRating label="Service" value={ratings[restaurant.id]?.service || 0} readonly />
                    <StarRating label="Ambience" value={ratings[restaurant.id]?.ambience || 0} readonly />
                  </div>
                  <div className="absolute bottom-0 right-0">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleEditRating(restaurant)}
                      className="flex flex-col items-center justify-center bg-gray-600 text-white hover:bg-black px-2 py-1 h-auto gap-0"
                    >
                      <Edit2 className="w-1 h-1" />
                      <div className="text-xs">Edit</div>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:pb-10">
          <Button
            onClick={handleSubmit}
            className="bg-green-500 text-white md:text-lg text-lg md:py-6 px-8 py-3 rounded hover:bg-green-600"
          >
            Submit your final ratings
          </Button>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md w-[90%]">
          <DialogHeader>
            <DialogTitle className="text-left mt-1 pr-4">
              Edit the ratings for {editingRestaurant?.name}
            </DialogTitle>
            <hr className="border-gray-300 mt-2" />
          </DialogHeader>
          <div>
            <StarRating label="Food" value={editingRating.food} onChange={(v) => updateEditingRating('food', v)} />
            <StarRating label="Service" value={editingRating.service} onChange={(v) => updateEditingRating('service', v)} />
            <StarRating label="Ambience" value={editingRating.ambience} onChange={(v) => updateEditingRating('ambience', v)} />
            <div className="flex gap-2 pt-2 text-md">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1 mx-4">Cancel</Button>
              <Button onClick={saveEditedRating} className="flex-1 mx-4">Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
            <Dialog 
        open={errorDialogOpen} 
        onOpenChange={(open) => {
          setErrorDialogOpen(open);
          if (!open && redirectPath) {
            navigate(redirectPath);
          }
        }}
      >
        <DialogContent className="max-w-md w-[90%] flex flex-col items-center justify-center text-center gap-2 py-4">
          <CircleAlert className="text-yellow-500 w-16 h-16 mx-auto" />
          <div className="text-lg font-semibold">
            We've detected a network issue and some of your progress may not have been saved.
          </div>
          <button
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
            onClick={() => {
              setErrorDialogOpen(false);
              if (redirectPath) {
                navigate(redirectPath);
              }
            }}
          >
            Ok
          </button>
        </DialogContent>
      </Dialog>


      <footer className="bg-black text-white text-center py-3 mt-4 text-xs md:fixed md:bottom-0 md:left-0 md:right-0">
        <p className="text-xs">© 2025 Condé Nast India</p>
      </footer>
    </div>
  );
};

export default FinalRatings;
