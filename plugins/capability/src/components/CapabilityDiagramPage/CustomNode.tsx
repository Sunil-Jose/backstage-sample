import { DependencyGraphTypes, Link } from '@backstage/core-components';
import { entityRouteRef, humanizeEntityRef } from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { DEFAULT_NAMESPACE, Entity, parseEntityRef } from '@backstage/catalog-model';
import { useRouteRef } from '@backstage/core-plugin-api';


const useStyles = makeStyles(
    theme => ({
        node: {
            fill: theme.palette.grey[300],
            stroke: theme.palette.grey[300],

            '&.primary': {
                fill: theme.palette.primary.light,
                stroke: theme.palette.primary.light,
            },
            '&.secondary': {
                fill: theme.palette.secondary.light,
                stroke: theme.palette.secondary.light,
            },
        },
        text: {
            fill: theme.palette.getContrastText(theme.palette.grey[300]),

            '&.primary': {
                fill: theme.palette.primary.contrastText,
            },
            '&.secondary': {
                fill: theme.palette.secondary.contrastText,
            },
            '&.focused': {
                fontWeight: 'bold',
            },
        },
        link: {
            '&:hover': {
                textDecoration: 'none',
            }
        },
    }),
    { name: 'PluginCatalogGraphCustomNode' },
);

export type EntityCustomNodeData = {
    entity?: Entity;
    focused?: boolean;
    color?: 'primary' | 'secondary' | 'default';
    title?: string;
};

export function RenderCustomNode({
    node: { id, entity, color = 'default', focused, title },
}: DependencyGraphTypes.RenderNodeProps<EntityCustomNodeData>) {
    const classes = useStyles();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const idRef = useRef<SVGTextElement | null>(null);

    useLayoutEffect(() => {
        // set the width to the length of the ID
        if (idRef.current) {
            let { height: renderedHeight, width: renderedWidth } =
                idRef.current.getBBox();
            renderedHeight = Math.round(renderedHeight);
            renderedWidth = Math.round(renderedWidth);

            if (renderedHeight !== height || renderedWidth !== width) {
                setWidth(renderedWidth);
                setHeight(renderedHeight);
            }
        }
    }, [width, height]);

    const padding = 10;
    const paddedIconWidth = 0;
    const paddedWidth = paddedIconWidth + width + padding * 2;
    const paddedHeight = height + padding * 2;

    const displayTitle = title ?? (entity ? humanizeEntityRef(entity) : id);
    if (entity) {
        const ref = parseEntityRef({
            kind: entity.kind,
            namespace: entity.metadata.namespace ? entity.metadata.namespace : DEFAULT_NAMESPACE,
            name: entity.metadata.name
        });
        const catalogEntityRef = useRouteRef(entityRouteRef);

        return (
            <g>
                {entity.metadata.description ? <title>{entity.metadata.description}</title> : null}
                <rect
                    className={classNames(
                        classes.node,
                        color === 'primary' && 'primary',
                        color === 'secondary' && 'secondary',
                    )}
                    width={paddedWidth}
                    height={paddedHeight}
                    rx={10}
                />
                <Link
                    to={catalogEntityRef({
                        name: ref.name,
                        kind: ref.kind,
                        namespace: ref.namespace,
                    })}
                    className={classes.link}
                >
                    <text
                        ref={idRef}
                        className={classNames(
                            classes.text,
                            focused && 'focused',
                            color === 'primary' && 'primary',
                            color === 'secondary' && 'secondary',
                        )}
                        y={paddedHeight / 2}
                        x={paddedIconWidth + (width + padding * 2) / 2}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                    >
                        {displayTitle}
                    </text>
                </Link>
            </g>
        );
    }

    return (
        <g>
            <rect
                className={classNames(
                    classes.node,
                    color === 'primary' && 'primary',
                    color === 'secondary' && 'secondary',
                )}
                width={paddedWidth}
                height={paddedHeight}
                rx={10}
            />
            <text
                ref={idRef}
                className={classNames(
                    classes.text,
                    color === 'primary' && 'primary',
                    color === 'secondary' && 'secondary',
                )}
                y={paddedHeight / 2}
                x={paddedIconWidth + (width + padding * 2) / 2}
                textAnchor="middle"
                alignmentBaseline="middle"
            >
                {displayTitle}
            </text>
        </g>
    );
}