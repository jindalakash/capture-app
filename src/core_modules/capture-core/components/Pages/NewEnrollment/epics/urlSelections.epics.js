// @flow
import i18n from '@dhis2/d2-i18n';
import { getApi } from '../../../../d2/d2Instance';
import {
    actionTypes,
    setCurrentOrgUnitBasedOnUrl,
    errorRetrievingOrgUnitBasedOnUrl,
    invalidSelectionsFromUrl,
    validSelectionsFromUrl,
    setEmptyOrgUnitBasedOnUrl,
} from '../actions/url.actions';
import { programCollection } from '../../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../../metaData';

export const getOrgUnitDataForNewEnrollmentUrlUpdateEpic = (action$: InputObservable) =>

    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(actionTypes.UPDATE_SELECTIONS_FROM_URL)
        .filter(action => action.payload.nextProps.orgUnitId)
        .switchMap(action => getApi()
            .get(`organisationUnits/${action.payload.nextProps.orgUnitId}`)
            .then(({ id, displayName: name, code }) =>
                setCurrentOrgUnitBasedOnUrl({ id, name, code }),
            )
            .catch(() =>
                errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit')),
            ),
        );

export const emptyOrgUnitForNewEnrollmentUrlUpdateEpic = (action$: InputObservable) =>

    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(actionTypes.UPDATE_SELECTIONS_FROM_URL)
        .filter(action => !action.payload.nextProps.orgUnitId)
        .map(() => setEmptyOrgUnitBasedOnUrl());

export const validationForNewEnrollmentUrlUpdateEpic = (action$: InputObservable, store: ReduxStore) =>

    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(actionTypes.SET_ORG_UNIT_BASED_ON_URL, actionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL)
        .map(() => {
            const { programId, orgUnitId } = store.getState().currentSelections;

            if (programId) {
                const program = programCollection.get(programId);
                if (!program) {
                    return invalidSelectionsFromUrl(i18n.t("Program doesn't exist"));
                }

                if (!(program instanceof TrackerProgram)) {
                    return invalidSelectionsFromUrl(i18n.t(
                        "Program with programid {{programId}} isn't a tracker program. Enrollments can only be done in tracker programs.",
                        { programId }));
                }

                if (orgUnitId && !program.organisationUnits[orgUnitId]) {
                    return invalidSelectionsFromUrl(i18n.t('Selected program is invalid for selected registering unit'));
                }
            }

            return validSelectionsFromUrl();
        });
