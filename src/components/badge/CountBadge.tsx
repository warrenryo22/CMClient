export interface CountBadgeProps {
  count?: number;
}

function CountBadge({ count = 0 }: CountBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className="absolute -bottom-1 -right-1 z-10 inline-flex
                 items-center justify-center rounded-full bg-red-600
                 px-1.5 text-xs font-semibold text-white leading-none
                 select-none w-fit"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default CountBadge;
