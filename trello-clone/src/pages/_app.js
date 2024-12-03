import { useEffect } from "react";
import "../styles/globals.css";
import posthog from "posthog-js";

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Initialize PostHog with API key and host from environment variables
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_API_KEY, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_API_HOST, // Fetch from environment variable
        });

        // Track page views
        posthog.capture('$pageview');

        return () => {
            // Clean up PostHog instance on component unmount
            posthog.remove(); // Use posthog.remove() to clean up
        };
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;
