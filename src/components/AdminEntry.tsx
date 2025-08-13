import React from 'react';
import { User, UserPlus, ArrowLeft } from 'lucide-react';

interface AdminEntryProps {
  onSelectOption: (option: 'continue' | 'new') => void;
  onBack: () => void;
  hasExistingPlayer: boolean;
}

export const AdminEntry: React.FC<AdminEntryProps> = ({ onSelectOption, onBack, hasExistingPlayer }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <button
          onClick={onBack}
          className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Main Menu</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Game Master Portal</h2>
          <p className="text-gray-400 text-center mb-8">
            Choose your path: continue existing adventure or create anew
          </p>

          <div className="space-y-4">
            <button
              onClick={() => onSelectOption('continue')}
              disabled={!hasExistingPlayer}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                hasExistingPlayer
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <User className="w-5 h-5" />
                <span>Continue Existing Adventure</span>
              </div>
              {hasExistingPlayer ? (
                <p className="text-sm text-green-100 mt-1">Resume your hero's journey</p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">No saved character found</p>
              )}
            </button>

            <button
              onClick={() => onSelectOption('new')}
              className="w-full py-4 px-6 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-3">
                <UserPlus className="w-5 h-5" />
                <span>Create New Character</span>
              </div>
              <p className="text-sm text-blue-100 mt-1">Begin a fresh adventure</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};