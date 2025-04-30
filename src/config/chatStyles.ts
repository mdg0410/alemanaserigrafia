export const chatConfig = {
  colors: {
    primary: '#4B0082',
    secondary: '#DAA520',
    background: 'from-gray-900 to-[#4B0082]',
    text: {
      primary: '#FFFFFF',
      secondary: '#D3D3D3',
      accent: '#DAA520',
    },
    message: {
      bot: {
        bg: 'bg-purple-900/40',
        border: 'border-purple-700/30',
      },
      user: {
        bg: 'bg-[#DAA520]/90',
      },
    },
  },
  animations: {
    transition: 'transition-all duration-300',
    transform: 'transform hover:scale-[1.02]',
    slideUp: 'animate-slideUp',
    bounce: 'animate-bounce',
  },
  layout: {
    container: 'fixed bottom-5 right-5 z-50',
    chatWindow: 'w-80 h-96 rounded-lg shadow-2xl',
    messages: 'flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent',
  },
  components: {
    button: {
      base: 'group relative p-4 rounded-full shadow-lg',
      gradient: {
        open: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
        closed: 'bg-gradient-to-r from-[#4B0082] to-[#DAA520] hover:from-[#DAA520] hover:to-[#4B0082]',
      },
    },
    input: 'flex-1 p-2 rounded-lg bg-purple-900/40 border border-purple-700/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DAA520]',
  },
}