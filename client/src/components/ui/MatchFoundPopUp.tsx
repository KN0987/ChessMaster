import { useState } from 'react';
import Button from './Button';

interface MatchFoundPopupProps {
  countdown: number;
  opponent: string | null;
  onAccept: () => void;
  onDecline: () => void;
  onUserAccepted: () => void;
}

const MatchFoundPopup: React.FC<MatchFoundPopupProps> = ({ countdown, opponent, onAccept, onDecline, onUserAccepted }) => {
  const [isAccepted, setIsAccepted] = useState(false);


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Match Found!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Opponent: <strong>{opponent}</strong>
        </p>

        {!isAccepted && (
          <p className="text-sm text-red-500 dark:text-red-300 mb-4">
            Remaining time <strong>{countdown}</strong> seconds...
          </p>
        )}

        <div className="flex justify-center gap-4">
          {isAccepted ? (
            <Button disabled variant="primary">Accepted</Button>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={() => {
                  onAccept();
                  setIsAccepted(true);
                  onUserAccepted();
                }}
              >
                Accept
              </Button>
              <Button variant="secondary" onClick={onDecline}>
                Decline
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchFoundPopup;
