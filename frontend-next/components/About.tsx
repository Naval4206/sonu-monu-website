export default function About() {
  return (
    <section
      id="about"
      className="w-full bg-gradient-to-b from-white to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-24">

        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block mb-4 bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
            About Our Store
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Sonu Monu
          </h2>

          <p className="mt-6 text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
            A trusted fashion destination in Dhanbad, known for quality fabrics,
            affordable pricing, and honest service. We serve men, women, and kids
            with collections designed for everyday comfort and style.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Card */}
          <div className="relative bg-white rounded-3xl p-10 shadow-md">

            <div className="absolute -top-5 left-6 bg-blue-600 text-white px-5 py-1 rounded-full text-sm font-medium">
              Store Details
            </div>

            <div className="mt-6 space-y-6 text-gray-700 text-base md:text-lg">

              <div>
                <p className="font-semibold text-gray-900">📍 Address</p>
                <p className="mt-1">
                  Sonu Monu Dresses, <br />
                  Hirapur Hatya Road, Dhanbad <br />
                  JHARKHAND, INDIA - 826007
                </p>
                <a
                  href="https://maps.app.goo.gl/CGeNsnBs9ik6UAUf6"
                  target="_blank"
                  className="inline-block mt-1 text-blue-600 underline"
                >
                  View on Google Maps
                </a>
              </div>

              <div>
                <p className="font-semibold text-gray-900">📞 Phone</p>
                <p className="mt-1">
                  <a href="tel:+919234613219" className="text-blue-600">
                    +91 9234613219
                  </a>
                  ,{" "}
                  <a href="tel:+917004145039" className="text-blue-600">
                    +91 7004145039
                  </a>
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">📧 Email</p>
                <a
                  href="mailto:1988sonumonu@gmail.com"
                  className="text-blue-600"
                >
                  1988sonumonu@gmail.com
                </a>
              </div>

              <div>
                <p className="font-semibold text-gray-900">⏰ Business Hours</p>
                <p className="mt-1 text-gray-600">
                  Monday – Sunday <br />
                  10:00 AM – 9:30 PM
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">🌐 Connect With Us</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <a
                    href="https://www.facebook.com/share/1D76QbZ4XC/"
                    target="_blank"
                    className="text-blue-600 font-medium"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/1988sonumonu?igsh=MXRxeXY1Zm83OWtkZA=="
                    target="_blank"
                    className="text-pink-600 font-medium"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://wa.me/919234613219"
                    target="_blank"
                    className="text-green-600 font-medium"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Map Card */}
          <div className="rounded-3xl overflow-hidden shadow-md border bg-white">
            <iframe
              src="https://www.google.com/maps?q=SONUMONU%20HIRAPUR%20HATYA%20ROAD%20DHANBAD&output=embed"
              width="100%"
              height="100%"
              className="h-[450px] w-full border-0"
              loading="lazy"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}
