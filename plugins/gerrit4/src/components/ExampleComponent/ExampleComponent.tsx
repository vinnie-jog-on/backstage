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
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  Progress,
  Table,
  TableColumn,
} from '@backstage/core-components';
// import { ExampleFetchComponent } from '../ExampleFetchComponent';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useAsync from 'react-use/lib/useAsync';

import {
  GerritIntegration,
  getGerritProjectsApiUrl,
  getGerritRequestOptions,
  parseGerritJsonResponse,
  ScmIntegrations,
} from '@backstage/integration';

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});

type Change = {
  id: string;
  project: string; // "duane.reed@example.com"
};

type DenseTableProps = {
  changes: Change[];
};

export const DenseTable = ({ changes }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'Id', field: 'id' },
    { title: 'Project', field: 'project' },
  ];

  const data = changes.map(change => {
    return {
      id: change.id,
      project: change.project,
    };
  });

  return (
    <Table
      title="Example change List (fetching data from local gerrit)"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

const GerritProxyComponent = () => {
  const discoveryApi = useApi(discoveryApiRef);
  const proxyBackendBaseUrl = discoveryApi.getBaseUrl('proxy');

  const { value, loading, error } = useAsync(async (): Promise<Change[]> => {
    const response = await fetch(
      `${await proxyBackendBaseUrl}/gerrit/changes/`,
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

export const ExampleComponent = () => (
  <Page themeId="tool">
    <Header title="Welcome to gerrit Page!" subtitle="Optional subtitle">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Plugin title">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <InfoCard title="Information card">
            <Typography variant="body1">
              All content should be wrapped in a card like this.
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
