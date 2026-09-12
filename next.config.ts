import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The A2P 10DLC registration points a carrier reviewer at whatever legal URL
  // is on file, and /privacy-policy and /terms-of-service are the conventional
  // spellings. Neither was a route here, so both 404'd. These keep the reviewer
  // on the policy whichever form was submitted. Redirects are checked before
  // the filesystem, so the real /privacy and /terms routes are unaffected.
  async redirects() {
    return [
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },

      // Short aliases for print and vehicle decals, where a full
      // /services/rust-removal-charleston is too long to read off a truck.
      //
      // POLICY: these paths are for print and vehicle decals only. They are
      // never to be linked from the web. Anything linked publicly, from this
      // site or from anywhere else, uses the canonical /services/ URL.
      //
      // That rule is what settles the status code. permanent: false serves a
      // 307, which browsers do not cache, so an alias can be re-pointed later
      // without stranding anyone who already followed the old one. The usual
      // argument for a 308 is that search engines only consolidate link equity
      // through a permanent redirect, and that argument does not apply while
      // nothing links here. If one of these ever does get linked publicly,
      // that breaks the policy above, and the status code for that one path
      // needs revisiting at the same time.
      //
      // Query strings survive the hop. Next.js passes the incoming query
      // through to the destination, and none of these destinations carry a
      // query of their own to collide with, so /rust?utm_source=truck arrives
      // as /services/rust-removal-charleston?utm_source=truck.
      { source: '/rust', destination: '/services/rust-removal-charleston', permanent: false },
      // Paint has no page of its own, by decision rather than by omission.
      // Splitting it would divide equity on a domain with no authority yet, so
      // it stays a section of the rust page and this alias deep links straight
      // to it. A door hanger about paint that lands at the top of a page
      // titled "Rust & Paint Removal" reads as the wrong page; landing on the
      // paint section itself does not. Revisit the split in December 2026,
      // once Search Console has three months of query data.
      {
        source: '/paint',
        destination: '/services/rust-removal-charleston#paint-removal',
        permanent: false,
      },
      { source: '/brick', destination: '/services/brick-cleaning-charleston', permanent: false },
      { source: '/marine', destination: '/services/marine-cleaning-charleston', permanent: false },
      { source: '/graffiti', destination: '/services/graffiti-removal-charleston', permanent: false },
      { source: '/ironwork', destination: '/services/historic-ironwork-restoration-charleston', permanent: false },
    ];
  },
};

export default nextConfig;
