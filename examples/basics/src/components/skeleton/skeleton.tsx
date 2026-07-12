import styles from './skeleton.m.css';

export interface SkeletonProps {
  preset?: 'text' | 'paragraph';
}

export function Skeleton({ preset = 'text' }: SkeletonProps) {
  if (preset === 'text') {
    return <div className={styles.skeleton}></div>;
  }

  if (preset === 'paragraph') {
    return (
      <div className={styles.paragraph}>
        <div className={styles.skeleton}></div>
        <div className={styles.skeleton}></div>
        <div className={styles.skeleton}></div>
      </div>
    );
  }

  return null;
}

Skeleton.displayName = 'Skeleton';
