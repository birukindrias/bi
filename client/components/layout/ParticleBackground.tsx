import React from 'react';
import Particles from 'react-tsparticles';
import { loadLinksPreset } from 'tsparticles-preset-links';

interface ParticleBackgroundProps {
  linkColor?: string;
  backgroundColor?: string;
  particleColor?: string;
  screen?: "full" | "display"
}
const ParticleBackground = ({
  linkColor = '#ffffff',
  backgroundColor = '#0d47a1',
  particleColor = '#ffffff',
  screen = 'full'
}: ParticleBackgroundProps) => {
  // const particlesInit = async (main: any) => {
  //   await loadLinksPreset(main);
  // };


  return (
    <video
      autoPlay
      loop
      muted
      className="w-auto min-w-full min-h-full max-w-none"
    >
      <source
        src={screen ? "../../assets/background_screen.webm" : "../../assets/background.webm"}
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
    // <Particles
    //   className="w-full h-full"
    //   options={{
    //     fpsLimit: 45,
    //     particles: {
    //       number:{
    //         value: 40,
    //       },
    //       color: {
    //         value: particleColor,
    //       },
    //     },
    //     links: {
    //       color: linkColor,

    //     },
    //     background: {
    //       color: {
    //         value: backgroundColor,
    //       },
    //     },
    //     fullScreen: {
    //       enable: false,
    //     },
    //     preset: 'links',
    //   }}
    //   init={particlesInit}
    // />
  );
};

export default React.memo(ParticleBackground);
