const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
      <ul className="space-y-2">
        <li className="hover:bg-gray-700 p-2 rounded">Home</li>
        <li className="hover:bg-gray-700 p-2 rounded">Investment</li>
        <li className="hover:bg-gray-700 p-2 rounded">Trending Stocks</li>
        <li className="hover:bg-gray-700 p-2 rounded">Leaderboard</li>
        <li className="hover:bg-gray-700 p-2 rounded">Analytics</li>
        <li className="hover:bg-gray-700 p-2 rounded">Settings</li>
      </ul>
    </div>
  );
};
export default Sidebar;
