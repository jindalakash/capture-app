// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import {
    spacersNum,
    Button,
    colors,
    IconEdit24,
    IconArrowLeft24,
} from '@dhis2/ui';
import { Widget } from '../Widget';
import type { PlainProps } from './widgetEventEdit.types';
import { EditEventDataEntry } from '../Pages/ViewEvent/EventDetailsSection/EditEventDataEntry/';
import { ViewEventDataEntry } from '../Pages/ViewEvent/EventDetailsSection/ViewEventDataEntry/';
import { pageMode } from '../Pages/EnrollmentEvent/EnrollmentEventPage.const';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
    form: {
        padding: spacersNum.dp8,
    },
    menu: {
        display: 'flex',
        justifyContent: 'space-between',
        background: colors.white,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderStyle: 'solid',
        borderColor: colors.grey400,
        borderWidth: 1,
        borderBottomWidth: 0,
    },
    backButton: { margin: spacersNum.dp8 },
    editButton: { margin: spacersNum.dp8 },
};

export const WidgetEventEditPlain = ({
    classes,
    programStage,
    programStage: { name, icon },
    mode,
    onEdit,
}: PlainProps) => (
    <div data-test="widget-enrollment">
        <div className={classes.menu}>
            <Button
                small
                secondary
                className={classes.backButton}
                onClick={() => {}}
            >
                <IconArrowLeft24 /> {i18n.t('Back to all stages and events')}
            </Button>
            <Button
                small
                secondary
                className={classes.editButton}
                onClick={onEdit}
            >
                <IconEdit24 />
                {i18n.t('Edit event')}
            </Button>
        </div>
        <Widget
            header={
                <div className={classes.header}>
                    {icon && (
                        <div className={classes.icon}>
                            <NonBundledDhis2Icon
                                name={icon?.name}
                                color={icon?.color}
                                width={30}
                                height={30}
                                cornerRadius={2}
                            />
                        </div>
                    )}
                    <span> {name} </span>
                </div>
            }
            onOpen={() => {}}
            onClose={() => {}}
            open
        >
            <div className={classes.form}>
                {mode === pageMode.VIEW ? (
                    <ViewEventDataEntry
                        formFoundation={programStage.stageForm}
                    />
                ) : (
                    <EditEventDataEntry
                        formFoundation={programStage.stageForm}
                    />
                )}
            </div>
        </Widget>
    </div>
);
export const WidgetEventEdit: ComponentType<$Diff<PlainProps, CssClasses>> =
    withStyles(styles)(WidgetEventEditPlain);
