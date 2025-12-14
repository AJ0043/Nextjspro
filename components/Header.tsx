export default function Header({ title }: { title: string }) {
  return (
    <div className="w-full py-4 px-6 bg-white shadow-sm border-b flex justify-between items-center">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-1 rounded-lg"
        />
        <img
          src="/avatar.png"
          alt="User"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </div>
  );
}
