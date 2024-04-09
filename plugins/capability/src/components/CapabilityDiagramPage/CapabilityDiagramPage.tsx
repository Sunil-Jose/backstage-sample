
import React, { useCallback } from "react";
import { configApiRef, useApi, useRouteRef } from "@backstage/core-plugin-api";
import { catalogApiRef, entityRouteRef } from "@backstage/plugin-catalog-react";
import { useAsync } from 'react-use';
import { DEFAULT_NAMESPACE, Entity, parseEntityRef } from "@backstage/catalog-model";
import { useNavigate } from "react-router-dom";
import { EntityCustomNodeData, RenderCustomNode } from "./CustomNode";
import { Content, ContentHeader, DependencyGraph, DependencyGraphTypes, Header, InfoCard, Page, Progress, ResponseErrorPanel } from "@backstage/core-components";
import { CapabilityEntity } from "@internal/backstage-plugin-capability-common";


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

    const catalogEntityRoute = useRouteRef(entityRouteRef);
    const navigate = useNavigate();

    const onCustomNodeClick = useCallback(
        (node: CustomEntityNode, _: React.MouseEvent) => {
            if (!node.entity) {
                return;
            }
            const nodeEntityName = parseEntityRef({
                kind: node.entity.kind,
                namespace: node.entity.metadata.namespace || DEFAULT_NAMESPACE,
                name: node.entity.metadata.name,
            });
            const path = catalogEntityRoute({
                kind: nodeEntityName.kind.toLocaleLowerCase('en-US'),
                namespace: nodeEntityName.namespace.toLocaleLowerCase('en-US'),
                name: nodeEntityName.name,
            });
            navigate(path);
        },
        [catalogEntityRoute, navigate],
    );

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
                    const node: CustomEntityNode = {
                        id: entity.metadata.name,
                        entity: entity,
                        title: entity.metadata.title,
                        color: "primary",
                    };

                    node.onClick = (event: React.MouseEvent<HTMLElement>) => onCustomNodeClick(node, event);

                    nodes.push(node);

                    edges.push({ from: entity.metadata.name, to: 'root' });
                } else if (entity.kind === 'Capability') {
                    const capabilityEntity = entity as CapabilityEntity;

                    const node: CustomEntityNode = {
                        id: entity.metadata.name,
                        entity: entity,
                        title: entity.metadata.title,
                        color: "primary",
                    };

                    node.onClick = (event: React.MouseEvent<HTMLElement>) => onCustomNodeClick(node, event);
                    nodes.push(node);

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
            <Header title="Org Structure" />
            <Content>
                <ContentHeader title="XYZ Org Structure" />
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