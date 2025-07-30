
import { Checkbox } from "@/components/ui/checkbox";
import * as Tooltip from "@radix-ui/react-tooltip";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface RestaurantListProps {
  restaurants: Restaurant[];
  selectedRestaurants: Restaurant[];
  onRestaurantToggle: (restaurant: Restaurant) => void;
  maxSelections: number;
}

const RestaurantList = ({ 
  restaurants, 
  selectedRestaurants, 
  onRestaurantToggle, 
  maxSelections 
}: RestaurantListProps) => {
  const isSelected = (restaurantId: string) => {
    return selectedRestaurants.some(r => r.id === restaurantId);
  };

  return (
    <div className="border-t border-gray-200 h-full overflow-x-hidden flex flex-col">
      <div className="grid grid-cols-[25%_60%_auto] p-2 font-semibold border-b border-gray-600">
        <div>City</div>
        <div>Restaurant name</div>
        <div className="text-center pr-6">Add</div>
      </div>
      
      <div className="flex-1 overflow-y-scroll scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin">
        {[...restaurants]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(restaurant => (
          <div key={restaurant.id} className="grid grid-cols-[25%_60%_auto] p-2 border-b border-gray-100 hover:bg-gray-50">
            <div className="break-words whitespace-normal">{restaurant.city}</div>
            <div className="break-words whitespace-normal">{restaurant.name}</div>
            <div className="flex items-center justify-center">
            <Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <div>
        <Checkbox
          checked={isSelected(restaurant.id)}
          onCheckedChange={() => onRestaurantToggle(restaurant)}
          disabled={!isSelected(restaurant.id) && selectedRestaurants.length >= maxSelections}
        />
      </div>
    </Tooltip.Trigger>
    {!isSelected(restaurant.id) && selectedRestaurants.length >= maxSelections && (
      <Tooltip.Content
        side="top"
        className="bg-black text-white px-4 py-2 rounded text-base max-w-2xs shadow-lg z-50"
      >
        You have already shortlisted your {maxSelections} restaurants
        <Tooltip.Arrow className="fill-black" />
      </Tooltip.Content>
    )}
  </Tooltip.Root>
</Tooltip.Provider>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
