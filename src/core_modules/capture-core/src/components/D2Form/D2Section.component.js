// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Section from '../Section/Section.component';
import SectionHeaderSimple from '../Section/SectionHeaderSimple.component';

import D2SectionFields from './D2SectionFields.container';

import MetaDataSection from '../../metaData/RenderFoundation/Section';

import contextTypes from './contextTypes.const';

const getStyles = () => ({
    sectionFieldsInSection: {
        paddingTop: 10,
    },
});

type Props = {
    sectionMetaData: MetaDataSection,
    isHidden?: ?boolean,
    classes: {
        sectionFieldsInSection: string,
    },
    sectionId: string,
    formBuilderId: string,
    formId: string,
};

class D2Section extends Component<Props> {
    sectionFieldsInstance: ?D2SectionFields;
    renderSectionHeader() {
        const title = this.props.sectionMetaData.name;

        if (!title) {
            return null;
        }

        return (
            <SectionHeaderSimple
                title={title}
            />
        );
    }

    getContext = (contextType: $Values<typeof contextTypes>) => this.props[contextType];

    render() {
        const { sectionMetaData, isHidden, classes, sectionId, ...passOnProps } = this.props;

        if (isHidden) {
            return null;
        }

        if (!sectionMetaData.showContainer) {
            return (
                <D2SectionFields
                    ref={(instance) => { this.sectionFieldsInstance = instance; }}
                    fieldsMetaData={sectionMetaData.elements}
                    {...passOnProps}
                    getContext={this.getContext}
                />
            );
        }
        return (
            <div>
                <Section
                    header={this.renderSectionHeader()}
                    elevation={2}
                >
                    <div
                        className={classes.sectionFieldsInSection}
                    >
                        <D2SectionFields
                            ref={(instance) => { this.sectionFieldsInstance = instance; }}
                            fieldsMetaData={sectionMetaData.elements}
                            {...passOnProps}
                            getContext={this.getContext}
                        />
                    </div>
                </Section>
            </div>
        );
    }
}

export default withStyles(getStyles)(D2Section);
