import { Check } from 'lucide-react'

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
              step.completed ? 'bg-primary-600 text-white' :
              step.active ? 'bg-primary-600 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {step.completed ? <Check className="w-6 h-6" /> : step.number}
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-semibold text-gray-900">{step.title}</p>
              <p className="text-xs text-gray-500">{step.subtitle}</p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-4 transition-all ${
              step.completed ? 'bg-primary-600' : 'bg-gray-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  )
}
