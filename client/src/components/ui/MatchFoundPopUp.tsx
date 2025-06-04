import Button from './Button';
import { useState } from 'react';

interface MatchFoundPopupProps {
  opponent: string | null;
  onAccept: () => void;
  onDecline: () => void;
}

const MatchFoundPopup: React.FC<MatchFoundPopupProps> = ({ opponent, onAccept, onDecline }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Match Found!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Opponent: <strong>{opponent}</strong>
        </p>
        { isAccepted ? <div className="flex justify-center gap-4"><Button disabled variant="primary">Accepted</Button></div>:<div className="flex justify-center gap-4">
          <Button variant="primary" onClick={() => {
            onAccept();
            setIsAccepted(true);
            }}>
            Accept
          </Button>
          <Button variant="secondary" onClick={onDecline}>
            Decline
          </Button>
        </div>}
        
      </div>
    </div>
  );
};

export default MatchFoundPopup;
