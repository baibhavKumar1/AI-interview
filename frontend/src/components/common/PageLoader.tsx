export const PageLoader = () => {
  return (
    <div className="fixed z-50 flex items-center justify-center h-screen w-screen bg-slate-700 bg-opacity-5">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-primary_green animate-spin"></div>
      </div>
    </div>
  );
};
