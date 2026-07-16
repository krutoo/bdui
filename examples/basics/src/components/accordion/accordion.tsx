import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { BehaviorContext } from '@krutoo/bdui';
import { createStore } from '@krutoo/utils/store';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './accordion.m.css';

export interface AccordionProps {
  id?: string;
  children?: ReactNode;
}

export interface AccordionSummaryProps {
  children?: ReactNode;
}

export interface AccordionContentProps {
  children?: ReactNode;
}

const AccordionContext = createContext({
  open: false,
  toggle: (open: boolean): void => void open,
});

export function Accordion({ id, children }: AccordionProps): ReactNode {
  const { elements } = useContext(BehaviorContext);
  const store = useMemo(() => createStore({ open: false }), []);
  const state = useSyncExternalStore(store.subscribe, store.get, store.get);
  const { open } = state;

  const setOpen = useCallback(
    (value: boolean | ((open: boolean) => boolean)) => {
      store.set({ open: typeof value === 'function' ? value(store.get().open) : value });
    },
    [store],
  );

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
  }, [id, store, elements, setOpen]);

  return (
    <AccordionContext value={{ open, toggle: setOpen }}>
      <div className={styles.root}>{children}</div>
    </AccordionContext>
  );
}

Accordion.displayName = 'Accordion';
Accordion.Summary = AccordionSummary;
Accordion.Content = AccordionContent;

function AccordionSummary({ children }: AccordionSummaryProps): ReactNode {
  const { open, toggle } = useContext(AccordionContext);

  return (
    <div className={styles.summary} onClick={() => toggle(!open)}>
      {children}
      {open ? <ChevronUp size='1em' /> : <ChevronDown size='1em' />}
    </div>
  );
}

AccordionSummary.displayName = 'Accordion.Summary';

function AccordionContent({ children }: AccordionContentProps): ReactNode {
  const { open } = useContext(AccordionContext);

  if (!open) {
    return null;
  }

  return <div>{children}</div>;
}

AccordionContent.displayName = 'Accordion.Content';
