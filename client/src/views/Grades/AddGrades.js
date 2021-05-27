import React from 'react'
import EntityOperationAdmin from '../EntityAdmin/EntityOperationAdmin'

import PropTypes from 'prop-types'

export default function AddGrades(props) {
  const { operation } = props.match.params
  const entityID = JSON.parse(localStorage.getItem('entity'))._id
  return (
    <div>
      <EntityOperationAdmin
        {...props}
        operation={operation}
        queryPost={'test/grade'}
        queryGet={`test/grade/${entityID}`}
        categoryName={'Grado'}
        entity={'grade'}
      />
    </div>
  )
}

AddGrades.propTypes = {
  match: PropTypes.any,
}
