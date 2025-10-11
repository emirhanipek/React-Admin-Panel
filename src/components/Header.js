const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Welcome Message */}
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-semibold text-gray-800">
            Hoşgeldin Senka Reklam
          </h1>
        </div>

        {/* System Status */}
        <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <span className="text-sm font-medium text-green-700">Sistem Aktif</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
