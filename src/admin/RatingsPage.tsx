import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RatingsTable() {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      const { data, error } = await supabase
        .from('ratings_table')
        .select('user_id, restaurant_id, food_rating, service_rating, ambience_rating,restaurant_name');

      if (!error) setRatings(data);
    };

    fetchRatings();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Submitted Ratings</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">User</th>
            <th className="p-2">Restaurant</th>
            <th className="p-2">Food</th>
            <th className="p-2">Service</th>
            <th className="p-2">Ambience</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((rating, i) => (
            <tr key={i}>
              <td className="p-2">{rating.user_id}</td>
              <td className="p-2">{rating.restaurant_name}</td>
              <td className="p-2">{rating.food_rating}</td>
              <td className="p-2">{rating.service_rating}</td>
              <td className="p-2">{rating.ambience_rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
