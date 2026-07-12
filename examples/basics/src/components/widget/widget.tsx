import type { ReactNode } from 'react';
import styles from './widget.m.css';

export interface WidgetProps {
  children?: ReactNode;
}

export function Widget({ children }: WidgetProps) {
  return <div className={styles.block}>{children}</div>;
}

Widget.displayName = 'Widget';
