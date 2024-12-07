import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Search, AlertCircle, Clock, UserPlus } from "lucide-react";
import axios from "../../lib/axios";

const SubscriptionManagement = () => {
  const [subscriptionData, setSubscriptionData] = useState({
    subscriptions: [],
    expiringSubscriptions: [],
    usersWithoutSubscription: [],
    plans: [],
  });
  const [userSearch, setUserSearch] = useState("");
  const [expiringSearch, setExpiringSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/subscriptions");
      setSubscriptionData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load subscription data");
      console.error("Error fetching subscription data:", err);
    } finally {
      setLoading(false);
    }
  };

  const addSubscription = async (userId, planId) => {
    try {
      await axios.post(`/subscriptions/users/${userId}/subscription`, {
        plan_id: planId,
        start_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      });
      fetchData();
    } catch (err) {
      console.error("Error adding subscription:", err);
    }
  };

  const deactivateSubscription = async (subscriptionId) => {
    try {
      await axios.post(`/subscriptions/${subscriptionId}/deactivate`);
      fetchData();
    } catch (err) {
      console.error("Error deactivating subscription:", err);
    }
  };

  const activateUser = async (userId) => {
    try {
      await axios.post(`/subscriptions/users/${userId}/activate`);
      fetchData();
    } catch (err) {
      console.error("Error activating user:", err);
    }
  };

  const filteredUsers = subscriptionData.usersWithoutSubscription.filter(
    (user) =>
      (user.name?.toLowerCase() || "").includes(userSearch.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(userSearch.toLowerCase())
  );

  const filteredExpiring = subscriptionData.expiringSubscriptions.filter(
    (sub) =>
      (sub.user?.name?.toLowerCase() || "").includes(
        expiringSearch.toLowerCase()
      ) ||
      (sub.user?.email?.toLowerCase() || "").includes(
        expiringSearch.toLowerCase()
      )
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        <AlertCircle className="inline-block mr-2" size={20} />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Users without subscription */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Users Without Subscription</h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{user.first_name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        className="rounded border-gray-300 text-sm"
                        onChange={(e) => {
                          if (e.target.value) {
                            addSubscription(user.id, e.target.value);
                          }
                        }}
                      >
                        <option value="">Select plan...</option>
                        {subscriptionData.plans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} ({plan.duration_months} months)
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => activateUser(user.id)}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add Subscription
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expiring subscriptions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Expiring Subscriptions</h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={expiringSearch}
              onChange={(e) => setExpiringSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Current Plan</th>
                <th className="px-4 py-3 text-left">Expires</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpiring.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{subscription.user.first_name}</td>
                  <td className="px-4 py-3">{subscription.plan.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-red-500" />
                      <span className="text-red-600 font-medium">
                        {formatDistanceToNow(new Date(subscription.end_date), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        className="rounded border-gray-300 text-sm"
                        onChange={(e) =>
                          addSubscription(subscription.user.id, e.target.value)
                        }
                      >
                        <option value="">Add new subscription...</option>
                        {subscriptionData.plans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} ({plan.duration_months} months)
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => deactivateSubscription(subscription.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                      >
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
