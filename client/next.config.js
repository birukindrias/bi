/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,

  images: {
    domains: ['i.pravatar.cc', 'pbs.twimg.com', 'localhost'],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'http://localhost:4000/api/admin',
        permanent: true,
      },
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
