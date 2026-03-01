import { Loader } from "lucide-react";

function LoadingSpinner({height}) {
  return (
    <div
    style={{ minHeight: height }}
    className="w-full flex justify-center items-center">
      <Loader size={30} className="animate-spin" />
      {/* <img src={spinner} alt="spinner" className="h-20 w-auto animate-spin" style={{ animation: "spin 0.65s linear infinite" }} /> */}
    </div>
  );
}


export default LoadingSpinner;