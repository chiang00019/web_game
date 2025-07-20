import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-white border-r">
      <h2 className="text-3xl font-semibold text-gray-800">Admin</h2>
      <div className="flex flex-col justify-between mt-6">
        <aside>
          <ul>
            <li>
              <Link
                href="/admin/games"
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md"
              >
                <span className="mx-4 font-medium">Games</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className="flex items-center px-4 py-2 mt-5 text-gray-600 rounded-md hover:bg-gray-200"
              >
                <span className="mx-4 font-medium">Orders</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/banners"
                className="flex items-center px-4 py-2 mt-5 text-gray-600 rounded-md hover:bg-gray-200"
              >
                <span className="mx-4 font-medium">Banners</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/payments"
                className="flex items-center px-4 py-2 mt-5 text-gray-600 rounded-md hover:bg-gray-200"
              >
                <span className="mx-4 font-medium">Payments</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reports"
                className="flex items-center px-4 py-2 mt-5 text-gray-600 rounded-md hover:bg-gray-200"
              >
                <span className="mx-4 font-medium">Reports</span>
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
