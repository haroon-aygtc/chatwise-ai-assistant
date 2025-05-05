
import { ReactNode, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';

interface DevicePreviewProps {
  device: 'desktop' | 'tablet' | 'mobile';
  children: ReactNode;
}

const DevicePreview = ({ device, children }: DevicePreviewProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getDeviceStyles = () => {
    if (isFullscreen) {
      return {
        wrapper: 'w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80',
        scale: 1,
        background: 'bg-transparent',
      };
    }

    switch (device) {
      case 'desktop':
        return {
          wrapper: 'max-w-full mx-auto',
          scale: 1,
          background: 'bg-transparent',
        };
      case 'tablet':
        return {
          wrapper: 'max-w-[768px] mx-auto border-8 border-gray-800 rounded-xl overflow-hidden',
          scale: 0.8,
          background: 'bg-gradient-to-b from-gray-100 to-gray-200',
        };
      case 'mobile':
        return {
          wrapper: 'max-w-[375px] mx-auto border-[12px] border-gray-800 rounded-[36px] overflow-hidden',
          scale: 0.65,
          background: 'bg-gradient-to-b from-gray-100 to-gray-200',
        };
      default:
        return {
          wrapper: 'max-w-full mx-auto',
          scale: 1,
          background: 'bg-transparent',
        };
    }
  };

  const { wrapper, scale, background } = getDeviceStyles();

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${wrapper} ${background} transition-all duration-300 relative`}>
      <div 
        className="device-content"
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease'
        }}
      >
        {children}
      </div>
      
      <button 
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 p-2 bg-gray-800/50 hover:bg-gray-800/80 rounded-full text-white transition-colors z-10"
      >
        {isFullscreen ? (
          <Minimize className="h-4 w-4" />
        ) : (
          <Maximize className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default DevicePreview;