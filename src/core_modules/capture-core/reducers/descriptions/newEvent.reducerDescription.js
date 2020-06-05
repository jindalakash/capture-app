// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as selectorActionTypes } from '../../components/Pages/MainPage/tempSelector.actions';
import {
    dataEntryActionTypes as newEventDataEntryActionTypes,
    dataEntryWrapperActionTypes as newEventDataEntryWrapperActionTypes,
    newRelationshipActionTypes as newEventNewRelationshipActionTypes,
} from '../../components/Pages/NewEvent';
import { lockedSelectorActionTypes } from "../../components/Pages/components/LockedSelector/actions";
import {
    actionTypes as viewEventPageActionTypes,
} from '../../components/Pages/ViewEvent/ViewEventSelector/ViewEventSelector.actions';

export const newEventPageDesc = createReducerDescription({
    [selectorActionTypes.OPEN_NEW_EVENT_PAGE]: (state) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = true;
        newState.selectionsError = null;
        newState.showAddRelationship = false;
        return newState;
    },
    // [editEventPageActionTypes.OPEN_NEW_EVENT]: (state) => {
    //     const newState = { ...state };
    //     newState.dataEntryIsLoading = true;
    //     newState.showAddRelationship = false;
    //     return newState;
    // },
    [viewEventPageActionTypes.OPEN_NEW_EVENT]: (state) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = true;
        newState.showAddRelationship = false;
        return newState;
    },
    [newEventDataEntryActionTypes.NEW_EVENT_IN_DATAENTRY_OPENING_CANCEL]: (state) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = false;
        return newState;
    },
    [newEventDataEntryActionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY]: (state) => {
        const newState = { ...state };
        newState.dataEntryIsLoading = false;
        newState.showAddRelationship = false;
        return newState;
    },
    [newEventDataEntryActionTypes.NEW_EVENT_OPEN_NEW_RELATIONSHIP]: state => ({
        ...state,
        showAddRelationship: true,
    }),
    [newEventNewRelationshipActionTypes.ADD_NEW_EVENT_RELATIONSHIP]: state => ({
        ...state,
        showAddRelationship: false,
    }),
    [newEventNewRelationshipActionTypes.RECENTLY_ADDED_RELATIONSHIP]: (state, action) => ({
        ...state,
        recentlyAddedRelationshipId: action.payload.relationshipId,
    }),
    [newEventDataEntryActionTypes.SCROLLED_TO_RELATIONSHIPS]: state => ({
        ...state,
        recentlyAddedRelationshipId: null,
    }),
    [newEventNewRelationshipActionTypes.NEW_EVENT_CANCEL_NEW_RELATIONSHIP]: (state) => {
        const newState = { ...state };
        newState.showAddRelationship = false;
        return newState;
    },
    [newEventDataEntryWrapperActionTypes.SET_NEW_EVENT_FORM_LAYOUT_DIRECTION]: (state, action) => {
        const newState = { ...state };
        newState.formHorizontal = action.payload.formHorizontal;
        return newState;
    },
    [newEventDataEntryActionTypes.SET_NEW_EVENT_SAVE_TYPES]: (state, action) => {
        const newState = { ...state };
        newState.saveTypes = action.payload.saveTypes;
        return newState;
    },
}, 'newEventPage');
