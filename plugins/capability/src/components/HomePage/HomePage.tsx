import React from "react";
import { Typography, Grid } from '@material-ui/core';
import {
    InfoCard,
    Header,
    Page,
    Content,
    ContentHeader,
    SupportButton,
    CreateButton,
} from '@backstage/core-components';
import { useRouteRef } from "@backstage/core-plugin-api";
import { createCapabilityPageRouteRef } from "../../routes";


export const HomePage = () => {
    const createPageUrl = useRouteRef(createCapabilityPageRouteRef);
    return (
        <Page themeId="tool">
            <Header title="Welcome to capability!">
            </Header>
            <Content>
                <ContentHeader title="Capability">
                    <SupportButton>A description of your plugin goes here.</SupportButton>
                    <CreateButton title="Create" to={createPageUrl()}/>
                </ContentHeader>
                <Grid container spacing={3} direction="column">
                    <Grid item>
                        <InfoCard title="Information card">
                            <Typography variant="body1">
                                All content should be wrapped in a card like this.
                            </Typography>
                        </InfoCard>
                    </Grid>
                </Grid>
            </Content>
        </Page>
    );
};