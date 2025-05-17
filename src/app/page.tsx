import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900/10 to-black">
      {/* Navigation */}
      <header className="bg-black bg-opacity-60 backdrop-blur-md border-b border-purple-900/30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
              ChainAtlas Dashboard
            </h1>
          </div>
          <nav className="flex items-center space-x-6">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-300"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 flex-1">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex flex-col gap-8 lg:w-1/2 animate-fade-in-up">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
              <span className="text-white">Manage Your </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
                Web3
              </span>
              <span className="text-white"> Projects with Ease</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Track events, earn badges, and connect with the community in our
              comprehensive dashboard.
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium shadow-lg shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-lg bg-transparent border border-purple-500 text-gray-300 hover:text-white hover:border-purple-400 font-medium transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative h-[400px] w-full">
              {/* Glowing background effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur-lg opacity-75 animate-pulse-slow"></div>

              {/* Main card */}
              <div className="relative h-full w-full bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 shadow-2xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-fuchsia-600 rounded-full filter blur-3xl opacity-20"></div>

                <div className="relative h-full flex flex-col items-center justify-center text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Dashboard Preview
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Interactive analytics, event management, and community
                    engagement in one platform
                  </p>

                  {/* Mock dashboard UI elements */}
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="h-16 bg-black bg-opacity-40 rounded-lg border border-purple-500/20 p-3 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 mr-2"></div>
                      <div className="h-2 w-12 bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="h-16 bg-black bg-opacity-40 rounded-lg border border-purple-500/20 p-3 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 mr-2"></div>
                      <div className="h-2 w-12 bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="h-16 bg-black bg-opacity-40 rounded-lg border border-purple-500/20 p-3 flex items-center justify-center col-span-2">
                      <div className="h-2 w-36 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-black bg-opacity-60">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards with modern Web3 styling */}
            {[
              {
                title: "Event Management",
                description:
                  "Create, manage, and participate in community events with built-in attendance tracking.",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                gradient: "from-violet-600 to-blue-600",
              },
              {
                title: "Badge System",
                description:
                  "Reward community engagement with badges that showcase achievements and contributions.",
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                gradient: "from-fuchsia-600 to-pink-600",
              },
              {
                title: "Web3 Integration",
                description:
                  "Connect your wallet for seamless authentication and participate in the community HexMap.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                gradient: "from-cyan-600 to-teal-600",
              },
            ].map((feature, index) => (
              <div key={index} className="relative group">
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative bg-gray-900 rounded-xl p-6 h-full border border-purple-900/30 backdrop-blur-sm">
                  <div
                    className="mb-4 p-2 bg-gradient-to-r rounded-full w-12 h-12 flex items-center justify-center bg-opacity-50"
                    // style={{
                    //   backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    //   "--tw-gradient-from": `#8b5cf6`,
                    //   "--tw-gradient-to": `#d946ef`,
                    // }}
                    // as
                    // any
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={feature.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-600 rounded-full filter blur-3xl opacity-10"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Join our Web3 community platform today and start managing your
            projects, events, and engagement in one place.
          </p>
          <Link
            href="/register"
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold shadow-lg shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-90 py-12 border-t border-purple-900/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
                ChainAtlas
              </h2>
              <p className="text-gray-500 mt-2">
                Empowering Web3 communities through engagement
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="font-semibold mb-2 text-white">Platform</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-500 hover:text-violet-400 transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-500 hover:text-violet-400 transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-500 hover:text-violet-400 transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-500 hover:text-violet-400 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-purple-900/30 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} ChainAtlas. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
