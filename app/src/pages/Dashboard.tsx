import { useState } from "react";
import { useSearch } from "../hooks/useSearch";
import { useTrustScore } from "../hooks/useTrustScore";
import { useCompliance } from "../hooks/useCompliance";
import { useNotifications } from "../hooks/useNotifications";

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults, isLoading: isSearching } =
    useSearch(searchQuery);
  const { data: trustScore, isLoading: isTrustLoading } =
    useTrustScore(searchQuery);
  const { data: compliance, isLoading: isComplianceLoading } =
    useCompliance(searchQuery);
  const { data: notifications, isLoading: isNotificationsLoading } =
    useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-xl mx-auto">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search for a wallet or project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Trust Score Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Trust Score
              </h3>
              {isTrustLoading ? (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : trustScore ? (
                <div className="mt-2">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {trustScore.score}
                  </div>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {trustScore.description}
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No trust score available
                </div>
              )}
            </div>
          </div>

          {/* Compliance Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Compliance Status
              </h3>
              {isComplianceLoading ? (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : compliance ? (
                <div className="mt-2">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {compliance.status}
                  </div>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {compliance.details}
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No compliance data available
                </div>
              )}
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Recent Notifications
              </h3>
              {isNotificationsLoading ? (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : notifications && notifications.length > 0 ? (
                <div className="mt-2 space-y-4">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      {notification.message}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No recent notifications
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Search Results
            </h3>
            {isSearching ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Searching...
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {searchResults.map((result, index) => (
                    <li key={index}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                            {result.name}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              {result.type}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              {result.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
