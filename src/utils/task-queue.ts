import { debounce } from '@krutoo/utils';
import { Queue } from '#shared/queue';
import type { HttpClient, HttpRequest, HttpResponse } from '#types/http';

export interface TaskQueueConfig {
  chunkSize?: number;
  http: {
    client: HttpClient | (() => HttpClient);
  };
}

export interface Task {
  type: 'fetch';
  request: HttpRequest;
  callback: (payload: { response: HttpResponse }) => void | Promise<void>;
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

  protected getHttpClient: () => HttpClient;

  constructor({ chunkSize = 5, http: { client } }: TaskQueueConfig) {
    super();
    this.options = { chunkSize };
    this.getHttpClient = typeof client === 'function' ? client : () => client;
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

        if (!task) {
          continue;
        }

        const sameTaskIndex = chunk.findIndex(item => isEqualTasks(item, task));

        if (sameTaskIndex === -1) {
          chunk.push(task);
          continue;
        }

        // IMPORTANT: merge callbacks for same task
        const sameTask = chunk[sameTaskIndex]!;

        chunk.splice(sameTaskIndex, 1, {
          ...sameTask,
          async callback(payload) {
            await sameTask.callback(payload);
            await task.callback(payload);
          },
        });
      }

      await Promise.all(
        chunk.map(item =>
          this.getHttpClient()
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

    check();

    return this.subscribe(debounce(check, 300));
  }
}
