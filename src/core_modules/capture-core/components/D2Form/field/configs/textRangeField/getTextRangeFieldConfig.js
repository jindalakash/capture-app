// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { TextRangeFieldForForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getNumberFieldConfig = (metaData: MetaDataElement, options: Object, extraProps?: ?Object) => {
  const props = createProps(
    {
      formHorizontal: options.formHorizontal,
      fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
      multiLine: extraProps && extraProps.multiLine,
    },
    options,
    metaData,
  );

  return createFieldConfig(
    {
      component: TextRangeFieldForForm,
      props,
    },
    metaData,
  );
};

export default getNumberFieldConfig;
