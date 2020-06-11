// @flow
import * as React from 'react';
import Filters from './Filters.container';
import type { Column } from '../types';

type Props = {
    columns: ?Array<Column>,
    listId: string,
};

export const withFilterSelectors = () => (InnerComponent: React.ComponentType<any>) =>
    (props: Props) => {
        const { columns, listId } = props;
        return (
            <InnerComponent
                {...props}
                columns={columns}
                listId={listId}
                filterButtons={
                    <Filters
                        columns={columns}
                        listId={listId}
                    />
                }
            />
        );
    };
