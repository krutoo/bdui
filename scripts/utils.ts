import { spawn } from 'node:child_process';

/**
 * Runs shell script using `spawn`.
 * @param cmd Command to run.
 * @returns Promise that resolves when process closed.
 */
export function $(cmd: string): Promise<void> {
  return new Promise((done, fail) => {
    const child = spawn(cmd, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, FORCE_COLOR: '3' },
    });

    child.on('error', fail);

    child.on('close', (code, signal) => {
      if (code === 0) {
        done();
      } else {
        fail(
          new Error(signal ? `Process killed, signal ${signal}` : `Process exited, code ${code}`),
        );
      }
    });
  });
}
