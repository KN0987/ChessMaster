import { Check as ChessKing } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-pulse-slow">
        <ChessKing className="w-16 h-16 text-primary-600 dark:text-primary-400" />
      </div>
      <h2 className="mt-4 text-xl font-serif font-bold text-gray-700 dark:text-gray-300">
        Loading...
      </h2>
      <div className="mt-4 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
        <div className="h-full bg-primary-600 dark:bg-primary-400 animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};

export default Loading;