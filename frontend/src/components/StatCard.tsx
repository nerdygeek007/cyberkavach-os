type Props = {
    title: string;
    value: string;
  };
  
  export default function StatCard({
    title,
    value,
  }: Props) {
    return (
      <div className="bg-[#111827] border border-green-500/20 rounded-xl p-6">
  
        <p className="text-gray-400">
          {title}
        </p>
  
        <h2 className="text-4xl font-bold text-green-400 mt-4">
          {value}
        </h2>
  
      </div>
    );
  }