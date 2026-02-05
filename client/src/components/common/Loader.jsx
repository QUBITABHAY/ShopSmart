import { cn } from "../../lib/utils";

function Loader({ size = "md", className }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-gray-200 border-t-primary",
          sizeClasses[size],
        )}
      />
    </div>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="xl" />
    </div>
  );
}

function InlineLoader({ text = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Loader size="sm" />
      <span>{text}</span>
    </div>
  );
}

export { Loader, PageLoader, InlineLoader };
export default Loader;
