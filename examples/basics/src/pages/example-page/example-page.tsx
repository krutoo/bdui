import type { ReactNode } from 'react';
import { Action, Condition, Defer, Display, Each, Form, Query, State } from '@krutoo/bdui';
import { Button } from '#components/button/mod.ts';
import { Flex } from '#components/flex/mod.ts';
import { Heading } from '#components/heading/mod.ts';
import { Input } from '#components/input/mod.ts';
import { PageLayout } from '#components/layout/mod.ts';
import { Modal } from '#components/modal/mod.ts';
import { Option } from '#components/option/mod.ts';
import { Paragraph } from '#components/paragraph/paragraph.tsx';
import { Select } from '#components/select/mod.ts';
import { Skeleton } from '#components/skeleton/mod.ts';
import { Table } from '#components/table/mod.ts';
import { Text } from '#components/text/mod.ts';
import { Widget } from '#components/widget/mod.ts';

export function ExamplePage(): ReactNode {
  return (
    <PageLayout>
      <PageLayout.Main>
        <Widget>
          <Heading level='2'>Defer markup</Heading>
          <Paragraph>They fetch markup by http and render children until response done</Paragraph>

          <Defer id='status_info' resource='/api/bdui/status' method='GET'>
            <Skeleton preset='paragraph' />
          </Defer>

          <Flex>
            <Button action='open' actionTarget='status_modal'>
              Change
            </Button>
          </Flex>
        </Widget>

        <Widget>
          <Heading level='2'>Querying any JSON</Heading>
          <Paragraph>With display it by templating via expressions</Paragraph>

          <Query id='users' resource='/api/users' />

          <Condition if='{{statusOf("users") == "pending"}}'>
            <Text value='Loading...' />
          </Condition>

          <Each of='{{dataOf("users")}}' as='$user'>
            <Paragraph>
              <Display of='{{$index + 1}}' />) <Display of='{{$user.firstname}}' />
            </Paragraph>
          </Each>
        </Widget>

        <Widget>
          <Heading level='2'>Just markup</Heading>
          <Paragraph>With atomic defers</Paragraph>

          <Defer id='users_domain_slot' resource='/api/bdui/users' method='GET'>
            <Skeleton preset='text' />
          </Defer>

          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>Foo</Table.Cell>
                <Table.Cell>Bar</Table.Cell>
                <Table.Cell>Baz</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>1</Table.Cell>
                <Table.Cell>2</Table.Cell>
                <Table.Cell>3</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>4</Table.Cell>
                <Table.Cell>5</Table.Cell>
                <Table.Cell>6</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Widget>

        <Widget>
          <Heading level='2'>Dynamic form</Heading>
          <Paragraph>You can add/remove some fields</Paragraph>

          <State
            id='dynamic_form'
            init={[
              {
                key: '[0]',
                value: 'foo',
              },
              {
                key: '[1]',
                value: 'bar',
              },
              {
                key: '[2]',
                value: 'baz',
              },
            ]}
          />

          <Each of='{{stateOf("dynamic_form")}}'>
            <Flex grow gap='10px'>
              <Input placeholder='{{$item}}' />

              <Condition if='{{stateOf("dynamic_form").length > 1}}'>
                <State.Removal
                  id='{{concat("dynamic_form/remove_item:", $index)}}'
                  target='dynamic_form'
                  from='{{concat("[", $index, "]")}}'
                />
                <Button action='run' actionTarget='{{concat("dynamic_form/remove_item:", $index)}}'>
                  Remove
                </Button>
              </Condition>
            </Flex>
          </Each>

          <Flex gap='8px'>
            <Condition if='{{stateOf("dynamic_form").length < 5}}'>
              <State.Insertion
                id='dynamic_form/add_field'
                target='dynamic_form'
                to='{{concat("[", stateOf("dynamic_form").length, "]")}}'
                value={[{ value: 'new' }]}
              />
              <Button action='run' actionTarget='dynamic_form/add_field'>
                Add field
              </Button>
            </Condition>

            <Button disabled>Submit</Button>
          </Flex>
        </Widget>
      </PageLayout.Main>

      <PageLayout.Aside>
        <Widget>
          <Heading level='3'>Example page</Heading>
          <Paragraph>
            <Text value='This page is demo of using BDUI via ' />
            <Text bold value='@krutoo/bdui' />
          </Paragraph>
          <Paragraph>
            <Text value='See network activity in devtools - all UI is controlled by server' />
          </Paragraph>
        </Widget>
      </PageLayout.Aside>

      <Modal id='status_modal'>
        <Heading level='2'>Status update</Heading>
        <Paragraph>Success submit triggers update of status widget info</Paragraph>

        <Form
          id='status_form'
          resource='/api/status'
          method='PUT'
          onSubmitDone='handle_submit_done'
        >
          <Select id='field_status' name='status'>
            <Option value='foo'>Foo</Option>
            <Option value='bar'>Bar</Option>
            <Option value='baz'>Baz</Option>
          </Select>

          <Condition if='{{valueOf("field_status") === "bar" || valueOf("field_status") === "baz"}}'>
            <Input placeholder='Reason...' name='reason' />
          </Condition>
        </Form>

        <Flex grow gap='8px'>
          <Button action='submit' actionTarget='status_form'>
            Submit
          </Button>
          <Button action='close' actionTarget='status_modal'>
            Cancel
          </Button>
        </Flex>

        <Action.Sequence id='handle_submit_done'>
          <Action type='invalidate' target='status_info' />
          <Action type='close' target='status_modal' />
        </Action.Sequence>
      </Modal>
    </PageLayout>
  );
}
