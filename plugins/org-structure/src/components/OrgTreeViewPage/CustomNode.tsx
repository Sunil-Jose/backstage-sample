import { DependencyGraphTypes } from '@backstage/core-components';
import { humanizeEntityRef } from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React, { MouseEventHandler, useLayoutEffect, useRef, useState } from 'react';
import { DEFAULT_NAMESPACE, Entity } from '@backstage/catalog-model';


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
        clickable: {
            cursor: 'pointer',
        },
    }),
    { name: 'PluginCatalogGraphCustomNode' },
);

export type EntityCustomNodeData = {
    entity: Entity;
    focused?: boolean;
    color?: 'primary' | 'secondary' | 'default';
    onClick?: MouseEventHandler;
    name: string;
    title?: string;
};

export function RenderCustomNode({
    node: { id, entity, color = 'default', focused, onClick },
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

    const {
        kind,
        metadata: { name, namespace = DEFAULT_NAMESPACE, title },
    } = entity;

    const padding = 10;
    const paddedIconWidth = 0;
    const paddedWidth = paddedIconWidth + width + padding * 2;
    const paddedHeight = height + padding * 2;

    const displayTitle =
        title ??
        (kind && name && namespace
            ? humanizeEntityRef({ kind, name, namespace })
            : id);

    return (
        <g onClick={onClick} className={classNames(onClick && classes.clickable)}>
            {entity.metadata.description ? <title>{entity.metadata.description}</title>:null}
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
        </g>
    );
}