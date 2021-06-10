// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { colors, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { NonBundledDhis2Icon } from '../../../../NonBundledDhis2Icon';
import type { Props } from './StageEventHeader.types';

const getStyles = () => ({
    wrapper: {
        padding: `${spacersNum.dp8}px ${spacersNum.dp12}px`,
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
    title: {
        color: colors.grey900,
        fontSize: spacersNum.dp16,
        fontWeight: 500,
    },
});

const StageEventHeaderComponentPlain = ({ icon, title, events, classes }) => (<>
    <div data-test="stage-event-header" className={classes.wrapper}>
        <div className={classes.icon}>{
            icon && (
                <div className={classes.icon}>
                    <NonBundledDhis2Icon
                        name={icon.name}
                        color={icon.color}
                        width={30}
                        height={30}
                        cornerRadius={2}
                    />
                </div>
            )
        }</div>
        <div className={classes.title}>{title}
            {events.length > 0 && <span> :
                {events.length} {events.length > 1 ? i18n.t('events') : i18n.t('event')}
            </span>}
        </div>
    </div>
</>);

export const StageEventHeaderComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(
    getStyles,
)(StageEventHeaderComponentPlain);
