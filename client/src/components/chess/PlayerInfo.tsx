import { Clock, Trophy, User } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface PlayerInfoProps {
  username: string;
  avatar?: string;
  rating?: number;
  timeLeft?: number; // in seconds
  isActive?: boolean;
  isTop?: boolean;
  className?: string;
}

const PlayerInfo = ({
  username,
  avatar,
  rating = 1200,
  timeLeft,
  isActive = false,
  isTop = false,
  className,
}: PlayerInfoProps) => {
  // Format time to mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div
      className={twMerge(
        'flex items-center gap-3 p-3 rounded-lg transition-colors',
        isActive
          ? 'bg-primary-50 dark:bg-primary-900 border border-black dark:border-primary-800'
          : 'bg-gray-50 dark:bg-gray-800 border border-2 border-black',
        isTop ? 'order-first' : 'order-last',
        className
      )}
    >
      {/* Avatar */}
      <div className="relative">
        {avatar ? (
          <img
            src={avatar}
            alt={username}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
        )}
        
        {/* Active indicator */}
        {isActive && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
        )}
      </div>
      
      {/* Player info */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{username}</h3>
          
          {/* Time left */}
          {timeLeft !== undefined && (
            <div className={`flex items-center gap-1 font-mono ${
              timeLeft < 30 ? 'text-red-600 dark:text-red-400' : 
              timeLeft < 60 ? 'text-amber-600 dark:text-amber-400' : 
              'text-gray-700 dark:text-gray-300'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <Trophy className="w-3 h-3" />
          <span>{rating} ELO</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;