import React from 'react';
import { SilentRemoval } from '../Editor/SilentRemoval';
import { Captions } from '../Editor/Captions';
import { Chapters } from '../Editor/Chapters';
import { BRoll } from '../Editor/BRoll';
import { EndCards } from '../Editor/EndCards';
import { Timeline } from '../Editor/Timeline';
import { VideoEffects } from '../Effects/VideoEffects';
import { TransitionEffects } from '../Transitions/TransitionEffects';

export const FeatureList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <SilentRemoval />
      <Captions />
      <Chapters />
      <BRoll />
      <EndCards />
      <VideoEffects />
      <TransitionEffects />
      <Timeline />
    </div>
  );
};