import { Link } from 'react-router-dom';
import { Cpu, Users, Clock, UserPlus } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';

const Play = () => {
  // Game modes
  const gameModes = [
    {
      id: 'single',
      title: 'Single Player',
      description: 'Challenge our chess AI at various difficulty levels',
      icon: <Cpu className="w-8 h-8" />,
      path: '/play/single',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'multi',
      title: 'PvP',
      description: 'Play against human opponents from around the world',
      icon: <Users className="w-8 h-8" />,
      path: '/play/multi',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'local',
      title: 'Same Device',
      description: 'Play against a friend on the same device',
      icon: <UserPlus className="w-8 h-8" />,
      path: '/play/local',
      color: 'from-orange-500 to-amber-600',
    },
  ];

  // Time controls
  const timeControls = [
    {
      id: 'bullet',
      title: 'Bullet',
      time: '1+0',
      description: 'Super fast games with 1 minute per player',
      icon: <Clock className="w-6 h-6" />,
    },
    {
      id: 'blitz',
      title: 'Blitz',
      time: '3+2',
      description: '3 minutes with 2 second increment per move',
      icon: <Clock className="w-6 h-6" />,
    },
    {
      id: 'rapid',
      title: 'Rapid',
      time: '10+0',
      description: '10 minutes per player for a more relaxed game',
      icon: <Clock className="w-6 h-6" />,
    },
    {
      id: 'classical',
      title: 'Classical',
      time: '30+0',
      description: '30 minutes per player for deep strategic play',
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Choose Your Game Mode
        </h1>

        {/* Game Modes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {gameModes.map((mode) => (
            <Link key={mode.id} to={mode.path} className="block">
              <Card className="h-full transform transition-all hover:scale-105 hover:shadow-lg overflow-hidden">
                <div className={`bg-gradient-to-r ${mode.color} h-2`} />
                <CardBody className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                      {mode.icon}
                    </div>
                    <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                      {mode.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                    {mode.description}
                  </p>
                  <Button fullWidth rightIcon={<ArrowRight className='w-4 h-4'/>}>
                    {mode.title}
                  </Button>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Play;