const STEPS = [
  "Clean the chain thoroughly before application.",
  "Shake the bottle well.",
  "Apply lubricant evenly while rotating the chain.",
  "Allow a few minutes for penetration.",
  "Wipe off excess lubricant before riding.",
]

export default function HowToUseTab() {
  return (
    <ol className="space-y-4">
      {STEPS.map((step, index) => (
        <li
          key={step}
          className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            {index + 1}
          </div>

          <p className="pt-2 text-slate-700">
            {step}
          </p>
        </li>
      ))}
    </ol>
  )
}