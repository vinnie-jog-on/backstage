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
} from '@backstage/core-components';
// import { ExampleFetchComponent } from '../ExampleFetchComponent';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { Alert } from '@material-ui/lab';

const GerritProxyComponent = () => {
  const discoveryApi = useApi(discoveryApiRef);
  const proxyBackendBaseUrl = discoveryApi.getBaseUrl('proxy');

  const { value, loading, error } = useAsync(async () => {
    // console.log("good to be at step 1")
    const response = await fetch(
      `${await proxyBackendBaseUrl}/gerrit/projects/repo1`,
    );
    // console.log(response)
    //  console.log("step 2 " + response.body)
    //  const jsonResponseBody = response.body;
    //  let data = '';
    //  jsonResponseBody.on('data', chunk => {
    //     data += chunk;
    //   });
    //   jsonResponseBody.on('end', () => {
    //   const string = data.toString('utf8');
    //   console.log(jsonResponseBody);
    // });
    //  const strippedJsonResponseBody = jsonResponseBody.replace(/^MagicPrefix\s*/, '');
    // //console.log(response.json())
    const data = await response.json();
    return data;
  }, []);
  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <div>HELLO V</div>;
};

export const ExampleComponent = () => (
  <Page themeId="tool">
    <Header title="Welcome to gerrit4!" subtitle="Optional subtitle">
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
