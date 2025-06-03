import { Link } from "react-router-dom";
import { Check as ChessKing, Home } from "lucide-react";
import Button from "../components/ui/Button";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <ChessKing className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-6" />
      
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        404 - Page Not Found
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg text-center mb-8">
        The page you're looking for doesn't exist or has been moved.
        Perhaps you were looking for a different chess opening?
      </p>
      
      <Link to="/">
        <Button size="lg" leftIcon={<Home className="w-5 h-5" />}>
          Back to Home
        </Button>
      </Link>
      
      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-md">
        <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-3">
          Did You Know?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          There are more possible chess games than atoms in the observable universe.
          The number of distinct 40-move games is around 10<sup>120</sup>.
        </p>
      </div>
    </div>
  );
};

export default NotFound;