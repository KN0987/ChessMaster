import { Check as ChessKing, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} ChessMaster
            </p>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <p className="text-sm text-gray-600 hover:underline cursor-pointer">Contact Support</p>
            </div>
          </div>
      </div>
    </footer>
  );
};

export default Footer;