import fields from '@foscia/jsonapi/actions/context/enhancers/fields';
import fieldsFor from '@foscia/jsonapi/actions/context/enhancers/fieldsFor';
import filterBy from '@foscia/jsonapi/actions/context/enhancers/filterBy';
import paginate from '@foscia/jsonapi/actions/context/enhancers/paginate';
import sortBy from '@foscia/jsonapi/actions/context/enhancers/sortBy';
import sortByAsc from '@foscia/jsonapi/actions/context/enhancers/sortByAsc';
import sortByDesc from '@foscia/jsonapi/actions/context/enhancers/sortByDesc';

export default {
  ...filterBy.extension,
  ...fields.extension,
  ...fieldsFor.extension,
  ...sortBy.extension,
  ...sortByAsc.extension,
  ...sortByDesc.extension,
  ...paginate.extension,
};
