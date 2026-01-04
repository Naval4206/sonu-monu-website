export default function WhyChooseUs() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-24">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Why Customers Choose <span className="text-blue-700">Sonu Monu</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We focus on what truly matters — quality, comfort, and value.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="grid md:grid-cols-3 gap-14">

          <div className="group relative p-10 rounded-3xl bg-blue-50 hover:bg-blue-700 transition">
            <h3 className="text-xl font-bold text-blue-700 group-hover:text-white mb-4">
              Premium Quality
            </h3>
            <p className="text-gray-600 group-hover:text-blue-100">
              Carefully selected fabrics and superior craftsmanship.
            </p>
          </div>

          <div className="group relative p-10 rounded-3xl bg-blue-50 hover:bg-blue-700 transition">
            <h3 className="text-xl font-bold text-blue-700 group-hover:text-white mb-4">
              Fashion for All Ages
            </h3>
            <p className="text-gray-600 group-hover:text-blue-100">
              Clothing designed for kids, teens, and adults.
            </p>
          </div>

          <div className="group relative p-10 rounded-3xl bg-blue-50 hover:bg-blue-700 transition">
            <h3 className="text-xl font-bold text-blue-700 group-hover:text-white mb-4">
              Affordable Pricing
            </h3>
            <p className="text-gray-600 group-hover:text-blue-100">
              Premium fashion without premium prices.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
