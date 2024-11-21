import React, { useState } from 'react';
import { BRollManager } from './BRollManager';
import { Intros } from './Intros';
import { Film, Play, Wand2, Layout } from 'lucide-react';
import { cn } from './utils';

const tabs = [
  { id: 'manager', label: 'Media Manager', icon: Film },
  { id: 'intros', label: 'Intros', icon: Play },
  { id: 'transitions', label: 'Transitions', icon: Wand2 },
  { id: 'templates', label: 'Templates', icon: Layout }
] as const;

type TabId = typeof tabs[number]['id'];

export const BRoll: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('manager');

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="border-b border-gray-200 mb-4">
        <div className="flex space-x-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'manager' && <BRollManager />}
        {activeTab === 'intros' && <Intros />}
        {activeTab === 'transitions' && (
          <div className="p-4 text-center text-gray-500">
            Transitions feature coming soon
          </div>
        )}
        {activeTab === 'templates' && (
          <div className="p-4 text-center text-gray-500">
            Templates feature coming soon
          </div>
        )}
      </div>
    </div>
  );
};