export const chatConfig = {
  colors: {
    primary: '#4B0082',
    secondary: '#DAA520',
    background: 'from-gray-900/95 to-[#4B0082]/95',
    text: {
      primary: '#FFFFFF',
      secondary: '#D3D3D3',
      accent: '#DAA520',
    },
    message: {
      bot: {
        bg: 'bg-purple-900/50',
        border: 'border border-purple-700/40',
      },
      user: {
        bg: 'bg-[#DAA520]/80',
        text: 'text-gray-900',
      },
    },
  },
  animations: {
    transition: 'transition-all duration-300 ease-in-out',
    transform: 'transform hover:scale-[1.02]',
    bounce: 'animate-bounce',
    chat: {
      enter: 'chat-enter',
      enterActive: 'chat-enter-active',
      exit: 'chat-exit',
      exitActive: 'chat-exit-active',
    },
  },
  layout: {
    wrapper: 'fixed bottom-0 right-0 flex flex-col items-end p-5 z-[1000] pointer-events-none',
    container: 'relative flex flex-col items-end gap-4 w-full pointer-events-auto',
    chatButton: {
      wrapper: 'absolute bottom-0 right-0 z-10',
      dimensions: 'w-14 h-14 flex items-center justify-center',
    },
    chatWindow: {
      desktop: 'w-[400px] h-[500px] rounded-lg shadow-2xl overflow-hidden',
      mobile: 'fixed inset-0',
    },
    messages: 'flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent',
    header: 'flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#4B0082] to-[#DAA520] shadow-md',
    footer: 'p-4 border-t border-purple-700/30 bg-gradient-to-b from-transparent to-purple-900/50 backdrop-blur-sm',
  },
  components: {
    button: {
      base: 'rounded-full shadow-lg transition-all duration-300 ease-in-out backdrop-blur-sm',
      gradient: {
        open: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
        closed: 'bg-gradient-to-r from-[#4B0082] to-[#DAA520] hover:from-[#DAA520] hover:to-[#4B0082]',
      },
    },
    input: {
      base: 'w-full p-3 rounded-lg bg-purple-900/40 border border-purple-700/30 text-white placeholder-gray-400/70',
      focus: 'focus:outline-none focus:ring-2 focus:ring-[#DAA520] focus:border-transparent',
    },
    form: {
      container: 'space-y-4 p-4',
      field: 'w-full',
      error: 'text-red-500 text-sm mt-1',
      label: 'text-white/90 text-sm font-medium mb-1',
      submit: 'w-full bg-gradient-to-r from-[#4B0082] to-[#DAA520] text-white py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md',
    },
    message: {
      container: 'flex mb-4 gap-2 items-end',
      content: 'p-3 rounded-lg max-w-[80%] break-words shadow-sm',
    },
  },
  keyframes: `
    .chat-enter {
      opacity: 0;
      transform: scale(0.9);
    }
    .chat-enter-active {
      opacity: 1;
      transform: scale(1);
      transition: opacity 300ms, transform 300ms;
    }
    .chat-exit {
      opacity: 1;
      transform: scale(1);
    }
    .chat-exit-active {
      opacity: 0;
      transform: scale(0.9);
      transition: opacity 300ms, transform 300ms;
    }
  `,
}