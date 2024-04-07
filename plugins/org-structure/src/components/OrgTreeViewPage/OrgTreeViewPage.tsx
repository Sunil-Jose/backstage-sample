import { Content, ContentHeader, DependencyGraph, DependencyGraphTypes, Header, InfoCard, Page } from "@backstage/core-components";
import React from "react";
import { useApi } from "@backstage/core-plugin-api";
import { catalogApiRef } from "@backstage/plugin-catalog-react";
import { useAsync } from 'react-use';
import { GroupEntity } from "@backstage/catalog-model";

export function OrgTreeViewPage() {

    const catalogApi = useApi(catalogApiRef);
    const entitiesData = useAsync(async () => catalogApi.queryEntities({filter: {kind: 'Group'}}), []);

    // should we create state for these?
    let nodes: DependencyGraphTypes.DependencyNode[] = [];
    let edges: DependencyGraphTypes.DependencyEdge[] = [];

    if (!entitiesData.loading) {
        if (entitiesData.value?.items !== undefined) {
            const entities: GroupEntity[] = entitiesData.value?.items as GroupEntity[];
            for(const entity of entities) {
                nodes.push({id: entity.metadata.name});
                for(const child of entity.spec.children) {
                    edges.push({from: entity.metadata.name, to: child});
                }
            }
        }
    }

    
    return (
        <Page themeId="tool">
            <Header title="Org Structure" />
            <Content>
                <ContentHeader title="XYZ Org Structure" />
                <InfoCard>
                    <DependencyGraph
                        nodes={nodes}
                        edges={edges}
                    />
                </InfoCard>
            </Content>
        </Page>
    );
}