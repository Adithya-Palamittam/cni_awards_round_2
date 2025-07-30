
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface SelectedRestaurantsListProps {
  selectedRestaurants: Restaurant[];
  onRemoveRestaurant: (restaurantId: string) => void;
  maxSelections: number;
}

const SelectedRestaurantsList = ({ 
  selectedRestaurants, 
  onRemoveRestaurant, 
  maxSelections 
}: SelectedRestaurantsListProps) => {
  return (
<div className=" p-4 h-full overflow-x-hidden flex flex-col">
  {/* Fixed Title */}
  <h3 className=" mb-2">Your Selection</h3>

  {/* Fixed Column Header */}
  <div className="border-t border-gray-200">
    <div className="grid grid-cols-[30%_55%_auto] gap-1 p-2 font-semibold border-b border-gray-600">
      <div>City</div>
      <div>Restaurant name</div>
      <div>Remove</div>
    </div>
  </div>

  {/* Scrollable Restaurant List */}
  <div className="flex-1 overflow-y-scroll border-t border-gray-100 scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin">
    {selectedRestaurants.map((restaurant) => (
      <div
        key={restaurant.id}
        className="grid grid-cols-[30%_70%] gap-2 p-2 border-b border-gray-100 items-center"
      >
        <div className="text-sm">{restaurant.city}</div>
        <div className="flex items-center justify-between min-w-0 pr-4">
          <span className="text-sm break-words whitespace-normal max-w-[80%]">{restaurant.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveRestaurant(restaurant.id)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ))}
  </div>

  {/* Fixed Bottom Message */}
  <div className="mt-4 text-center text-xl">
  {selectedRestaurants.length < maxSelections ? (
          <>
            Please add <span className="text-red-500 font-semibold">{maxSelections - selectedRestaurants.length}</span> {maxSelections - selectedRestaurants.length === 1 ? 'restaurant' : 'restaurants'}
          </>
        ) : (
          <span className="text-green-600 font-semibold">You have added {maxSelections} restaurants.</span>
        )}
  </div>
</div>

  );
};

export default SelectedRestaurantsList;
