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
import { Grid, Typography } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  Progress,
  TableColumn,
  Table,
  InfoCard,
} from '@backstage/core-components';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useAsync from 'react-use/lib/useAsync';
import { useEntity } from '@backstage/plugin-catalog-react';
import { parseGerritJsonResponse } from '@backstage/integration';

const useStyles = makeStyles({
  link: {
    textDecoration: 'underline',
    fontSize: '16px',
    lineHeight: '27px',
    color: 'blue',
    '&:hover, &:focus': {
      fontWeight: '500',
    },
  },
});

type Change = {
  subject: string;
  owner: string;
  project: string;
  branch: string;
  updated: string;
  status: string;
  change_id: string;
  _number: string;
};

type DenseTableProps = {
  changes: Change[];
};

export default function GerritUser(userid: string): string | any {
  //   curl http://localhost:8080/accounts/1000000
  // )]}'
  // {"_account_id":1000000,"name":"Administrator","email":"admin@example.com","username":"admin","avatars":[{"url":"http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61.jpg?d\u003didenticon\u0026r\u003dpg\u0026s\u003d32","height":32},{"url":"http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61.jpg?d\u003didenticon\u0026r\u003dpg\u0026s\u003d56","height":56},{"url":"http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61.jpg?d\u003didenticon\u0026r\u003dpg\u0026s\u003d100","height":100},{"url":"http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61.jpg?d\u003didenticon\u0026r\u003dpg\u0026s\u003d120","height":120}]}
  // let userid1 = { userid: userid }

  const discoveryApi = useApi(discoveryApiRef);
  const proxyBackendBaseUrl = discoveryApi.getBaseUrl('proxy');
  const { value, loading, error } = useAsync(async () => {
    const response = await fetch(
      `${await proxyBackendBaseUrl}/gerrit/accounts/${userid}/username`,
    );
    const data = await response.text();
    const trimmed = data.substring(4);
    return trimmed;
  }, []);
  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return value || '';
}

export const DenseTable = ({ changes }: DenseTableProps) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    { title: 'Subject', field: 'subject' },
    { title: 'Owner', field: 'owner._account_id' },
    { title: 'Project', field: 'project' },
    { title: 'Branch', field: 'branch' },
    { title: 'Updated', field: 'updated' },
    { title: 'Status', field: 'status' },
    { title: 'Change Id', field: 'change_id' },
  ];

  const data = changes.map(change => {
    // console.log("Step 1");
    // const userid: string = change.owner
    // const user = GerritUser(JSON.stringify(change.owner._account_id));
    // console.log("Step 2");
    // console.log(user);
    // console.log("Step_3");

    return {
      subject: (
        <a
          href={`http://localhost:8080/c/${change.project}/+/${change._number}`}
          target="_blank"
          className={classes.link}
        >
          {change.subject}
        </a>
      ),
      project: change.project,
      branch: (
        <a
          href={`http://localhost:8080/plugins/gitiles/${change.project}/+/refs/heads/${change.branch}`}
          target="_blank"
          className={classes.link}
        >
          {change.branch}
        </a>
      ),
      updated: change.updated.split('.')[0],
      owner: change.owner,
      // owner: (
      //   <a
      //     href={`http://localhost:8080/q/owner:admin`}
      //     target="_blank"
      //     className={classes.link}
      //   >
      //     {change.owner}
      //   </a>
      // ),
      status: change.status,
      change_id: change.change_id,
    };
  });

  return (
    <Table
      title="Gerrit reviews on repo"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

const GerritProxyComponent = () => {
  const discoveryApi = useApi(discoveryApiRef);
  const proxyBackendBaseUrl = discoveryApi.getBaseUrl('proxy');
  const { entity } = useEntity();
  // const repoName = entity?.metadata?.name;
  const { value, loading, error } = useAsync(async (): Promise<Change[]> => {
    const response = await fetch(
      `${await proxyBackendBaseUrl}/gerrit/changes/?q=project:${
        entity?.metadata?.name
      }`,
    );
    const data = { results: await parseGerritJsonResponse(response as any) };
    return data.results;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <DenseTable changes={value || []} />;
};

export const GerritComponent = () => (
  <Page themeId="tool">
    <Header title="Gerrit Page!" subtitle="Optional subtitle">
      <HeaderLabel label="Repo Name" value="Alpha" url="https://google.com" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Gerrit portal">
        <SupportButton>Provides a link to gerrit changes.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <InfoCard title="Information card">
            <Typography variant="body1">
              I really should add something here.
              {/* <GerritUser("1000001") /> */}
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item>
          <GerritProxyComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
