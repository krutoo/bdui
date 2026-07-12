import { type ReactNode, useEffect, useRef } from 'react';
import { useField } from '@krutoo/bdui';
import styles from './select.m.css';

export interface SelectProps {
  id?: string;
  name?: string;
  defaultValue?: string;
  children?: ReactNode;
}

export function Select({ id, name, defaultValue, children }: SelectProps): ReactNode {
  const ref = useRef<HTMLSelectElement>(null);
  const { value, handleChange } = useField({ id, name, defaultValue });

  useEffect(() => {
    if (ref.current) {
      handleChange({ target: ref.current });
    }
  }, [handleChange]);

  return (
    <select ref={ref} id={id} value={value} onChange={handleChange} className={styles.select}>
      {children}
    </select>
  );
}

Select.displayName = 'Select';
