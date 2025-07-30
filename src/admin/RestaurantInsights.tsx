import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RestaurantInsights() {
  const [averages, setAverages] = useState([]);

  useEffect(() => {
    const fetchAverages = async () => {
      const { data, error } = await supabase
        .rpc('get_average_ratings_by_restaurant'); // You can create a Supabase function for this

      if (!error) setAverages(data);
    };

    fetchAverages();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Average Ratings</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Restaurant ID</th>
            <th className="p-2">Food</th>
            <th className="p-2">Service</th>
            <th className="p-2">Ambience</th>
          </tr>
        </thead>
        <tbody>
          {averages.map((row, i) => (
            <tr key={i}>
              <td className="p-2">{row.restaurant_id}</td>
              <td className="p-2">{row.food_avg.toFixed(1)}</td>
              <td className="p-2">{row.service_avg.toFixed(1)}</td>
              <td className="p-2">{row.ambience_avg.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
