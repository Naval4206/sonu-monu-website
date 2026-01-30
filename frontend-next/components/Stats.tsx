export default function Stats() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

        <div>
          <h3 className="text-3xl font-bold text-blue-600">500+</h3>
          <p className="mt-1 text-gray-600 text-sm">Products</p>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-blue-600">1K+</h3>
          <p className="mt-1 text-gray-600 text-sm">Customers</p>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-blue-600">50+</h3>
          <p className="mt-1 text-gray-600 text-sm">Brands</p>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
          <p className="mt-1 text-gray-600 text-sm">Support</p>
        </div>

      </div>
    </section>
  );
}
