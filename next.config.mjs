/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:['localhost','flagcdn.com','c7.alamy.com','transports-express-caraibes','c7.alamy.com','cdn.britannica.com','i.pinimg.com','rivaroroaming.com','www.rivaroroaming.com']
    },
    experimental: {
        turbo: false, // <--- disable Turbopack
    },
};

export default nextConfig;
