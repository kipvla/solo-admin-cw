import React from 'react';
import EntityOperationAdmin from '../EntityAdmin/EntityOperationAdmin';

import PropTypes from 'prop-types';

export default function AddCourses(props) {
  const { operation } = props.match.params;
  return (
    <div>
      <EntityOperationAdmin
        {...props}
        operation={operation}
        queryPost={'course/admin'}
        queryGet={'course/admin/getAllCourses'}
        categoryName={'Course'}
        entity={'courses'}
      />
    </div>
  );
}

AddCourses.propTypes = {
  match: PropTypes.any,
};
