export default function Stat({ title, value }) {
  return (
    <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
      <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
        {title}
      </dt>
      <dd className="order-1 text-5xl font-extrabold text-indigo-600">
        {value.toLocaleString()}
      </dd>
    </div>
  );
}
