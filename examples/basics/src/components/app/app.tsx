import { type ReactNode } from 'react';
import { BehaviorRenderer, type Element } from '@krutoo/bdui';
import { useQuery } from '@krutoo/utils/react';

export function App(): ReactNode {
  const { data, status } = useQuery({
    query() {
      return fetch('/api/bdui/page').then(
        res => res.json() as Promise<{ ui?: { tree?: Element } }>,
      );
    },
  });

  if (status === 'pending') {
    return 'Loading...';
  }

  if (!data?.ui?.tree) {
    return 'No BDUI found in response';
  }

  return <BehaviorRenderer tree={data?.ui?.tree} />;
}
