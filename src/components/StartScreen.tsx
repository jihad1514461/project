import React from 'react';
import { Sword, Shield, BookOpen } from 'lucide-react';

interface StartScreenProps {
  onSelectOption: (option: 'game' | 'admin') => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onSelectOption }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <Sword className="w-12 h-12 text-yellow-400 mr-4" />
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              RPG Quest
            </h1>
            <Shield className="w-12 h-12 text-yellow-400 ml-4" />
          </div>
          <p className="text-xl text-gray-300 font-medium">
            Embark on Epic Text Adventures
          </p>
          <p className="text-gray-400 mt-2">
            Create your hero, make choices, and forge your destiny
          </p>
        </div>

        {/* Main Options */}
        <div className="space-y-6">
          <button
            onClick={() => onSelectOption('game')}
            className="w-full max-w-md mx-auto block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <Sword className="w-6 h-6" />
              <span className="text-xl">Start Adventure</span>
            </div>
            <p className="text-sm text-blue-100 mt-2">Begin your heroic journey</p>
          </button>

          <button
            onClick={() => onSelectOption('admin')}
            className="w-full max-w-md mx-auto block bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <BookOpen className="w-6 h-6" />
              <span className="text-xl">Game Master</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">Manage classes, races, and stories</p>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 text-gray-500 text-sm">
          <p>A text-based RPG adventure with endless possibilities</p>
        </div>
      </div>
    </div>
  );
};