import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface SelectedRestaurantListPhoneProps {
  selectedRestaurants: Restaurant[];
  onRemoveRestaurant: (restaurantId: string) => void;
  maxSelections: number;
}

const SelectedRestaurantListPhone = ({
  selectedRestaurants,
  onRemoveRestaurant,
  maxSelections,
}: SelectedRestaurantListPhoneProps) => {
  return (
    <div className="border border-gray-300 rounded-lg bg-white h-full flex flex-col mx-4">
      <div className="grid grid-cols-[35%_45%_auto] p-1 px-2 border-b border-gray-600 text-sm shrink-0">
        <div className="pl-2">City</div>
        <div>Restaurant name</div>
        <div className="text-center">Remove</div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {selectedRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="grid grid-cols-[35%_45%_auto] p-1 px-2 border-b border-gray-100 items-center text-sm"
          >
            <div className="break-words whitespace-normal pl-2">{restaurant.city}</div>
            <div className="break-words whitespace-normal">{restaurant.name}</div>
            <div className="text-center">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onRemoveRestaurant(restaurant.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-1 text-center text-sm shrink-0">
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

export default SelectedRestaurantListPhone; 