// @flow
import * as React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { DateField as UIDateField } from 'capture-ui';
import withCalendarProps from '../../../HOC/withCalendarProps';

const getStyles = (theme: Theme) => ({
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.accent.dark}`,
        borderRadius: '5px',
    },
    inputWrapperUnfocused: {
        padding: 2,
    },
    innerInputError: {
        color: theme.palette.error.main,
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputWarning: {
        color: theme.palette.warning.dark,
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputInfo: {
        color: 'green',
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputValidating: {
        color: 'orange',
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
});

type Props = {
}

class DateField extends React.Component<Props> {
    render() {
        const { ...passOnProps } = this.props;
        return (
            <UIDateField
                {...passOnProps}
            />
        );
    }
}

export default withTheme()(withCalendarProps()(withStyles(getStyles)(DateField)));
