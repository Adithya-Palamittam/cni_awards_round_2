import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [topRestaurant, setTopRestaurant] = useState<string>("...");

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Total users
      const { count: userCount } = await supabase
        .from("users_table")
        .select("*", { count: "exact", head: true });
      setTotalUsers(userCount || 0);

      // Total ratings
      const { count: ratingCount } = await supabase
        .from("ratings_table")
        .select("*", { count: "exact", head: true });
      setTotalRatings(ratingCount || 0);
    };

    fetchDashboardData();
  }, []);

  return (
    <main className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Welcome, Admin 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl mt-2 font-bold text-blue-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Ratings</h2>
          <p className="text-3xl mt-2 font-bold text-green-600">{totalRatings}</p>
        </div>
        {/* <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Top Restaurant</h2>
          <p className="text-xl mt-2 font-medium text-gray-800">{topRestaurant}</p>
        </div> */}
      </div>
    </main>
  );
};

export default AdminDashboard;
