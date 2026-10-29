import Link from 'next/link';
import {
  BoltIcon,
  CleatIcon,
  IronScrollIcon,
  RailingIcon,
  SprayIcon,
  StorefrontIcon,
  UrnIcon,
} from '@/app/components/icons';
import { pageMetadata } from '@/lib/seo';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const metadata = pageMetadata({
  title: 'Services',
  description:
    "Surface restoration in Charleston, SC. Rust and paint off metal, masonry and concrete, plus graffiti, oxidation and stains, with a laser and a test spot first. Wood is restored by hand.",
  path: '/services',
});

type Service = {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  href: string;
  live: boolean;
};

const services: Service[] = [
  {
    Icon: BoltIcon,
    title: 'Rust & Paint Removal',
    desc: 'Rust, old paint and coatings off iron and steel, plus weld tint and tea staining on stainless. No sandblasting or chemical strippers, test spot first.',
    href: '/services/rust-removal-charleston',
    live: true,
  },
  {
    Icon: IronScrollIcon,
    title: 'Historic Restoration',
    desc: "Iron and steel gates, railings and church fences in Charleston's historic neighborhoods, test spot first. Pre-1978 paint needs a negative lead test.",
    href: '/services/historic-ironwork-restoration-charleston',
    live: true,
  },
  {
    Icon: CleatIcon,
    title: 'Marine Cleaning',
    desc: 'Stainless rails and cleats, bronze fittings and steel trailer parts, cleaned on land or on the hard. Metal only, never hulls, docks or boats in the water.',
    href: '/services/marine-cleaning-charleston',
    live: true,
  },
  {
    Icon: RailingIcon,
    title: 'Vacation Rental Restoration',
    desc: "Salt-rusted railings, gates and outdoor furniture at Isle of Palms, Sullivan's Island and Folly Beach rentals, scheduled between guests. Recurring service for property managers.",
    href: '/services/vacation-rental-cleaning-charleston',
    live: true,
  },
  {
    Icon: SprayIcon,
    title: 'Graffiti Removal',
    desc: 'Dark spray-paint tags on hard, non-historic brick, block and metal, test patch first. Silver paint on masonry is not a fit, and red or yellow may leave a stain.',
    href: '/services/graffiti-removal-charleston',
    live: true,
  },
  {
    Icon: UrnIcon,
    title: 'Antique & Hardware Restoration',
    desc: 'Rust and old paint off antique hardware, vintage tools, cast iron and classic car parts, with a test area first to set how much patina stays.',
    href: '/services/antique-restoration-charleston',
    live: true,
  },
  {
    Icon: StorefrontIcon,
    title: 'Commercial Exteriors',
    desc: 'Steel railings, gates, security grates and patio furniture at Charleston storefronts and restaurants, scheduled around your hours with a closed-off work area.',
    href: '/services/commercial-exterior-cleaning-charleston',
    live: true,
  },
];

const cardBase =
  'block w-full md:w-[calc(50%_-_0.75rem)] lg:w-[calc(33.333%_-_1rem)] bg-[#1a3958] border border-[#397774]/20 rounded-lg p-8 hover:border-[#397774]/50 transition-colors group';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            What We Do
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            We take off rust and old paint, along with graffiti, grease, oxidation and stains, from metal, masonry, concrete and boat parts on land. The laser does that work with no sandblasting or chemical strippers, and the dust gets captured and cleaned up. Painted and stained wood is restored by hand with sanders and scrapers, the right tools for the surface.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6">
            {services.map((service) => {
              // Shared inner content for both live and non-live cards.
              const inner = (
                <>
                  <service.Icon className="h-12 w-12 text-[#397774] mb-4" />
                  <h3 className="text-white font-bold text-xl mb-3 group-hover:text-[#397774] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {service.desc}
                  </p>
                  {service.live && (
                    // NOTE: this is a <span>, not a <Link>. The whole card is
                    // already the link, so a nested <Link>/<a> here would be
                    // invalid HTML and can fail to render.
                    <span className="inline-flex items-center gap-1 text-[#397774] font-semibold text-sm group-hover:gap-2 transition-all">
                      Learn more <span aria-hidden="true">→</span>
                    </span>
                  )}
                </>
              );

              return service.live ? (
                <Link
                  key={service.title}
                  href={service.href}
                  className={`${cardBase} cursor-pointer`}
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={service.title}
                  className={`${cardBase} cursor-default`}
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Not sure if we can help? Send it anyway.</h2>
          <p className="text-gray-400 mb-8">
            Send a photo and a short description. If it is work we do, you get a free estimate. If it is not a fit, Tyler still looks at it and, where possible, points you to the right person.
          </p>
          <Link
            href="/quote"
            className="bg-[#397774] text-white px-10 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            Request a Free Quote
          </Link>
        </div>
      </section>

    </div>
  );
}