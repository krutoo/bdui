import { type ReactNode, useCallback, useContext, useEffect } from 'react';
import { BehaviorContext } from '@krutoo/bdui';
import styles from './button.m.css';

export interface ButtonProps {
  id?: string;
  onClick?: string;
  action?: string;
  actionTarget?: string;
  children?: ReactNode;
  disabled?: boolean;
}

export function Button({ id, action, actionTarget, onClick, children, disabled }: ButtonProps) {
  const { elements } = useContext(BehaviorContext);

  const handleClick = useCallback(() => {
    if (action && actionTarget) {
      elements.get(actionTarget)?.actions?.[action]?.();
    }

    if (onClick) {
      elements.get(onClick)?.actions?.run?.();
    }
  }, [action, actionTarget, onClick, elements]);

  useEffect(() => {
    if (!id) {
      return;
    }

    elements.set(id, {
      id,
      type: 'button',
      actions: {
        click() {},
      },
    });

    return () => {
      elements.delete(id);
    };
  }, [id, elements]);

  return (
    <button type='button' className={styles.button} onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  );
}

Button.displayName = 'Button';
