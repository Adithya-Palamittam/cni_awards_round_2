
const ThankYou = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl text-center">
        <img src="/logo.png" alt="TP Awards Logo" className="mx-auto mb-4 w-[16rem] h-[16rem] object-contain" />
          

          {/* Mobile Layout */}
          <div className="block md:hidden">
            <h1 className="text-2xl text-black font-bold mb-4">Thank you for voting</h1>
            <p className="text-base text-gray-700 mb-6">
              Your votes are confidential and secure and will crown India's top 50 restaurants of the year. You can now close this window
            </p>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block space-y-6">
            <h1 className="text-4xl font-bold text-black">Thank you for voting</h1>
            <p className="text-xl text-gray-700 pb-8 px-24">
              Your votes are confidential and
 secure and will crown India’s Top
 50 restaurants of the year. You
 can now close this window
            </p>

          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black text-white text-center py-3 text-xs md:fixed md:bottom-0 md:left-0 md:right-0">
        <p className="text-sm">© 2025 Condé Nast India</p>
      </footer>
    </div>
  );
};

export default ThankYou;
