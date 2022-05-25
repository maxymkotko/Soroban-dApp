import axios from 'axios';
import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
// TODO: Use the SDK
// import * as StellarSdk from 'stellar-sdk';
import * as StellarBase from 'stellar-base';

const Home: NextPage = () => {
  const [value, setValue] = React.useState<any>(null);
  
  React.useEffect(() => {
    (async () => {
      let url = 'http://localhost:3000/api/horizon';
      // const server = new StellarSdk.Server(url, { allowHttp: true });
      const contractOwner = 'GDUT3U3X5RID2KKXBF7GGANYH4UT3RUT4Y5KLLGHTAIOJT67UZUNQ4Y2';
      const contractId = 1;

      const args: StellarBase.xdr.ScVal[] = [
        StellarBase.xdr.ScVal.scvPosI64(
          StellarBase.xdr.Int64.fromString("1")
        )
      ];
      const response = await axios.post(url+'/rpc', {
        id: 1,
        method: "call",
        params: {
          contract: `${contractOwner}:${contractId}`,
          func: "invoke",
          xdr: StellarBase.xdr.ScVec.toXDR(args).toString('base64'),
        }
      });
      let parsed = response.data?.result ? {
        result: StellarBase.xdr.ScVal.fromXDR(response.data.result, 'base64').posI64()
      } : response.data;
      setValue(parsed);
    })();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {!value ? (
          <div>Loading...</div>
        ) : value.result ? (
          <div>Result: {JSON.stringify(value.result)}</div>
        ) : (
          <div>Error: {value.error}</div>
        )}
      </main>
    </div>
  )
}

export default Home
