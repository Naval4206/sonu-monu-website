export default function WhyChooseUs() {
  return (
    <section className="w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose Sonu Monu
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Trusted by local customers for quality products and honest service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">👕</div>
            <h3 className="text-lg font-semibold text-gray-900">
              Quality Clothing
            </h3>
            <p className="mt-3 text-gray-600">
              We carefully select fabrics that are comfortable, durable, and
              suitable for daily wear.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-lg font-semibold text-gray-900">
              Affordable Prices
            </h3>
            <p className="mt-3 text-gray-600">
              Stylish fashion at fair prices so everyone can shop confidently.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-lg font-semibold text-gray-900">
              Trusted Local Store
            </h3>
            <p className="mt-3 text-gray-600">
              A well-known store in Dhanbad serving customers with honesty and
              care.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
