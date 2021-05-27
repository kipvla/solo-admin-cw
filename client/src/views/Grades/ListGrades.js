import React from 'react'

import CustomTable from '../../components/myComponents/CustomTable/CustomTable'

export default function ListGrades() {
  const entityID = JSON.parse(localStorage.getItem('entity'))._id
  return (
    <div>
      <CustomTable
        tableName={'Grados'}
        query={`test/grade/${entityID}`}
        queryByID={`test-gradeByID`}
        deleteQuery={`test/grade/disable`}
      />
    </div>
  )
}
