import { useState } from 'react';
import { ArrowLeft, Users, Search, UserPlus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';

const MultiPlayer = () => {
  const [matchType, setMatchType] = useState<string>('random');
  const [timeControl, setTimeControl] = useState<string>('blitz');
  
  const timeControls = [
    { id: 'bullet', name: 'Bullet', time: '1+0', description: 'Super fast games' },
    { id: 'blitz', name: 'Blitz', time: '3+2', description: 'Quick thinking required' },
    { id: 'rapid', name: 'Rapid', time: '10+0', description: 'More time to think' },
    { id: 'classical', name: 'Classical', time: '30+0', description: 'Strategic depth' },
  ];
  
  const handleFindMatch = () => {
    // In a real app, this would connect to matchmaking service
    console.log('Finding match with:', { matchType, timeControl });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
            Online Multiplayer
          </h1>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Challenge players from around the world in real-time matches. Find an opponent that matches your skill level or invite a friend.
        </p>
        
        {/* Match Type */}
        <h2 className="font-serif text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Choose Match Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Random Match */}
          <Card 
            className={`cursor-pointer transition-all ${
              matchType === 'random'
                ? 'ring-2 ring-primary-500 dark:ring-primary-400'
                : 'hover:shadow-md'
            }`}
            onClick={() => setMatchType('random')}
          >
            <CardBody className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Random Opponent
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get matched with a player of similar rating from around the world
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
          
          {/* Friend Match */}
          <Card 
            className={`cursor-pointer transition-all ${
              matchType === 'friend'
                ? 'ring-2 ring-primary-500 dark:ring-primary-400'
                : 'hover:shadow-md'
            }`}
            onClick={() => setMatchType('friend')}
          >
            <CardBody className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                  <UserPlus className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Challenge a Friend
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Create a private game and invite a friend to play
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Time Controls */}
        <h2 className="font-serif text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Select Time Control
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {timeControls.map((control) => (
            <Card
              key={control.id}
              className={`cursor-pointer transition-all ${
                timeControl === control.id
                  ? 'ring-2 ring-primary-500 dark:ring-primary-400'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setTimeControl(control.id)}
            >
              <CardBody className="p-4 text-center">
                <div className="flex flex-col items-center">
                  <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {control.name}
                  </h3>
                  <p className="text-lg font-mono font-medium text-primary-600 dark:text-primary-400">
                    {control.time}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {control.description}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          {matchType === 'random' ? (
            <Button
              size="lg"
              leftIcon={<Search className="w-5 h-5" />}
              onClick={handleFindMatch}
            >
              Find Match
            </Button>
          ) : (
            <Button
              size="lg"
              leftIcon={<UserPlus className="w-5 h-5" />}
              onClick={handleFindMatch}
            >
              Create Game
            </Button>
          )}
        </div>
        
        {/* Online Players */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
              Online Players
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                1,243 players online
              </span>
            </div>
          </div>
          
          <Card>
            <CardBody className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        Player{index + 1}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {1200 + Math.floor(Math.random() * 800)} ELO
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MultiPlayer;