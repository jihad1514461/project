import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { GameData } from '../types/game';

interface StorySelectionProps {
  gameData: GameData;
  onSelectStory: (storyId: string) => void;
  onBack: () => void;
}

export const StorySelection: React.FC<StorySelectionProps> = ({
  gameData,
  onSelectStory,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Adventure</h1>
          <p className="text-purple-200 text-lg">
            Select a story to begin your epic journey
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(gameData.stories).map(([storyId, story]) => (
            <div
              key={storyId}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
              onClick={() => onSelectStory(storyId)}
            >
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-purple-300 group-hover:text-purple-200 transition-colors" />
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors">
                  {storyId}
                </h3>
              </div>
              
              <p className="text-purple-200 mb-4 line-clamp-3">
                Adventure awaits in this exciting story
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-300">
                  Nodes: {Object.keys(story).length}
                </span>
                <span className="text-purple-300">
                  Start: intro
                </span>
              </div>
            </div>
          ))}
        </div>

        {Object.keys(gameData.stories).length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Stories Available</h3>
            <p className="text-purple-300">
              Stories will appear here once they are added to the game.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};