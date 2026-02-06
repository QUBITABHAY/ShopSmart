import { cn } from "../../lib/utils";

function Container({ children, className, size = "default" }) {
  const sizeClasses = {
    sm: "max-w-3xl",
    default: "max-w-7xl",
    lg: "max-w-screen-2xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Container;
