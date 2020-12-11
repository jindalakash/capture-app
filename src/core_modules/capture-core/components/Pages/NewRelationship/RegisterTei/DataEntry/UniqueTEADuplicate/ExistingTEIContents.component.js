// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { Button } from '../../../../../Buttons';
import CardList from '../../../../../CardList/CardList.component';
import { DataElement } from '../../../../../../metaData';

type Props = {
  attributeValues: { [id: string]: any },
  dataElements: Array<DataElement>,
  onLink: (values: Object) => void,
  onCancel: Function,
};

class ExistingTEIContents extends React.Component<Props> {
  handleLink = () => {
    this.props.onLink(this.props.attributeValues);
  };

  render() {
    const { attributeValues, dataElements, onCancel } = this.props;

    const items = [
      {
        id: 'foundTEI',
        values: attributeValues,
      },
    ];

    return (
      <>
        <DialogContent>
          <DialogTitle>{i18n.t('Registered person')}</DialogTitle>
          <CardList items={items} dataElements={dataElements} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} secondary>
            {i18n.t('Cancel')}
          </Button>
          <Button onClick={this.handleLink} primary>
            {i18n.t('Link')}
          </Button>
        </DialogActions>
      </>
    );
  }
}

export default ExistingTEIContents;
