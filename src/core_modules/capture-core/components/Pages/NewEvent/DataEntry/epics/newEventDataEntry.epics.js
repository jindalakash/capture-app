// @flow
import log from 'loglevel';
import { batchActions } from 'redux-batched-actions';
import { rulesExecutedPostUpdateField } from '../../../../DataEntry/actions/dataEntry.actions';
import {
    actionTypes as editEventSelectorActionTypes,
} from '../../../EditEvent/EditEventSelector/EditEventSelector.actions';
import {
    actionTypes as viewEventSelectorActionTypes,
} from '../../../ViewEvent/ViewEventSelector/ViewEventSelector.actions';
import {
    actionTypes as mainPageSelectorActionTypes,
} from '../../../MainPage/MainPageSelector/MainPageSelector.actions';
import {
    actionTypes as newEventDataEntryActionTypes,
    batchActionTypes as newEventDataEntryBatchActionTypes,
    cancelOpenNewEventInDataEntry,
    batchActionTypes,
} from '../actions/dataEntry.actions';
import {
    openNewEventInDataEntry,
    resetDataEntry,
} from '../actions/dataEntryLoad.actionBatchs';
import {
    getRulesActionsForEvent,
} from '../../../../../rulesEngineActionsCreator';
import {
    actionTypes as newEventSelectionTypes,
} from '../actions/dataEntryUrl.actions';
import {
    actionTypes as newEventSelectorTypes,
} from '../../SelectorLevel/selectorLevel.actions';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
} from '../../../../../rulesEngineActionsCreator/inputHelpers';
import getProgramAndStageFromProgramId from
    '../../../../../metaData/helpers/EventProgram/getProgramAndStageFromProgramId';
import { errorCreator } from 'capture-core-utils';
import { getDefaultMainConfig as getDefaultMainColumnConfig, getMetaDataConfig as getColumnMetaDataConfig } from '../../../MainPage/EventsList/defaultColumnConfiguration';
import {
    resetList,
} from '../../../../List/list.actions';
import type {
    FieldData,
} from '../../../../../rulesEngineActionsCreator/inputHelpers';
import {
    listId,
} from '../../RecentlyAddedEventsList/RecentlyAddedEventsList.const';
import getStageForEventProgram from '../../../../../metaData/helpers/EventProgram/getStageFromProgramId';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../../metaData';
import { actionTypes as crossPageActionTypes } from '../../../actions/crossPage.actions';

const errorMessages = {
    PROGRAM_OR_STAGE_NOT_FOUND: 'Program or stage not found',
};


export const resetDataEntryForNewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        newEventSelectorTypes.OPEN_NEW_EVENT_FROM_NEW_EVENT_PAGE,
        newEventDataEntryBatchActionTypes.SAVE_NEW_EVENT_ADD_ANOTHER_BATCH,
    )
        .map(() => {
            const state = store.getState();
            const programId = state.currentSelections.programId;

            // cancel if tracker program
            const program = getProgramFromProgramIdThrowIfNotFound(programId);
            if (program instanceof TrackerProgram) {
                return cancelOpenNewEventInDataEntry();
            }

            const orgUnitId = state.currentSelections.orgUnitId;
            const orgUnit = state.organisationUnits[orgUnitId];
            const metadataContainer = getProgramAndStageFromProgramId(programId);
            if (metadataContainer.error) {
                log.error(
                    errorCreator(
                        errorMessages.PROGRAM_OR_STAGE_NOT_FOUND)(
                        { method: 'resetDataEntryForNewEventEpic' }),
                );
            }

            const foundation = metadataContainer.stage && metadataContainer.stage.stageForm;
            return batchActions(
                // $FlowSuppress
                [...resetDataEntry(metadataContainer.program, foundation, orgUnit)],
                batchActionTypes.RESET_DATA_ENTRY_ACTIONS_BATCH,
            );
        });


export const openNewEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        editEventSelectorActionTypes.OPEN_NEW_EVENT,
        viewEventSelectorActionTypes.OPEN_NEW_EVENT,
        mainPageSelectorActionTypes.OPEN_NEW_EVENT,
        newEventSelectionTypes.VALID_SELECTIONS_FROM_URL,
        newEventSelectorTypes.SET_PROGRAM_ID,
        newEventSelectorTypes.SET_CATEGORY_OPTION,
        crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATED,
    )
        .filter((action) => {
            const type = action.type;
            const triggeringActionType = action.payload && action.payload.triggeringActionType;
            if (type === crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATED) {
                return (!!triggeringActionType) && [
                    newEventSelectorTypes.SET_ORG_UNIT,
                ].includes(triggeringActionType);
            }
            return true;
        })
        .map(() => {
            const state = store.getState();
            const selectionsComplete = state.currentSelections.complete;
            if (!selectionsComplete) {
                return cancelOpenNewEventInDataEntry();
            }
            const programId = state.currentSelections.programId;
            // cancel if tracker program
            const program = getProgramFromProgramIdThrowIfNotFound(programId);
            if (program instanceof TrackerProgram) {
                return cancelOpenNewEventInDataEntry();
            }

            const orgUnitId = state.currentSelections.orgUnitId;
            const orgUnit = state.organisationUnits[orgUnitId];
            const metadataContainer = getProgramAndStageFromProgramId(programId);
            if (metadataContainer.error) {
                log.error(
                    errorCreator(
                        errorMessages.PROGRAM_OR_STAGE_NOT_FOUND)(
                        { method: 'openNewEventInDataEntryEpic' }),
                );
            }
            const foundation = metadataContainer.stage && metadataContainer.stage.stageForm;
            return batchActions(
                // $FlowSuppress
                [...openNewEventInDataEntry(metadataContainer.program, foundation, orgUnit)],
                batchActionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH,
            );
        });

export const resetRecentlyAddedEventsWhenNewEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.ofType(
        editEventSelectorActionTypes.OPEN_NEW_EVENT,
        viewEventSelectorActionTypes.OPEN_NEW_EVENT,
        mainPageSelectorActionTypes.OPEN_NEW_EVENT,
        newEventSelectionTypes.VALID_SELECTIONS_FROM_URL,
        newEventSelectorTypes.SET_CATEGORY_OPTION,
        newEventSelectorTypes.SET_PROGRAM_ID,
        crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATED,
    )
        .filter((action) => {
            // cancel if triggered by SELECTIONS_COMPLETENESS_CALCULATED and the underlying action is not SET_ORG_UNIT
            const type = action.type;
            if (type === crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATED) {
                const triggeringActionType = action.payload && action.payload.triggeringActionType;
                if (triggeringActionType !== newEventSelectorTypes.SET_ORG_UNIT) {
                    return false;
                }
            }

            // cancel if selections are incomplete
            const state = store.getState();
            if (!state.currentSelections.complete) {
                return false;
            }

            // cancel if tracker program
            const programId = state.currentSelections.programId;
            const program = getProgramFromProgramIdThrowIfNotFound(programId);
            return !(program instanceof TrackerProgram);
        })
        .map(() => {
            const state = store.getState();
            const newEventsMeta = { sortById: 'created', sortByDirection: 'desc' };
            const stageContainer = getStageForEventProgram(state.currentSelections.programId);
            const columnConfig = [...getDefaultMainColumnConfig(stageContainer.stage), ...getColumnMetaDataConfig(stageContainer.stage.stageForm)];
            return resetList(listId, columnConfig, newEventsMeta, state.currentSelections);
        });


const runRulesForNewSingleEvent = (store: ReduxStore, dataEntryId: string, itemId: string, uid: string, fieldData?: ?FieldData) => {
    const state = store.getState();
    const formId = getDataEntryKey(dataEntryId, itemId);
    const programId = state.currentSelections.programId;
    const metadataContainer = getProgramAndStageFromProgramId(programId);

    const orgUnitId = state.currentSelections.orgUnitId;
    const orgUnit = state.organisationUnits[orgUnitId];

    let rulesActions;
    if (metadataContainer.error) {
        const foundation = metadataContainer.stage ? metadataContainer.stage.stageForm : null;
        rulesActions = getRulesActionsForEvent(
            metadataContainer.program,
            foundation,
            formId,
            orgUnit,
        );
    } else {
        // $FlowSuppress
        const foundation: RenderFoundation = metadataContainer.stage.stageForm;

        const currentEventValues = getCurrentClientValues(state, foundation, formId, fieldData);
        const currentEventMainData = getCurrentClientMainData(state, itemId, dataEntryId, {}, foundation);
        const currentEventData = { ...currentEventValues, ...currentEventMainData };

        rulesActions = getRulesActionsForEvent(
            metadataContainer.program,
            foundation,
            formId,
            orgUnit,
            currentEventData,
            [currentEventData],
        );
    }

    return batchActions([
        ...rulesActions,
        rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
    ],
    batchActionTypes.RULES_EFFECTS_ACTIONS_BATCH,
    );
};

export const runRulesOnUpdateDataEntryFieldForSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH)
        .map(actionBatch =>
            actionBatch.payload.find(action => action.type === newEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE))
        .map((action) => {
            const { dataEntryId, itemId, uid } = action.payload;
            return runRulesForNewSingleEvent(store, dataEntryId, itemId, uid);
        });

export const runRulesOnUpdateFieldForSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(batchActionTypes.UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH)
        .map(actionBatch =>
            actionBatch.payload.find(action => action.type === newEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE))
        .map((action) => {
            const { dataEntryId, itemId, uid, elementId, value, uiState } = action.payload;
            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };
            return runRulesForNewSingleEvent(store, dataEntryId, itemId, uid, fieldData);
        });
