const testimonials = [
  {
    name: 'María G.',
    location: 'Ciudad de México',
    text: 'No podía creer que algo así existiera. Apliqué lo que enseña y en menos de 30 días vi resultados que no había logrado en años.',
    stars: 5,
  },
  {
    name: 'Carlos R.',
    location: 'Bogotá',
    text: 'Soy completamente honesto: era escéptico. Pero lo probé y lo que pasó después me dejó sin palabras. Vale cada segundo.',
    stars: 5,
  },
  {
    name: 'Luisa M.',
    location: 'Lima',
    text: 'Lo que más me sorprendió es lo simple que es cuando alguien te lo explica de esta manera. Por fin entendí el juego.',
    stars: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-black mb-3">
          Lo que dicen quienes ya lo aplicaron
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Personas reales. Resultados reales.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="border-gradient rounded-2xl p-6 bg-white/2 hover:bg-white/5 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <span key={s} className="text-brand-gold text-lg">★</span>
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
