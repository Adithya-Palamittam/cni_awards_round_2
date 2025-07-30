
import StarRating from "./StarRating";

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

interface RestaurantRatingCardProps {
  restaurant: Restaurant;
  rating: Rating;
  currentIndex: number;
  totalCount: number;
  onRatingChange: (category: keyof Rating, value: number) => void;
  isMobile?: boolean;
}

const RestaurantRatingCard = ({
  restaurant,
  rating,
  currentIndex,
  totalCount,
  onRatingChange,
  isMobile = false
}: RestaurantRatingCardProps) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-6 mx-6">
      <div className="text-left mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-blue-600 font-medium">{restaurant.city}</div>
          <div className="text-blue-600 font-medium"><span className="text-red-500 font-medium">{currentIndex + 1}</span>/{totalCount}</div>
        </div>
        <h2 className={`font-bold border-b border-gray-300 pb-2 break-words whitespace-normal ${isMobile ? 'text-xl' : 'text-2xl'}`}>
          {restaurant.name}
        </h2>
      </div>

      <div className="space-y-6">
        {isMobile ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">Food</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onRatingChange('food', star)}
                    className={`text-2xl ${star <= rating.food ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">Service</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onRatingChange('service', star)}
                    className={`text-2xl ${star <= rating.service ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">Ambience</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onRatingChange('ambience', star)}
                    className={`text-2xl ${star <= rating.ambience ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <StarRating
              label="Food"
              value={rating.food}
              onChange={(value) => onRatingChange('food', value)}
            />
            
            <StarRating
              label="Service"
              value={rating.service}
              onChange={(value) => onRatingChange('service', value)}
            />
            
            <StarRating
              label="Ambience"
              value={rating.ambience}
              onChange={(value) => onRatingChange('ambience', value)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantRatingCard;
