import React, { useState, useEffect } from "react";
import { Loader, Search } from "lucide-react";
import axios from "../../lib/axios";

const AdminReferralPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/referrals");
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#111] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">
          Referral Management
        </h1>
        <div className="relative text-gray-300">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-[#333] rounded-lg bg-[#222] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader className="h-8 w-8 animate-spin text-gray-300" />
        </div>
      ) : (
        <div className="bg-[#222] border border-[#333] rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-300">
              <thead className="bg-[#222] border-b border-[#333]">
                <tr>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-400">
                    User
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-400">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-400">
                    Times Used
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-400">
                    Total Discount Given
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-400">
                    Referred Users
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#333] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-100">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {item.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-200">
                      {item.referral_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                      {item.times_used}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                      ${item.total_discount_given}
                    </td>
                    <td className="px-6 py-4 text-gray-200">
                      <div className="space-y-2">
                        {item.referred_users.map((user) => (
                          <div key={user.email} className="text-sm">
                            <div className="font-medium text-gray-100">
                              {user.name}
                            </div>
                            <div className="text-gray-400">{user.email}</div>
                            <div className="text-gray-400 text-xs">
                              Joined{" "}
                              {new Date(user.joined_at).toLocaleDateString()} •
                              ${user.discount} discount
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReferralPage;
