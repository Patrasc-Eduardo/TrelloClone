export default function ListColumn({ name, children }) {
    return (
        <div className="p-4 bg-gray-200 rounded-md shadow w-64">
            <h3 className="font-bold text-xl mb-2">{name}</h3>
            {children}
        </div>
    );
}
