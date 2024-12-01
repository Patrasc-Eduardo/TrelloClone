export default function Card({ title, onClick }) {
    return (
        <div
            className="p-2 bg-white shadow rounded mb-2 cursor-pointer hover:bg-gray-50"
            onClick={onClick}
        >
            {title}
        </div>
    );
}
