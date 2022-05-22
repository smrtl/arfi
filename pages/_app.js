import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Arfi</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
