import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { PropsWithChildren } from "react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    gql,
    useQuery,
} from "@apollo/client";
import Head from "next/head";
import { UrlIcon } from "../components/icons";
import { LoginIcon, LogoutIcon } from "../components/icons";

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL,
    cache: new InMemoryCache(),
    credentials: "include",
});

export const IS_LOGGED = gql`
    query isLogged {
        isLogged
    }
`;

function Layout({ children }: PropsWithChildren<{}>) {
    const { loading, error, data } = useQuery(IS_LOGGED);
    const showLogin = data?.isLogged == false;

    // need to use == here

    return (
        <div className="bg-zinc-50 h-screen overflow-y-auto">
            <div className="flex flex-col">
                <nav className="bg-zinc-100 p-2 flex sticky top-0 z-20">
                    <UrlIcon url="/">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-10 h-7"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            />
                        </svg>
                    </UrlIcon>
                    <div className="ml-auto flex space-x-3">
                        {!error && !loading && (
                            <>
                                <UrlIcon url={showLogin ? "/login" : "/logout"}>
                                    {showLogin ? <LoginIcon /> : <LogoutIcon />}
                                </UrlIcon>

                                <UrlIcon url="/polls">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-10 h-7"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                                        />
                                    </svg>
                                </UrlIcon>
                            </>
                        )}
                    </div>
                </nav>
                <main>{children}</main>
            </div>
        </div>
    );
}

function App({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
                />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ApolloProvider>
    );
}

export default App;
