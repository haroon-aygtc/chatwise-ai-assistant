
import { MessageSquareMore, X, Maximize, Minimize } from 'lucide-react';
import { useState } from 'react';

interface WidgetPreviewProps {
  config: any;
  showWelcomeButtons?: boolean;
  aiModel?: {
    id: string;
    name: string;
  } | null;
  promptTemplate?: {
    id: string;
    name: string;
  } | null;
}

const WidgetPreview = ({ config, showWelcomeButtons = false, aiModel = null, promptTemplate = null }: WidgetPreviewProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const {
    appearance: {
      primaryColor,
      headerBgColor,
      textColor,
      borderRadius,
      widgetWidth,
      widgetHeight,
      darkMode,
      glassMorphism,
      shadow,
      animation
    },
    general: {
      botName,
      welcomeMessage,
      placeholderText
    },
    behavior: {
      welcomeButtons
    }
  } = config;

  const getShadowClass = () => {
    switch(shadow) {
      case 'sm': return 'shadow-sm';
      case 'md': return 'shadow-md';
      case 'lg': return 'shadow-lg';
      case 'xl': return 'shadow-xl';
      default: return '';
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerStyles = isFullscreen ? {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    maxHeight: '100vh',
    zIndex: 50,
    margin: 0,
    borderRadius: 0,
  } : {
    width: `${widgetWidth}px`, 
    height: `${widgetHeight}px`,
    borderRadius: `${borderRadius}px`,
    maxWidth: '100%',
    maxHeight: '650px'
  };

  return (
    <div 
      className={`flex flex-col overflow-hidden ${getShadowClass()} transition-all ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } ${glassMorphism ? 'backdrop-blur-md bg-opacity-80' : ''} relative`}
      style={containerStyles}
    >
      {/* AI Model Badge (if applicable) */}
      {aiModel && (
        <div 
          className="absolute top-2 left-2 z-20 px-2 py-1 text-xs rounded-full" 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.6)', 
            color: 'white'
          }}
        >
          AI: {aiModel.name}
        </div>
      )}

      {/* Widget Header */}
      <div 
        className="p-4 flex items-center justify-between"
        style={{ 
          backgroundColor: headerBgColor,
          borderTopLeftRadius: isFullscreen ? 0 : `${borderRadius}px`,
          borderTopRightRadius: isFullscreen ? 0 : `${borderRadius}px`,
          ...(glassMorphism && { backdropFilter: 'blur(10px)', backgroundColor: `${headerBgColor}cc` })
        }}
      >
        <div className="flex items-center">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: primaryColor }}
          >
            <MessageSquareMore className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-white">{botName}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="text-white hover:bg-white/10 rounded-full p-1"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
          <button 
            className="text-white hover:bg-white/10 rounded-full p-1"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Chat Area */}
      <div 
        className={`flex-1 p-4 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
        style={{ color: textColor }}
      >
        {/* Bot Message */}
        <div className="mb-4 flex">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: primaryColor }}
          >
            <MessageSquareMore className="w-4 h-4 text-white" />
          </div>
          <div 
            className={`py-3 px-4 rounded-lg max-w-[80%] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            style={{ borderRadius: `${Math.max(8, borderRadius - 2)}px` }}
          >
            <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {welcomeMessage}
              {promptTemplate && (
                <span className="block text-xs mt-1 opacity-75">
                  Using template: {promptTemplate.name}
                </span>
              )}
            </p>

            {/* Quick reply buttons */}
            {showWelcomeButtons && welcomeButtons && welcomeButtons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {welcomeButtons.map((button: {label: string, value: string}, idx: number) => (
                  <button 
                    key={idx}
                    className="px-3 py-1 text-xs rounded-full transition-colors"
                    style={{ 
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      color: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'
                    }}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Sample user message */}
        <div className="mb-4 flex justify-end">
          <div 
            className="py-3 px-4 rounded-lg max-w-[80%]"
            style={{ 
              backgroundColor: primaryColor,
              borderRadius: `${Math.max(8, borderRadius - 2)}px` 
            }}
          >
            <p className="text-sm text-white">
              Hello! I have a question about your services.
            </p>
          </div>
        </div>
        
        {/* Sample bot response */}
        <div className="mb-4 flex">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: primaryColor }}
          >
            <MessageSquareMore className="w-4 h-4 text-white" />
          </div>
          <div 
            className={`py-3 px-4 rounded-lg max-w-[80%] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            style={{ borderRadius: `${Math.max(8, borderRadius - 2)}px` }}
          >
            <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Of course! I'd be happy to help you with information about our services. What specific aspect are you interested in learning more about?
            </p>
          </div>
        </div>
      </div>
      
      {/* Input Area */}
      <div 
        className={`p-3 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        style={{ 
          borderBottomLeftRadius: isFullscreen ? 0 : `${borderRadius}px`,
          borderBottomRightRadius: isFullscreen ? 0 : `${borderRadius}px`
        }}
      >
        <div className="flex items-center">
          <input 
            type="text" 
            placeholder={placeholderText}
            className={`flex-1 py-2 px-3 text-sm rounded-md border outline-none ${
              darkMode 
                ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400' 
                : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-300'
            }`}
          />
          <button  
            title="Send"
            className="ml-2 p-2 rounded-md"
            style={{ 
              backgroundColor: primaryColor,
              borderRadius: `${Math.max(6, borderRadius - 4)}px` 
            }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Minimized Bubble Preview */}
      {!isFullscreen && (
        <div 
          className="absolute -bottom-16 right-0"
          style={{ 
            width: '60px',
            height: '60px',
            borderRadius: '30px',
            backgroundColor: primaryColor,
            boxShadow: shadow !== 'none' ? '0 4px 20px rgba(0, 0, 0, 0.15)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MessageSquareMore className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
};

export default WidgetPreview;
