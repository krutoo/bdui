import type { ReactNode } from 'react';
import styles from './layout.m.css';

export interface LayoutProps {
  children?: ReactNode;
}

export interface LayoutMainProps {
  children?: ReactNode;
}

export interface LayoutAsideProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps): ReactNode {
  return <div className={styles.layout}>{children}</div>;
}

Layout.displayName = 'PageLayout';
Layout.Main = LayoutMain;
Layout.Aside = LayoutAside;

export function LayoutMain({ children }: LayoutMainProps): ReactNode {
  return <div className={styles.main}>{children}</div>;
}

LayoutMain.displayName = 'PageLayout.MainColumn';

export function LayoutAside({ children }: LayoutAsideProps): ReactNode {
  return <div className={styles.aside}>{children}</div>;
}

LayoutAside.displayName = 'PageLayout.AsideColumn';
