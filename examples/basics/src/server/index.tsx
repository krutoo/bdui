import { renderToJSON } from '@krutoo/bdui';
import { wait } from '@krutoo/utils';
import { format } from 'date-fns';
import express from 'express';
import { Accordion } from '#components/accordion/mod.ts';
import { Paragraph } from '#components/paragraph/mod.ts';
import { Text } from '#components/text/mod.ts';
import { ExamplePage } from '#pages/example-page/mod.ts';
import { status, users } from './data.ts';

const app = express();

app.use(express.json());

// API endpoints

app.put('/status', (req, res) => {
  if (req.body.status) {
    status.value = req.body.status;
    status.history.push({
      date: format(new Date(), 'dd.MM.yyyy, HH:mm'),
      value: req.body.status,
    });
  }

  res.send();
});

app.get('/users', async (req, res) => {
  await wait(2000);

  res.contentType('application/json').send(JSON.stringify(users.slice(0, 10)));
});

// BDUI endpoints:

app.get('/bdui/page', async (req, res) => {
  await wait(320);

  res.contentType('application/json').send(
    JSON.stringify(
      {
        ui: {
          tree: renderToJSON(ExamplePage()),
        },
      },
      null,
      2,
    ),
  );
});

app.get('/bdui/status', async (req, res) => {
  await wait(250);

  res.contentType('application/json').send(
    JSON.stringify({
      ui: {
        replacers: {
          status_info: renderToJSON(
            <>
              <Text value={`Status: ${status.value}`} />
              <Accordion>
                <Accordion.Summary>History</Accordion.Summary>
                <Accordion.Content>
                  {status.history.map((item, index) => (
                    <Paragraph key={index}>
                      {item.date}: {item.value}
                    </Paragraph>
                  ))}
                </Accordion.Content>
              </Accordion>
            </>,
          ),
        },
      },
    }),
  );
});

app.get('/bdui/users', async (req, res) => {
  await wait(750);

  res.contentType('application/json').send(
    JSON.stringify({
      ui: {
        replacers: {
          users_domain_slot: renderToJSON(<Text value='Atomic users slot is here!' />),
        },
      },
    }),
  );
});

app.listen(3200, () => {
  // eslint-disable-next-line no-console
  console.log('Server started on http://localhost:3200');
});
