import { useState } from "react";
import { useTrustScore } from "../hooks/useTrustScore";
import { useBalanceHistory } from "../hooks/useBalanceHistory";
import { useMinedBlocks } from "../hooks/useMinedBlocks";
import { useTopAccounts } from "../hooks/useTopAccounts";
import { formatDistanceToNow } from "date-fns";

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: trustScore,
    isLoading: isTrustLoading,
    error: trustError,
  } = useTrustScore(searchQuery);

  const {
    data: balanceHistory,
    isLoading: isBalanceHistoryLoading,
    error: balanceHistoryError,
  } = useBalanceHistory(searchQuery, {
    limit: 10,
    sort: "desc",
  });

  const {
    data: minedBlocks,
    isLoading: isMinedBlocksLoading,
    error: minedBlocksError,
  } = useMinedBlocks(searchQuery, {
    limit: 10,
  });

  const { data: topAccounts } = useTopAccounts({
    limit: 10,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (value.startsWith("0x") && value.length === 42)) {
      setSearchQuery(value);
    }
  };

  // Helper function to get compliance level color
  const getComplianceColor = (level: string) => {
    const numLevel = parseInt(level);
    if (numLevel >= 3)
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    if (numLevel >= 2)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
  };

  // Helper function to get compliance status text
  const getComplianceStatus = (level: string) => {
    const numLevel = parseInt(level);
    if (numLevel >= 3) return "High Compliance";
    if (numLevel >= 2) return "Medium Compliance";
    return "Low Compliance";
  };

  // Helper function to format balance
  const formatBalance = (balance: string) => {
    const numBalance = parseFloat(balance) / 1e18; // Convert from wei to ETH
    return numBalance.toFixed(4);
  };

  // Helper function to format block reward
  const formatBlockReward = (reward: string) => {
    const numReward = parseFloat(reward) / 1e18; // Convert from wei to ETH
    return numReward.toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-xl mx-auto">
            <label htmlFor="search" className="sr-only">
              Search Wallet Address
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
                placeholder="Enter wallet address (0x...)"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {!searchQuery ? (
          // Top Accounts Section (shown when no wallet address is entered)
          <div className="mt-8">
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 shadow-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Top Wallet Holders
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Rank
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Address
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Balance
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        % Supply
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Tx Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {(topAccounts || []).map((account, idx) => (
                      <tr
                        key={account.address}
                        className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition"
                        onClick={() => setSearchQuery(account.address)}
                      >
                        <td className="px-4 py-3 font-bold text-lg">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                              ${
                                idx === 0
                                  ? "bg-yellow-300 text-yellow-900 dark:bg-yellow-400 dark:text-gray-900"
                                  : idx === 1
                                  ? "bg-gray-300 text-gray-900 dark:bg-gray-300 dark:text-gray-900"
                                  : idx === 2
                                  ? "bg-orange-300 text-orange-900 dark:bg-orange-400 dark:text-gray-900"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white"
                              }`}
                          >
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-blue-700 dark:text-blue-300 font-mono flex items-center gap-2">
                          {account.address.slice(0, 6)}...
                          {account.address.slice(-4)}
                          <button
                            className="ml-2 text-gray-400 hover:text-blue-600 dark:hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(account.address);
                            }}
                            title="Copy Address"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16h8M8 12h8m-8-4h8M4 6h16M4 10h16M4 14h16M4 18h16"
                              />
                            </svg>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">
                          {formatBalance(account.balance)}{" "}
                          <span className="text-xs text-gray-400">ETH</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-200 text-xs font-semibold">
                            {parseFloat(account.percentage).toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 text-xs font-semibold">
                            {account.transactionCount}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // Existing wallet details section
          <div className="mt-8 space-y-8">
            {/* Trust Score Results */}
            {trustScore && (
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    Compliance Overview
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* KYC Compliance */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          KYC Compliance
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(
                            trustScore.kycLevel
                          )}`}
                        >
                          {getComplianceStatus(trustScore.kycLevel)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:text-blue-200 dark:bg-blue-600">
                                Level {trustScore.kycLevel}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-600">
                            <div
                              style={{
                                width: `${
                                  (parseInt(trustScore.kycLevel) / 5) * 100
                                }%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trust Score */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Trust Score
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(
                            trustScore.reputation
                          )}`}
                        >
                          {parseInt(trustScore.reputation) >= 200
                            ? "High Trust"
                            : parseInt(trustScore.reputation) >= 100
                            ? "Medium Trust"
                            : "Low Trust"}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200 dark:text-green-200 dark:bg-green-600">
                                Score {trustScore.reputation}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200 dark:bg-green-600">
                            <div
                              style={{
                                width: `${
                                  (parseInt(trustScore.reputation) / 500) * 100
                                }%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filter Level */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Filter Level
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(
                            trustScore.filterLevel
                          )}`}
                        >
                          {getComplianceStatus(trustScore.filterLevel)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200 dark:text-purple-200 dark:bg-purple-600">
                                Level {trustScore.filterLevel}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200 dark:bg-purple-600">
                            <div
                              style={{
                                width: `${
                                  (parseInt(trustScore.filterLevel) / 5) * 100
                                }%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Balance History Card */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Balance History
                </h3>
                {isBalanceHistoryLoading ? (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Loading balance history...
                  </div>
                ) : balanceHistoryError ? (
                  <div className="mt-2 text-sm text-red-500">
                    Error loading balance history. Please try again.
                  </div>
                ) : balanceHistory && balanceHistory.length > 0 ? (
                  <div className="mt-4 flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                  Time
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                  Block
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                  Balance
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                  Change
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                              {balanceHistory.map((entry, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {formatDistanceToNow(
                                      new Date(
                                        parseInt(entry.timeStamp) * 1000
                                      ),
                                      { addSuffix: true }
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {entry.blockNumber}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {formatBalance(entry.balance)} ETH
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                      className={`${
                                        entry.balanceChange.startsWith("-")
                                          ? "text-red-600 dark:text-red-400"
                                          : "text-green-600 dark:text-green-400"
                                      }`}
                                    >
                                      {entry.balanceChange.startsWith("-")
                                        ? ""
                                        : "+"}
                                      {formatBalance(entry.balanceChange)} ETH
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No balance history available
                  </div>
                )}
              </div>
            </div>

            {/* Mined Blocks Card */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Mined Blocks
                </h3>
                {isMinedBlocksLoading ? (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Loading mined blocks...
                  </div>
                ) : minedBlocksError ? (
                  <div className="mt-2 text-sm text-red-500">
                    Error loading mined blocks. Please try again.
                  </div>
                ) : minedBlocks && minedBlocks.length > 0 ? (
                  <div className="mt-4 flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                  Time
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                  Block Number
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                  Block Reward
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                              {minedBlocks.map((block, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {formatDistanceToNow(
                                      new Date(
                                        parseInt(block.timeStamp) * 1000
                                      ),
                                      { addSuffix: true }
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {block.blockNumber}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {formatBlockReward(block.blockReward)} ETH
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No mined blocks found
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Information Card */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Detailed Information
                </h3>
                {isTrustLoading ? (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Loading...
                  </div>
                ) : trustError ? (
                  <div className="mt-2 text-sm text-red-500">
                    Error loading trust score. Please try again.
                  </div>
                ) : trustScore ? (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Activation Status */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Activation Status
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {trustScore.activated ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                              Activated
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                              Not Activated
                            </span>
                          )}
                        </p>
                      </div>

                      {/* KYC Level */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          KYC Level
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          Level {trustScore.kycLevel}
                        </p>
                        {trustScore.kycLastUpdateBlockNumber && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Last updated at block{" "}
                            {trustScore.kycLastUpdateBlockNumber}
                          </p>
                        )}
                      </div>

                      {/* Reputation Score */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Reputation Score
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {trustScore.reputation}
                        </p>
                      </div>

                      {/* Filter Level */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Filter Level
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          Level {trustScore.filterLevel}
                        </p>
                        {trustScore.filterLastUpdateBlockNumber && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Last updated at block{" "}
                            {trustScore.filterLastUpdateBlockNumber}
                          </p>
                        )}
                      </div>

                      {/* Activation Block */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Activation Block
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {trustScore.activationBlockNumber || "Not activated"}
                        </p>
                      </div>

                      {/* Activation Transaction */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Activation Transaction
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white break-all">
                          {trustScore.activationTxHash || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No trust score information available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
