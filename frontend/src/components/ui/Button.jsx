import clsx from "clsx";

export const Button = ({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}) => {
  const variants = {
    primary: "bg-pine text-white hover:bg-pine/90",
    secondary: "bg-ink text-white hover:bg-ink/90",
    soft: "bg-breeze text-ink hover:bg-breeze/80",
    danger: "bg-coral text-white hover:bg-coral/90"
  };

  return (
    <button
      type={type}
      className={clsx(
        "rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
