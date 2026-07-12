import { useField } from '@krutoo/bdui';
import styles from './input.m.css';

export interface InputProps {
  id?: string;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
}

export function Input({ id, name, defaultValue, placeholder }: InputProps) {
  const { value, handleChange } = useField({ id, name, defaultValue });

  return (
    <input
      className={styles.input}
      type='text'
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
}

Input.displayName = 'Input';
