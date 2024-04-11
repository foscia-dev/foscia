import { useColorMode } from '@docusaurus/theme-common';
import { useMemo } from 'react';
import styles from './styles.module.css';

export default function PlaygroundIframe({ title, id, options }) {
  const { colorMode } = useColorMode();

  const url = useMemo(() => `https://stackblitz.com/edit/${id}?${new URLSearchParams({
    theme: colorMode === 'dark' ? 'dark' : 'light',
    embed: '1',
    hideNavigation: '1',
    ...options,
  })}`, [colorMode]);

  return <iframe
    title={title}
    src={url}
    className={styles.playgroundIframe}
    loading="lazy"
    width="900"
    height="600"
  ></iframe>;
}
