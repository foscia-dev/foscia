import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import '@fontsource/fira-mono';
import '@fontsource/poppins';
import HomeFeatures from '@site/src/components/HomeFeatures';
import HomeHeader from '@site/src/components/HomeHeader';
import Layout from '@theme/Layout';
import React from 'react';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description={siteConfig.tagline}
    >
      <HomeHeader />
      <main>
        <HomeFeatures />
      </main>
    </Layout>
  );
}
