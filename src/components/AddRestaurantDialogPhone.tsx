import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as Tooltip from "@radix-ui/react-tooltip";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface AddRestaurantDialogPhoneProps {
  cities: string[];
  selectedRestaurants: Restaurant[];
  onAddRestaurant: (restaurant: Restaurant) => void;
  maxSelections: number;
}

const AddRestaurantDialogPhone = ({ 
  cities, 
  selectedRestaurants, 
  onAddRestaurant, 
  maxSelections 
}: AddRestaurantDialogPhoneProps) => {
  const [newRestaurantCity, setNewRestaurantCity] = useState("");
  const [newRestaurantName, setNewRestaurantName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customCity, setCustomCity] = useState("");
  const [showCustomCityInput, setShowCustomCityInput] = useState(false);

  const addCustomRestaurant = () => {
    const finalCity = showCustomCityInput ? customCity : newRestaurantCity;
    if (finalCity.trim() && newRestaurantName.trim() && selectedRestaurants.length < maxSelections) {
      // Check if the custom city already exists in the cities list (case-insensitive)
      const existingCity = cities.find(city => 
        city.toLowerCase() === finalCity.trim().toLowerCase()
      );
      
      const cityToUse = existingCity || finalCity.trim();
      
      const newRestaurant: Restaurant = {
        id: `custom-${Date.now()}`,
        city: cityToUse,
        name: newRestaurantName
      };
      onAddRestaurant(newRestaurant);
      setNewRestaurantCity("");
      setNewRestaurantName("");
      setCustomCity("");
      setShowCustomCityInput(false);
      setIsDialogOpen(false);
    }
  };

  const handleCityChange = (value: string) => {
    setNewRestaurantCity(value);
    if (value === "others") {
      setShowCustomCityInput(true);
      setCustomCity("");
    } else {
      setShowCustomCityInput(false);
      setCustomCity("");
    }
  };

  const isFormValid = () => {
    const hasValidCity = showCustomCityInput ? customCity.trim() : newRestaurantCity.trim();
    return hasValidCity && newRestaurantName.trim() && selectedRestaurants.length < maxSelections;
  };

  return (
    <div className="">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex justify-center">
       
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <div>
         <DialogTrigger asChild>
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 py-0 h-6 px-5 text-xs disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={selectedRestaurants.length >= maxSelections}
        >
          Yes
        </Button>
        </DialogTrigger>
      </div>
    </Tooltip.Trigger>
    {selectedRestaurants.length >= maxSelections && (
      <Tooltip.Content
        side="top"
        className="bg-black text-white px-4 py-2 rounded text-sm shadow-lg z-50"
      >
        You have already added {maxSelections} restaurants
        <Tooltip.Arrow className="fill-black" />
      </Tooltip.Content>
    )}
  </Tooltip.Root>
</Tooltip.Provider>

        
        </div>
        <DialogContent className="max-w-md w-[90%]">
          <DialogHeader>
            <DialogTitle className="mb-2 text-left pr-4">Nominate a restaurant not on this list</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Restaurant name, location/branch"
              value={newRestaurantName}
              onChange={(e) => setNewRestaurantName(e.target.value)}
            />
            <Select value={newRestaurantCity} onValueChange={handleCityChange}>
              <SelectTrigger>
                <SelectValue placeholder="City/Town" />
              </SelectTrigger>
              <SelectContent side="bottom" className="max-h-60 overflow-y-auto z-50">
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            {showCustomCityInput && (
              <Input
                placeholder="Enter city/town"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
              />
            )}
            <Button 
              onClick={addCustomRestaurant}
              className="w-full hover:bg-green-600"
              disabled={!isFormValid()}
            >
              Add Restaurant
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRestaurantDialogPhone;
