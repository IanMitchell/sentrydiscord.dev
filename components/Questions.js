export function QuestionExternalLink({ href, children }) {
  return (
    <a className="underline text-white" href={href}>
      {children}
    </a>
  );
}

export default function Question({ title, children }) {
  return (
    <div>
      <dt className="text-lg leading-6 font-medium text-white">{title}</dt>
      <dd className="mt-2 text-base text-indigo-200">{children}</dd>
    </div>
  );
}
