import {
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';
import { BehaviorContext } from '@krutoo/bdui';
import { useExactClick } from '@krutoo/utils/react';
import { createStore } from '@krutoo/utils/store';
import styles from './modal.m.css';

export interface ModalProps {
  id?: string;
  defaultOpen?: boolean;
  children?: ReactNode;
}

export interface ModalContentProps {
  children?: ReactNode;
}

export interface ModalFooterProps {
  children?: ReactNode;
}

export function Modal({ id, children, defaultOpen }: ModalProps) {
  const defaultOpenRef = useRef(defaultOpen);
  const store = useMemo(
    () => createStore({ open: defaultOpenRef.current ?? false }),
    [defaultOpenRef],
  );
  const state = useSyncExternalStore(store.subscribe, store.get, store.get);
  const { open } = state;

  const setOpen = useCallback(
    (value: boolean | ((open: boolean) => boolean)) =>
      store.set({ open: typeof value === 'function' ? value(store.get().open) : value }),
    [store],
  );

  const { elements } = useContext(BehaviorContext);

  useEffect(() => {
    if (!id) {
      return;
    }

    elements.set(id, {
      type: 'modal',
      id,
      store,
      actions: {
        open() {
          setOpen(true);
        },
        close() {
          setOpen(false);
        },
        toggle() {
          setOpen(a => !a);
        },
      },
    });

    return () => {
      elements.delete(id);
    };
  }, [id, store, setOpen, elements]);

  const backdropClickBind = useExactClick(() => {
    setOpen(false);
  });

  if (!open) {
    return null;
  }

  return (
    <div className={styles.backdrop} {...backdropClickBind}>
      <div className={styles.modal}>{children}</div>
    </div>
  );
}

Modal.displayName = 'Modal';
