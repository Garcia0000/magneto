'use client'

import { useState } from 'react'

const faqs = [
  {
    q: '¿Necesito experiencia previa?',
    a: 'No. El sistema está diseñado para funcionar incluso si partes desde cero. Si puedes seguir instrucciones paso a paso, puedes aplicarlo.',
  },
  {
    q: '¿Cuánto tiempo necesito invertir?',
    a: 'Los primeros resultados pueden verse en poco tiempo si aplicas lo que se enseña. No se requieren horas interminables al día.',
  },
  {
    q: '¿Esto funciona en mi país?',
    a: 'Sí. El método ha sido aplicado exitosamente en México, Colombia, Argentina, Perú, España y muchos otros países de habla hispana.',
  },
  {
    q: '¿Qué pasa si no me funciona?',
    a: 'Tienes una garantía de satisfacción. Si aplicas el método y no obtienes resultados, el equipo está disponible para ayudarte.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 bg-white/2">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-black mb-12">
          Preguntas frecuentes
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-gradient rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-base pr-4">{faq.q}</span>
                <span
                  className={`text-brand-orange text-xl flex-shrink-0 transition-transform ${
                    open === i ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>

              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
