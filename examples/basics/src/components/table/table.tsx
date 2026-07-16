import type { ReactNode } from 'react';
import styles from './table.m.css';

export interface TableProps {
  children?: ReactNode;
}

export function Table({ children }: TableProps) {
  return <table className={styles.table}>{children}</table>;
}

Table.displayName = 'Table';
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Row = TableRow;
Table.Cell = TableCell;

export function TableHead({ children }: TableProps) {
  return <thead className={styles.head}>{children}</thead>;
}

TableHead.displayName = 'Table.Head';

export function TableBody({ children }: TableProps) {
  return <tbody className={styles.body}>{children}</tbody>;
}

TableBody.displayName = 'Table.Body';

export function TableRow({ children }: TableProps) {
  return <tr className={styles.row}>{children}</tr>;
}

TableRow.displayName = 'Table.Row';

export function TableCell({ children }: TableProps) {
  return <td className={styles.cell}>{children}</td>;
}

TableCell.displayName = 'Table.Cell';
