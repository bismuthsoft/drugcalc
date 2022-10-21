// src/pages/_app.tsx
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";
import type { AppType } from "next/app";
import type { AppRouter } from "../server/router";
import type { Session } from "next-auth";
import { Layout, Menu } from 'antd'
import Link from 'next/link'
import "../styles/globals.css";
import "../styles/Ingredients.css";
import '../styles/Recipes.css';
import '../styles/Containers.css';

const { Header, Content } = Layout;

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <Layout className="min-h-screen">
                <Header className="header">
                    <Link href="/">
                        <a className="logo hover:text-white">
                            Stack Recipes
                        </a>
                    </Link>
                    <Menu
                        className="header-menu"
                        theme="dark"
                        mode="horizontal"
                        items={[
                            {
                                key: 1,
                                label: <Link href="/recipes"><a>Recipes</a></Link>,
                            },
                            {
                                key: 2,
                                label: <Link href="/ingredients"><a>Ingredients</a></Link>,
                            },
                            {
                                key: 3,
                                label: <Link href="/containers"><a>Containers</a></Link>,
                            },
                        ]}
                    />
                </Header>
                <Layout style={{ padding: '2rem' }}>
                    <Content>
                        <Component {...pageProps} />
                    </Content>
                </Layout>
            </Layout>
        </SessionProvider >
    );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({ url }),
      ],
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },

      // To use SSR properly you need to forward the client's headers to the server
      // headers: () => {
      //   if (ctx?.req) {
      //     const headers = ctx?.req?.headers;
      //     delete headers?.connection;
      //     return {
      //       ...headers,
      //       "x-ssr": "1",
      //     };
      //   }
      //   return {};
      // }
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
