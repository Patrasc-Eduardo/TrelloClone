export default function BoardCard({ name, onClick }) {
    return (
        <div
            className="p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer"
            onClick={onClick}
        >
            <h2 className="text-lg font-semibold">{name}</h2>
        </div>
    );
}
