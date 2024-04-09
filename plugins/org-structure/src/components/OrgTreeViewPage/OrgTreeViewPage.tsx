import {
    Content,
    ContentHeader,
    DependencyGraph,
    DependencyGraphTypes,
    Header,
    InfoCard,
    Page
} from "@backstage/core-components";
import React, { useCallback } from "react";
import { useApi, useRouteRef } from "@backstage/core-plugin-api";
import { catalogApiRef, entityRouteRef } from "@backstage/plugin-catalog-react";
import { useAsync } from 'react-use';
import { DEFAULT_NAMESPACE, GroupEntity, parseEntityRef } from "@backstage/catalog-model";
import { EntityCustomNodeData, RenderCustomNode } from "./CustomNode";
import { useNavigate } from "react-router-dom";


export type CustomEntityNode = DependencyGraphTypes.DependencyNode<EntityCustomNodeData>;

export function OrgTreeViewPage() {

    const catalogApi = useApi(catalogApiRef);
    const entitiesData = useAsync(async () => catalogApi.queryEntities({ filter: { kind: 'Group' } }), []);

    // should we create state for these?
    let nodes: DependencyGraphTypes.DependencyNode<EntityCustomNodeData>[] = [];
    let edges: DependencyGraphTypes.DependencyEdge[] = [];

    const catalogEntityRoute = useRouteRef(entityRouteRef);
    const navigate = useNavigate();

    const onCustomNodeClick = useCallback(
        (node: CustomEntityNode, _: React.MouseEvent) => {
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

    if (!entitiesData.loading) {
        if (entitiesData.value?.items !== undefined) {
            const entities: GroupEntity[] = entitiesData.value?.items as GroupEntity[];
            for (const entity of entities) {
                const node: CustomEntityNode = {
                    id: entity.metadata.name,
                    entity: entity,
                    name: entity.metadata.name,
                    title: entity.metadata.title,
                    color: "primary",
                };
                node.onClick = (event: React.MouseEvent<HTMLElement>) => onCustomNodeClick(node, event);

                nodes.push(node);
                for (const child of entity.spec.children) {
                    edges.push({ from: entity.metadata.name, to: child });
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
                        renderNode={RenderCustomNode}
                    />
                </InfoCard>
            </Content>
        </Page>
    );
}