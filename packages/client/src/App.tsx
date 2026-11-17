
import ChatBot from './components/ChatBot'

const App = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-100 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto flex h-[calc(100vh-2rem)] max-w-5xl items-center justify-center'>
        <div className='h-full w-full overflow-hidden rounded-[28px] border border-white/70 bg-white/75 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur-sm'>
          <ChatBot />
        </div>
      </div>
    </div>
  )
}

export default App