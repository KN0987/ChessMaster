import { useState } from 'react';
import { ArrowLeft, Brain, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';

const SinglePlayer = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  const difficulties = [
    {
      id: 'beginner',
      name: 'Beginner',
      description: 'Perfect for new players learning the basics of chess',
      icon: <Brain className="w-8 h-8" />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      elo: '800-1000',
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: 'Challenging for casual players with some experience',
      icon: <Zap className="w-8 h-8" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      elo: '1200-1400',
    },
    {
      id: 'advanced',
      name: 'Advanced',
      description: 'Tough opponent that will challenge experienced players',
      icon: <Target className="w-8 h-8" />,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
      elo: '1600-1800',
    },
    {
      id: 'expert',
      name: 'Expert',
      description: 'Plays at a strong club level, requiring serious chess skills',
      icon: <Target className="w-8 h-8" />,
      color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
      elo: '2000+',
    },
  ];
  
  const timeControls = [
    { id: 'bullet', name: 'Bullet', time: '1+0' },
    { id: 'blitz', name: 'Blitz', time: '3+2' },
    { id: 'rapid', name: 'Rapid', time: '10+0' },
    { id: 'classical', name: 'Classical', time: '30+0' },
  ];
  
  const handleStartGame = () => {
    // In a real app, this would navigate to the game with the selected options
    console.log('Starting game with difficulty:', selectedDifficulty);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/play" className="mr-4">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
            Play Against the Computer
          </h1>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Challenge our advanced chess AI at different difficulty levels. Select a difficulty and time control to begin.
        </p>
        
        {/* Difficulty Selection */}
        <h2 className="font-serif text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Choose Difficulty Level
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {difficulties.map((difficulty) => (
            <Card 
              key={difficulty.id}
              className={`cursor-pointer transition-all ${
                selectedDifficulty === difficulty.id
                  ? 'ring-2 ring-primary-500 dark:ring-primary-400'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedDifficulty(difficulty.id)}
            >
              <CardBody className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${difficulty.color}`}>
                    {difficulty.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {difficulty.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {difficulty.description}
                    </p>
                    <span className="inline-block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-medium">
                      ELO: {difficulty.elo}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        
        {/* Time Controls */}
        <h2 className="font-serif text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Select Time Control
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {timeControls.map((control) => (
            <Card
              key={control.id}
              className="cursor-pointer hover:shadow-md transition-all text-center"
            >
              <CardBody className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  {control.name}
                </h3>
                <p className="text-lg font-mono font-medium text-primary-600 dark:text-primary-400">
                  {control.time}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
        
        {/* Play Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            onClick={handleStartGame}
            disabled={!selectedDifficulty}
          >
            Start Game
          </Button>
          <Button variant="outline" size="lg">
            Customize Position
          </Button>
        </div>
        
        {/* Tips */}
        <div className="mt-12 bg-accent-50 dark:bg-accent-900/20 p-6 rounded-lg">
          <h3 className="font-serif text-lg font-bold mb-2 text-gray-900 dark:text-white">
            AI Opponent Tips
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Each difficulty level plays with a different style and strength</li>
            <li>The AI will analyze its mistakes after games to improve</li>
            <li>You can take back moves when playing against the computer</li>
            <li>After the game, use the analysis feature to learn from your play</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SinglePlayer;