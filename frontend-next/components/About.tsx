export default function About() {
  return (
    <section
      id="about"
      className="relative py-28 bg-gradient-to-r from-blue-700 to-blue-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

        {/* Left: Story */}
        <div>
          <h2 className="text-4xl font-extrabold mb-6">
            About Sonu Monu
          </h2>

          <p className="text-lg text-blue-100 mb-6 leading-relaxed">
            Sonu Monu is more than just a clothing store — it’s a place where
            style, comfort, and affordability come together for every generation.
          </p>

          <p className="text-lg text-blue-100 leading-relaxed">
            From everyday wear to special occasions, we carefully curate our
            collections to ensure premium quality, durability, and timeless design
            for men, women, and kids.
          </p>
        </div>

        {/* Right: Business Info Card */}
        <div className="bg-white text-gray-900 rounded-3xl p-10 shadow-2xl">

          <h3 className="text-2xl font-bold mb-6 text-blue-700">
            Store Information
          </h3>

          <div className="space-y-4 text-gray-700">
            <p>📍 <strong>Address:</strong><br />
              Sonu Monu Clothing Store<br />
              Fashion Street, Main Market Road<br />
              Tamil Nadu, India – 600001
            </p>

            <p>📞 <strong>Phone:</strong> +91 98765 43210</p>
            <p>📧 <strong>Email:</strong> support@sonumonu.com</p>
            <p>🕒 <strong>Hours:</strong> Mon – Sat, 10 AM – 9 PM</p>
          </div>
        </div>

      </div>
    </section>
  );
}
