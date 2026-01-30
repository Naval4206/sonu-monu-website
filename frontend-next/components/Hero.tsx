export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">

        {/* Badge */}
        <div className="inline-block mb-6">
          <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
            Sonu Monu • Modern Fashion Store
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
          Redefining
          <span className="block text-blue-600">
            Everyday Fashion
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Premium, comfortable, and affordable clothing for men, women,
          and kids — designed to match your lifestyle.
        </p>

        {/* CTA */}
        <div className="mt-10">
          <a
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl text-base md:text-lg font-medium hover:bg-blue-700 transition"
          >
            Explore Collection →
          </a>
        </div>

      </div>
    </section>
  );
}
