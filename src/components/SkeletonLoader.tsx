interface ISkeletonLoaderProps {
  type: 'table' | 'card' | 'detail';
  count?: number;
}

export const SkeletonLoader = ({ type, count = 1 }: ISkeletonLoaderProps) => {
  if (type === 'table') {
    return (
      <div className="w-full overflow-x-auto rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="px-6 py-3.5"><div className="h-2.5 w-10 rounded shimmer" /></th>
              <th className="px-6 py-3.5"><div className="h-2.5 w-14 rounded shimmer" /></th>
              <th className="px-6 py-3.5 hidden lg:table-cell"><div className="h-2.5 w-16 rounded shimmer" /></th>
              <th className="px-6 py-3.5"><div className="h-2.5 w-6 rounded shimmer" /></th>
              <th className="px-6 py-3.5"><div className="h-2.5 w-10 rounded shimmer" /></th>
              <th className="px-6 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: count }).map((_, i) => {
              return (
                <tr key={i} className="h-[56px] border-b border-[var(--color-border-subtle)] last:border-b-0">
                  <td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full shrink-0 shimmer" /><div className="flex flex-col gap-1.5"><div className="h-3.5 w-28 rounded shimmer" /><div className="h-2.5 w-10 rounded shimmer" /></div></div></td>
                  <td className="px-6 py-3"><div className="flex flex-col gap-1.5"><div className="h-3 w-36 rounded shimmer" /><div className="h-2.5 w-24 rounded shimmer" /></div></td>
                  <td className="px-6 py-3 hidden lg:table-cell"><div className="flex flex-col gap-1.5"><div className="h-3 w-32 rounded shimmer" /><div className="h-2.5 w-20 rounded shimmer" /></div></td>
                  <td className="px-6 py-3"><div className="h-3 w-6 rounded shimmer" /></td>
                  <td className="px-6 py-3"><div className="h-5 w-14 rounded-[var(--radius-sm)] shimmer" /></td>
                  <td className="px-6 py-3 text-right"><div className="flex justify-end gap-2"><div className="h-6 w-6 rounded-[var(--radius-sm)] shimmer" /><div className="h-6 w-6 rounded-[var(--radius-sm)] shimmer" /><div className="h-6 w-6 rounded-[var(--radius-sm)] shimmer" /></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => {
          return (
            <div key={i} className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] overflow-hidden">
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-center gap-3.5"><div className="w-11 h-11 rounded-full shimmer shrink-0" /><div className="flex flex-col gap-1.5 flex-1"><div className="h-4 w-3/4 rounded shimmer" /><div className="h-2.5 w-1/2 rounded shimmer" /></div></div>
                <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--color-border-subtle)]"><div className="h-3 w-4/5 rounded shimmer" /><div className="h-3 w-2/3 rounded shimmer" /><div className="h-3 w-3/4 rounded shimmer" /></div>
              </div>
              <div className="h-10 border-t border-[var(--color-border)] shimmer" />
            </div>
          );
        })}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-10">
        <div className="flex items-center gap-6 pb-8 border-b border-[var(--color-border)]">
          <div className="w-20 h-20 rounded-full shimmer shrink-0" />
          <div className="space-y-3 flex-1"><div className="h-7 w-48 rounded shimmer" /><div className="h-4 w-64 rounded shimmer" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, si) => {
            return (
              <div key={si} className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] p-7 shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--color-border-subtle)]"><div className="w-8 h-8 rounded-[var(--radius-md)] shimmer" /><div className="h-4 w-28 rounded shimmer" /></div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, ri) => {
                    return <div key={ri} className="flex justify-between items-center"><div className="h-3 w-20 rounded shimmer" /><div className="h-3 w-32 rounded shimmer" /></div>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return undefined;
};
