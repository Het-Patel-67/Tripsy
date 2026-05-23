export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9]">
      <div className="skeleton h-44 w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-3.5 w-1/2" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-4/5" />
      </div>
    </div>
  );
}