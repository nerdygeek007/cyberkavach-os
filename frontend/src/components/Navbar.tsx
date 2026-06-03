export default function Navbar() {
    return (
      <div className="h-20 border-b border-green-500/20 bg-[#111827] px-8 flex items-center justify-between">
  
        <div>
  
          <h2 className="text-white text-2xl font-bold">
            Dashboard
          </h2>
  
          <p className="text-gray-400 text-sm">
            CyberKavach Management Console
          </p>
  
        </div>
  
        <div className="flex items-center gap-4">
  
          <div className="text-right">
            <p className="text-white">
              Maharshi Trivedi
            </p>
  
            <p className="text-green-400 text-sm">
              ACTIVE
            </p>
          </div>
  
        </div>
  
      </div>
    );
  }