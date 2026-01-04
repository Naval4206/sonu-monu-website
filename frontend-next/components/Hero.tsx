export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-32">
      
      {/* Decorative Blur */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">

        <span className="inline-block mb-6 px-5 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide">
          Sonu Monu • Modern Fashion Store
        </span>

        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-8">
          Redefining <br />
          <span className="text-blue-700">Everyday Fashion</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-14">
          Premium, comfortable, and affordable clothing for men, women, and kids —
          designed to match your lifestyle.
        </p>

        <a
          href="/products"
          className="inline-flex items-center gap-2 px-12 py-5 rounded-2xl bg-blue-700 text-white text-lg font-semibold hover:bg-blue-800 shadow-xl"
        >
          Explore Collection →
        </a>
      </div>
    </section>
  );
}
