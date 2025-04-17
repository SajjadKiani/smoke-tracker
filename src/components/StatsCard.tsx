// keeps bundle tiny – no "use client" needed
interface Props {
    label: string;
    value: number | string;
  }
  
  export default function StatsCard({ label, value }: Props) {
    return (
      <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    );
  }
  