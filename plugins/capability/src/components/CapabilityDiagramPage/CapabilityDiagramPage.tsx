
import React from "react";
import { configApiRef, useApi } from "@backstage/core-plugin-api";
import { catalogApiRef } from "@backstage/plugin-catalog-react";
import { useAsync } from 'react-use';
import { Entity } from "@backstage/catalog-model";
import { EntityCustomNodeData, RenderCustomNode } from "./CustomNode";
import { Content, DependencyGraph, DependencyGraphTypes, Header, InfoCard, Page, Progress, ResponseErrorPanel } from "@backstage/core-components";
import { CapabilityEntity } from "@personal/capability-common";


export type CustomEntityNode = DependencyGraphTypes.DependencyNode<EntityCustomNodeData>;

export function CapabilityDiagramPage() {

    const catalogApi = useApi(catalogApiRef);
    const configApi = useApi(configApiRef);
    const {
        loading,
        error,
        value: entitiesData,
    } = useAsync(async () => catalogApi.getEntities({ filter: { kind: ['Platform', 'Capability'] } }), []);
    const organizationName = configApi.getOptionalString('organization.name') ?? 'Org';

    // should we create state for these?
    let nodes: DependencyGraphTypes.DependencyNode<EntityCustomNodeData>[] = [];
    let edges: DependencyGraphTypes.DependencyEdge[] = [];

    if (loading) {
        return <Progress />;
    } else if (error) {
        return <ResponseErrorPanel error={error} />;
    }

    nodes.push({ id: 'root', color: 'primary', title: organizationName });

    if (entitiesData) {
        if (entitiesData.items !== undefined) {
            const entities = entitiesData.items as Entity[];
            for (const entity of entities) {
                if (entity.kind === 'Platform') {
                    nodes.push({
                        id: entity.metadata.name,
                        entity: entity,
                        title: entity.metadata.title,
                        color: "primary",
                    });

                    edges.push({ from: entity.metadata.name, to: 'root' });
                } else if (entity.kind === 'Capability') {
                    const capabilityEntity = entity as CapabilityEntity;

                    nodes.push({
                        id: entity.metadata.name,
                        entity: entity,
                        title: entity.metadata.title,
                        color: "primary",
                    });

                    // edge from current to parent capability
                    if (capabilityEntity.spec?.capability) {
                        edges.push({ from: capabilityEntity.metadata.name, to: capabilityEntity.spec.capability });
                    }

                    // edges between platform and capability
                    if (capabilityEntity.spec?.platform) {
                        edges.push({ from: capabilityEntity.metadata.name, to: capabilityEntity.spec.platform });
                    }
                }

            }
        }
    }

    return (
        <Page themeId="tool">
            <Header title="Capabilities" />
            <Content>
                <InfoCard>
                    <DependencyGraph
                        //No idea why BOTTOM_TOP approach works instead of TOP_BOTTOM. Have to check.
                        direction={DependencyGraphTypes.Direction.BOTTOM_TOP}
                        nodes={nodes}
                        edges={edges}
                        renderNode={RenderCustomNode}
                    />
                </InfoCard>
            </Content>
        </Page>
    );
}