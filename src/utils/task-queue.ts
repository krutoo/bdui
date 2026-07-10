import { debounce } from '@krutoo/utils';
import { Queue } from '#shared/queue';
import type { HttpClient, HttpRequest, HttpResponse } from '../types.ts';

export interface TaskQueueConfig {
  chunkSize?: number;
  http: {
    client: HttpClient;
  };
}

export interface Task {
  type: 'fetch';
  request: HttpRequest;
  callback: (payload: { response: HttpResponse }) => void;
}

/**
 * Checks that two tasks are equal.
 * @param a Task.
 * @param b Task.
 * @returns True if equal,  false otherwise.
 */
function isEqualTasks(a: Task, b: Task): boolean {
  // @todo проверять headers, body
  return (
    (a.request.method ?? 'GET') === (b.request.method ?? 'GET') && a.request.url === b.request.url
  );
}

export class TaskQueue extends Queue<Task> {
  protected options: {
    chunkSize: number;
  };

  protected httpClient: HttpClient;

  constructor({ chunkSize = 5, http }: TaskQueueConfig) {
    super();
    this.options = { chunkSize };
    this.httpClient = http.client;
  }

  init(): VoidFunction {
    let processing = false;

    const check = async () => {
      if (processing) {
        return;
      }

      processing = true;

      const chunk: Task[] = [];

      for (let i = 0; i < this.options.chunkSize; i++) {
        const task = this.dequeue();

        if (task && !chunk.some(item => isEqualTasks(item, task))) {
          chunk.push(task);
        }
      }

      await Promise.all(
        chunk.map(item =>
          this.httpClient
            .request(item.request.url, {
              method: item.request.method,
              headers: {
                'content-type': 'application/json',
              },
            })
            .then(response => item.callback({ response }))
            .catch(() => null),
        ),
      );

      processing = false;

      if (!this.isEmpty()) {
        check();
      }
    };

    return this.subscribe(debounce(check, 300));
  }
}
