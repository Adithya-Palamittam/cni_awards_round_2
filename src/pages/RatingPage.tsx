import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RestaurantRatingCard from "@/components/RestaurantRatingCard";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/contexts/UserContext";
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

const RatingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("user_selection_table")
        .select("selected_regional_restaurants, selected_national_restaurants, restaurant_ratings")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user selections:", error.message);
        return;
      }

      const regionalList: Restaurant[] = data?.selected_regional_restaurants || [];
      const nationalList: Restaurant[] = data?.selected_national_restaurants || [];
      
      // Sort by city, then name
      const all: Restaurant[] = [...regionalList, ...nationalList].sort((a, b) => {
      const cityCompare = a.city.localeCompare(b.city);
      return cityCompare !== 0 ? cityCompare : a.name.localeCompare(b.name);
    });

      setRestaurants(all);
      const savedRatings: Record<string, Rating> = data?.restaurant_ratings || {};
      setRatings(savedRatings);

      const firstUnratedIndex = all.findIndex((r) => {
        const rating = savedRatings[r.id];
        return !rating || rating.food === 0 || rating.service === 0 || rating.ambience === 0;
      });

      setCurrentIndex(firstUnratedIndex === -1 ? 0 : firstUnratedIndex);
    };

    fetchData();
  }, [user]);

  const currentRestaurant = restaurants[currentIndex];
  const currentRating: Rating = currentRestaurant
    ? {
        food: ratings[currentRestaurant.id]?.food || 0,
        service: ratings[currentRestaurant.id]?.service || 0,
        ambience: ratings[currentRestaurant.id]?.ambience || 0,
      }
    : { food: 0, service: 0, ambience: 0 };

  const isCurrentRated =
    currentRating.food > 0 &&
    currentRating.service > 0 &&
    currentRating.ambience > 0;

  const canGoNext =
    currentIndex < restaurants.length - 1 && isCurrentRated;
  const canSubmit =
    currentIndex === restaurants.length - 1 && isCurrentRated;

  const updateRating = (category: keyof Rating, value: number) => {
    if (!currentRestaurant) return;

    const existing = ratings[currentRestaurant.id] || {
      food: 0,
      service: 0,
      ambience: 0,
    };

    setRatings((prev) => ({
      ...prev,
      [currentRestaurant.id]: {
        ...existing,
        [category]: value,
      },
    }));
  };

  const saveRatingsToSupabase = async (
    updatedRatings: Record<string, Rating>
  ) => {
    if (!user) return;
    const { error } = await supabase
      .from("user_selection_table")
      .update({ restaurant_ratings: updatedRatings })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error saving ratings:", error);
    }
  };

  const goNext = async () => {
    if (canGoNext) {
      await saveRatingsToSupabase(ratings);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (canSubmit) {
      await saveRatingsToSupabase(ratings);
      navigate("/final-ratings");
    }
  };

  if (!currentRestaurant) return null;

  const NavigationButtons = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex justify-between mx-6">
<span
  onClick={currentIndex === 0 ? undefined : goPrevious}
  className={`inline-flex items-center gap-2 font-medium ${
    currentIndex === 0
      ? 'text-gray-400 cursor-not-allowed'
      : 'text-black cursor-pointer hover:text-gray-800'
  }`}
>
  ← Previous
</span>


      {canSubmit ? (
<span
  onClick={isCurrentRated ? handleSubmit : undefined}
  className={`inline-block font-medium ${
    isCurrentRated
      ? 'text-black cursor-pointer hover:text-gray-800'
      : 'text-gray-400 cursor-not-allowed'
  }  `}
>
  Submit
</span>

      ) : (
        <span
  onClick={isCurrentRated ? goNext : undefined}
  className={`inline-flex items-center ${isCurrentRated ? 'text-blue-600 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}  rounded`}
>
  Next →
</span>

      )}
    </div>
  );

return (
  <div className="min-h-screen flex flex-col bg-white">
    {/* Header with Hamburger Menu */}
    <div className="flex justify-end items-center pt-2 pr-2">
      <HamburgerMenu />
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      
      {/* Mobile Layout */}
      <div className="block md:hidden flex-1 px-4 pb-4 overflow-y-auto">
        <img src="/logo.png" alt="TP Awards Logo" className="mx-auto mb-6 w-[10rem] h-[10rem] object-contain" />
        <p className="text-lg mb-6 text-center">Rate the top 15 restaurants you selected</p>

        <RestaurantRatingCard
          restaurant={currentRestaurant}
          rating={currentRating}
          currentIndex={currentIndex}
          totalCount={restaurants.length}
          onRatingChange={updateRating}
          isMobile={true}
        />
        <NavigationButtons isMobile={true} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md text-center mb-14">
          <img src="/logo.png" alt="TP Awards Logo" className="mx-auto mb-6 w-[12rem] h-[12rem] object-contain" />
          <p className="text-lg mb-10">Rate the top 15 restaurants you selected</p>

          <RestaurantRatingCard
            restaurant={currentRestaurant}
            rating={currentRating}
            currentIndex={currentIndex}
            totalCount={restaurants.length}
            onRatingChange={updateRating}
          />
          <NavigationButtons />
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="bg-black text-white text-center py-3 text-xs md:fixed md:bottom-0 md:left-0 md:right-0">
      <p>© 2025 Condé Nast India</p>
    </footer>
  </div>
);

};

export default RatingPage;
