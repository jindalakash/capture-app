// @flow
import React, { type ComponentType, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { startNewEnrollmentDataEntryInitialisation } from './EnrollmentRegistrationEntry.actions';
import { EnrollmentDataEntry } from '../Enrollment';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { InfoIconText } from '../../InfoIconText';

const useDataEntryLifecycle = (selectedScopeId, dataEntryId, scopeType) => {
    const dispatch = useDispatch();
    const { id: selectedOrgUnitId } = useCurrentOrgUnitInfo();
    const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const registrationFormReady = !!formId;
    useEffect(() => {
        if (registrationFormReady && scopeType === scopeTypes.TRACKER_PROGRAM) {
            dispatch(
                startNewEnrollmentDataEntryInitialisation(
                    { selectedOrgUnitId, selectedScopeId, dataEntryId, formFoundation },
                ),
            );
        }
    }, [
        scopeType,
        dataEntryId,
        selectedScopeId,
        selectedOrgUnitId,
        registrationFormReady,
        formFoundation,
        dispatch,
    ]);
};

const translatedTextWithStyles = (trackedEntityName, programName, orgUnitName) =>
    (<>
        {i18n.t('Saving a {{trackedEntityName}} in', { trackedEntityName })} <b>{programName}</b> {i18n.t('in')} <b>{orgUnitName}</b>.
    </>);

const styles = ({ typography }) => ({
    marginTop: {
        marginTop: typography.pxToRem(2),
    },
});

const EnrollmentRegistrationEntryPlain = ({ selectedScopeId, id, onSave, classes, ...rest }: {...OwnProps, ...CssClasses}) => {
    const { scopeType, programName, trackedEntityName } = useScopeInfo(selectedScopeId);
    useDataEntryLifecycle(selectedScopeId, id, scopeType);
    const { formId, registrationMetaData, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();

    return (
        <>
            {
                scopeType === scopeTypes.TRACKER_PROGRAM && formId &&
                <>
                    {/* $FlowFixMe */}
                    <EnrollmentDataEntry
                        orgUnit={orgUnit}
                        programId={selectedScopeId}
                        formFoundation={formFoundation}
                        enrollmentMetadata={registrationMetaData}
                        id={id}
                        {...rest}
                    />
                    {
                        onSave &&
                        <>
                            <Button
                                dataTest="dhis2-capture-create-and-link-button"
                                primary
                                onClick={onSave}
                                className={classes.marginTop}
                            >
                                {
                                    i18n.t(
                                        'Save {{trackedEntityName}}',
                                        { trackedEntityName: trackedEntityName.toLowerCase() },
                                    )
                                }
                            </Button>
                            <InfoIconText
                                text={translatedTextWithStyles(trackedEntityName, programName, orgUnit.name)}
                            />
                        </>
                    }

                </>
            }
        </>
    );
};

export const EnrollmentRegistrationEntry: ComponentType<OwnProps> = withStyles(styles)(EnrollmentRegistrationEntryPlain);
