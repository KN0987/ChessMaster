import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Search, UserPlus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import io from 'socket.io-client';
import { useUser } from '../context/UserContext';

const MultiPlayer = () => {
  const [matchType, setMatchType] = useState<string>('random');
  const [timeControl, setTimeControl] = useState<string>('blitz');
  const [socket, setSocket] = useState<any>(null); // Socket connection
  const [roomId, setRoomId] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<string | null>(null);
  const [waitingTime, setWaitingTime] = useState<number>(0); // Store the waiting time in seconds
  const [isFindButtonClicked, setIsFindButtonClicked] = useState<boolean>(false); // Track if the button is clicked
  const [isWaiting, setIsWaiting] = useState<boolean>(false); // Track whether the user is waiting for a match

  const { user } = useUser(); 
  const uid = user?.uid || '';
  
  const timeControls = [
    { id: 'bullet', name: 'Bullet', time: '1+0', description: 'Super fast games' },
    { id: 'blitz', name: 'Blitz', time: '3+2', description: 'Quick thinking required' },
    { id: 'rapid', name: 'Rapid', time: '10+0', description: 'More time to think' },
    { id: 'classical', name: 'Classical', time: '30+0', description: 'Strategic depth' },
  ];

  // Set up socket connection when the component mounts
  useEffect(() => {
    const newSocket = io('http://localhost:3001'); // Connect to the server
    setSocket(newSocket);

    // Listen for the matchFound event
    newSocket.on('matchFound', ({ roomId, opponent }) => {
      setRoomId(roomId); // Store the room ID
      setOpponent(opponent); // Store the opponent's name
      console.log(`Matched with opponent: ${opponent}`);
    });

    return () => newSocket.close(); // Cleanup socket connection on unmount
  }, []);

  // Handle finding a match (emit to the server)
  const handleFindMatch = () => {
    if (socket) {
      console.log('Finding match with:', { matchType, timeControl, uid });
      // Emit to the server to join the queue using uid instead of socket.id
      socket.emit('joinQueue', { matchType, timeControl, uid });
      setIsFindButtonClicked(true);
      setIsWaiting(true);
    }
  };

  // Handle cancelling waiting (emit to the server and reset state)
  const handleCancelWaiting = () => {
    if (socket) {
      console.log('Cancelling waiting...');
      socket.emit('cancelQueue', { uid }); // Notify the server to remove the player from the queue
      setIsFindButtonClicked(false); // Reset the button text
      setIsWaiting(false); // Stop waiting
      setWaitingTime(0); // Reset the timer
    }
  };

  // Start the timer when the button is clicked
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;

    if (isFindButtonClicked && isWaiting) {
      // Start the timer (incrementing the time every second)
      timerInterval = setInterval(() => {
        setWaitingTime((prevTime) => prevTime + 1);
      }, 1000); // Update every second
    } else {
      // Reset the waiting time if the button is not clicked or if cancelled
      setWaitingTime(0);
    }

    // Cleanup the interval when the timer is not active
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isFindButtonClicked, isWaiting]);

  // Format the waiting time to "MM:SS"
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
              {isFindButtonClicked ? <>{formatTime(waitingTime)}</> : <>Find Match</>}
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
          
          {isFindButtonClicked && (
            <Button
              size="lg"
              variant="danger"
              onClick={handleCancelWaiting}
            >
              Cancel Waiting
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiPlayer;
