import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface FinalSelectedRestaurantListPhoneProps {
  restaurants: Restaurant[];
  onRemoveRestaurant: (restaurantId: string) => void;
}

const FinalSelectedRestaurantListPhone = ({
  restaurants,
  onRemoveRestaurant,
}: FinalSelectedRestaurantListPhoneProps) => {
  return (
    <div className="border border-gray-300 rounded-lg bg-white h-full flex flex-col mx-4">
      <div className="grid grid-cols-[30%_50%_auto] p-1 px-2 border-b border-gray-200 text-sm shrink-0">
        <div className="pl-2">City</div>
        <div>Restaurant name</div>
        <div className="text-center">Remove</div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="grid grid-cols-[30%_50%_auto] p-1 px-2 border-b border-gray-100 items-center text-sm"
          >
            <div className="pl-2">{restaurant.city}</div>
            <div>{restaurant.name}</div>
            <div className="text-center">
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
    </div>
  );
};

export default FinalSelectedRestaurantListPhone; 