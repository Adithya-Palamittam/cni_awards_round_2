import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface RestaurantSearchFilterPhoneProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  cities: string[];
}

const RestaurantSearchFilterPhone = ({
  selectedCity,
  onCityChange,
  searchTerm,
  onSearchChange,
  cities
}: RestaurantSearchFilterPhoneProps) => {
  
  // Clear search bar when city changes
  const handleCityChange = (city: string) => {
    onCityChange(city);
    onSearchChange("");
  };

  return (
    <div className="flex flex-col gap-1 mb-2 px-12 text-xs">
      <Select value={selectedCity} onValueChange={handleCityChange}>
        <SelectTrigger className="w-full text-xs h-7">
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative w-full">
        <Input
          placeholder="Search by restaurant name"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10 pl-4 py-0 flex-1 text-xs h-7"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>
    </div>
  );
};

export default RestaurantSearchFilterPhone;
