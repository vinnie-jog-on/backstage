/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';

// const useStyles = makeStyles({
//   avatar: {
//     height: 32,
//     width: 32,
//     borderRadius: '10%',
//   },
// });

type Change = {
  change_id: string; // {street: {number: 5060, name: "Hickory Creek Dr"}, city: "Albany", state: "New South Wales",…}
  subject: string; // "duane.reed@example.com"
};

type DenseTableProps = {
  changes: Change[];
};

export const DenseTable = ({ changes }: DenseTableProps) => {
  // const classes = useStyles();

  const columns: TableColumn[] = [
    { title: 'Change_id', field: 'change_id' },
    { title: 'Subject', field: 'subject' },
  ];

  const data = changes.map(change => {
    return {
      change_id: `${change.change_id}`,
      subject: change.subject,
    };
  });

  return (
    <Table
      title="Example User List (fetching data from randomuser.me)"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const ExampleFetchComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<Change[]> => {
    // // const response = await fetch('https://randomuser.me/api/?results=20');
    // // const data = await response.json();
    // // return data.results;
    // const response = await fetch('http://localhost:8080/changes/');
    // console.log(response)
    const response = [
      {
        id: 'repo1~master~I7e4deec2bf3c05ee53ae116a298924161e1a1403',
        project: 'repo1',
        branch: 'master',
        hashtags: [],
        change_id: 'I7e4deec2bf3c05ee53ae116a298924161e1a1403',
        subject: 'empty commit 2',
      },
      {
        id: 'repo1~master~I1f69234beca9f0d06be4467a4f17d0b7b650cc14',
        project: 'repo1',
        branch: 'master',
        hashtags: [],
        change_id: 'I1f69234beca9f0d06be4467a4f17d0b7b650cc14',
        subject: 'empty commit 1',
      },
      {
        id: 'repo1~master~Ic77cfe50d0c39e13975dfe45a224527642ce096e',
        project: 'repo1',
        branch: 'master',
        hashtags: [],
        change_id: 'Ic77cfe50d0c39e13975dfe45a224527642ce096e',
        subject: 'test',
      },
    ];
    // const data = response;
    // console.log(response)
    return response;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable changes={value || []} />;
};
