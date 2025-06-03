import { useState } from "react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { BarChart3, Check as ChessKing, User, Settings, Calendar, Clock, Trophy } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("games");
  
  // Mock user data
  const user = {
    username: "ChessMaster2000",
    rating: 1850,
    joined: "March 2023",
    gamesPlayed: 156,
    wins: 87,
    losses: 45,
    draws: 24,
    winRate: "55.8%",
  };
  
  // Mock recent games
  const recentGames = [
    {
      id: "1",
      opponent: "Grandmaster42",
      opponentRating: 1920,
      result: "win",
      date: "2 hours ago",
      moves: 34,
      time: "5+0",
    },
    {
      id: "2",
      opponent: "ChessWhiz",
      opponentRating: 1780,
      result: "loss",
      date: "Yesterday",
      moves: 42,
      time: "10+0",
    },
    {
      id: "3",
      opponent: "KnightRider",
      opponentRating: 1830,
      result: "draw",
      date: "2 days ago",
      moves: 60,
      time: "3+2",
    },
    {
      id: "4",
      opponent: "BishopBoss",
      opponentRating: 1750,
      result: "win",
      date: "3 days ago",
      moves: 28,
      time: "5+0",
    },
  ];
  
  // Tabs
  const tabs = [
    { id: "games", label: "Games", icon: <ChessKing className="w-5 h-5" /> },
    { id: "stats", label: "Stats", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
              <User className="w-12 h-12" />
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {user.username}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>{user.rating} ELO</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user.joined}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChessKing className="w-4 h-4" />
                  <span>{user.gamesPlayed} games played</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 max-w-md mx-auto md:mx-0">
                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded text-center">
                  <div className="text-green-600 dark:text-green-400 font-bold text-xl">{user.wins}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Wins</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded text-center">
                  <div className="text-red-600 dark:text-red-400 font-bold text-xl">{user.losses}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Losses</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded text-center">
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-xl">{user.draws}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Draws</div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                Find Friends
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "games" && (
            <>
              {/* Recent Games */}
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                    Recent Games
                  </h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Opponent
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Result
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Time Control
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Moves
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recentGames.map((game) => (
                          <tr
                            key={game.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {game.opponent}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {game.opponentRating} ELO
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  game.result === "win"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : game.result === "loss"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                }`}
                              >
                                {game.result.charAt(0).toUpperCase() + game.result.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-900 dark:text-white">
                                  {game.time}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                              {game.moves}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                              {game.date}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Button variant="ghost" size="sm">
                                Analyze
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
              
              {/* Activity Calendar */}
              <Card>
                <CardHeader>
                  <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                    Activity
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Activity calendar will be displayed here
                    </p>
                  </div>
                </CardBody>
              </Card>
            </>
          )}
          
          {activeTab === "stats" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-6">
                Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rating History */}
                <Card>
                  <CardHeader>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Rating History
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Rating chart will be displayed here
                      </p>
                    </div>
                  </CardBody>
                </Card>
                
                {/* Win/Loss Ratio */}
                <Card>
                  <CardHeader>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Win/Loss Ratio
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Win/loss chart will be displayed here
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-6">
                Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Account
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        defaultValue={user.username}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        defaultValue="user@example.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Dark Mode
                      </span>
                      <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                        <input
                          type="checkbox"
                          id="toggle"
                          className="absolute w-0 h-0 opacity-0"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle"
                          className="absolute inset-0 rounded-full bg-primary-500 cursor-pointer transition-colors duration-200 ease-in-out"
                        ></label>
                        <span className="absolute inset-y-0 left-0 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out translate-x-4"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Sound Effects
                      </span>
                      <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                        <input
                          type="checkbox"
                          id="sound"
                          className="absolute w-0 h-0 opacity-0"
                          defaultChecked
                        />
                        <label
                          htmlFor="sound"
                          className="absolute inset-0 rounded-full bg-primary-500 cursor-pointer transition-colors duration-200 ease-in-out"
                        ></label>
                        <span className="absolute inset-y-0 left-0 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out translate-x-4"></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;