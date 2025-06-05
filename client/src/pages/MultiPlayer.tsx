import { useState, useEffect } from 'react';
import { ArrowLeft, Search, UserPlus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import {io, Socket} from 'socket.io-client';
import { useUser } from '../context/UserContext';
import { BACKEND_URL } from '../config/config';
import MatchFoundPopup from '../components/ui/MatchFoundPopUp';

const MultiPlayer = () => {
  const [matchType, setMatchType] = useState('random');
  const [timeControl, setTimeControl] = useState('blitz');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchId, setMatchId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [waitingTime, setWaitingTime] = useState(0);
  const [isFindButtonClicked, setIsFindButtonClicked] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [hasAccepted, setHasAccepted] = useState(false);


  const { user } = useUser();
  const uid = user?.uid || '';

  const timeControls = [
    { id: 'blitz', name: 'Blitz', time: '3+2', description: '3 mins with 2-second increment per move' },
    { id: 'quick', name: 'Quick', time: '10+0', description: 'More time to think' },
    { id: 'normal', name: 'Normal', time: '30+0', description: 'Strategic depth' },
  ];

  useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    newSocket.on('matchFound', ({ matchId, opponent }) => {
      console.log('Match found:', matchId, opponent);
      setMatchId(matchId);
      setOpponent(opponent);
      setShowMatchPopup(true);
    });

    newSocket.on('matchDeclined', ({ declinedBy, reason }) => {
      console.log(`Match was declined by: ${declinedBy}. Reason: ${reason}`);
      setShowMatchPopup(false);
    
      // If I declined or both timed out, stop searching
      if (declinedBy === uid || (declinedBy=== uid && reason === 'timeout')) {
        setIsWaiting(false);
        setIsFindButtonClicked(false);
        setWaitingTime(0);
      } else {
        // Opponent declined, so requeue me
        setIsWaiting(true);
        setIsFindButtonClicked(true);
      }
    });

    newSocket.on('gameStart', ({ roomId }) => {
      window.location.href = `/game/${roomId}`;
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleFindMatch = () => {
    if (socket) {
      socket.emit('joinQueue', { matchType, timeControl, uid });
      setIsFindButtonClicked(true);
      setIsWaiting(true);
    }
  };

  const handleCancelWaiting = () => {
    if (socket) {
      socket.emit('cancelQueue', { timeControl, uid });
      setIsFindButtonClicked(false);
      setIsWaiting(false);
      setWaitingTime(0);
    }
  };

  const handleDecline = () => {
    if (matchId && socket) {
      socket?.emit('declineMatch', { matchId, uid });
      console.log('Match declined:', matchId, "| uid:", uid);
    }
    setShowMatchPopup(false);
    setIsWaiting(false);
    setIsFindButtonClicked(false);
    setWaitingTime(0);
  }

  useEffect(() => {
    let timerInterval: ReturnType<typeof setInterval> | null = null;
  
    if (isFindButtonClicked && isWaiting) {
      timerInterval = setInterval(() => {
        setWaitingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setWaitingTime(0);
    }
  
    return () => {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
      }
    };
  }, [isFindButtonClicked, isWaiting]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!showMatchPopup || hasAccepted) return;
  
    setCountdown(15);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [showMatchPopup, hasAccepted]);

  useEffect(() => {
    if (showMatchPopup) {
      setCountdown(15); 
      setHasAccepted(false);
    }
  }, [showMatchPopup]);

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

        <h2 className="font-serif text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Choose Match Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div onClick={() => setMatchType('random')}>
            <Card className={`cursor-pointer transition-all ${matchType === 'random' ? 'ring-2 ring-primary-500 dark:ring-primary-400' : 'hover:shadow-md'}`}>
              <CardBody className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <Search className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Random Opponent</h3>
                    <p className="text-gray-600 dark:text-gray-300">Get matched with a player of similar rating from around the world</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div onClick={() => setMatchType('friend')}>
            <Card className={`cursor-pointer transition-all ${matchType === 'friend' ? 'ring-2 ring-primary-500 dark:ring-primary-400' : 'hover:shadow-md'}`}>
              <CardBody className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Challenge a Friend</h3>
                    <p className="text-gray-600 dark:text-gray-300">Create a private game and invite a friend to play</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <h2 className="font-serif text-xl font-bold mb-4 text-gray-900 dark:text-white">Select Time Control</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {timeControls.map((control) => (
            <div key={control.id} onClick={() => setTimeControl(control.id)}>
              <Card className={`cursor-pointer transition-all ${timeControl === control.id ? 'ring-2 ring-primary-500 dark:ring-primary-400' : 'hover:shadow-md'}`}>
                <CardBody className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                    <h3 className="font-bold text-gray-900 dark:text-white">{control.name}</h3>
                    <p className="text-lg font-mono font-medium text-primary-600 dark:text-primary-400">{control.time}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{control.description}</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          {matchType === 'random' ? (
            <Button size="lg" leftIcon={<Search className="w-5 h-5" />} onClick={handleFindMatch}>
              {isFindButtonClicked ? formatTime(waitingTime) : 'Find Match'}
            </Button>
          ) : (
            <Button size="lg" leftIcon={<UserPlus className="w-5 h-5" />} onClick={handleFindMatch}>
              Create Game
            </Button>
          )}

          {isFindButtonClicked && (
            <Button size="lg" variant="danger" onClick={handleCancelWaiting}>
              Cancel Waiting
            </Button>
          )}
        </div>
      </div>

      {showMatchPopup && (
        <MatchFoundPopup
        countdown={countdown}
        opponent={opponent}
          onAccept={() => {
            if (matchId && socket) {
              socket?.emit('acceptMatch', { matchId, uid });
            }
            setShowMatchPopup(true);
          }}
          onDecline={handleDecline}
          onUserAccepted={() => setHasAccepted(true)}
        />
      )}
    </div>
  );
};

export default MultiPlayer;
