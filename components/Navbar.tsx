const Navbar = () => {
  return (
    <div className="shadow px-4 py-2 flex justify-between items-center bg-amber-300">
      <h1 className="text-xl font-bold">Navbar</h1>
      <div>
        <button className="bg-blue-500 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </div>
  );
};
export default Navbar;
