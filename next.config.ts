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
    ];
  },
};

export default nextConfig;
