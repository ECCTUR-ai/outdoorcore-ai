import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  headers: string[];
}

export function Table({
  headers,
  children,
  className = '',
  ...props
}: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm bg-white dark:bg-slate-950">
      <table className={`w-full text-left border-collapse ${className}`} {...props}>
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10">
            {headers.map((h, idx) => (
              <th
                key={idx}
                className="px-5 py-3 text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider select-none"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
          {children}
        </tbody>
      </table>
    </div>
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export function TableRow({ children, className = '', ...props }: TableRowProps) {
  return (
    <tr className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors duration-150 ${className}`} {...props}>
      {children}
    </tr>
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ children, className = '', ...props }: TableCellProps) {
  return (
    <td className={`px-5 py-3.5 text-xs font-semibold leading-relaxed align-middle ${className}`} {...props}>
      {children}
    </td>
  );
}
