import { forwardRef } from "react";
import clsx from "clsx";

export const InputField = forwardRef(function InputField(
  { label, error, className, type = "text", ...props },
  ref
) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        ref={ref}
        type={type}
        className={clsx(
          "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20",
          className
        )}
        {...props}
      />
      {error ? <span className="mt-1.5 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
});
