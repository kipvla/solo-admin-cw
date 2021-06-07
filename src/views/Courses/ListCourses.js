import React from 'react';

import CustomTable from '../../components/myComponents/CustomTable/CustomTable';

export default function ListCourses() {
  return (
    <div>
      <CustomTable
        tableName={'Courses'}
        query={'course/admin/getAllCourses'}
        queryByID={'course-admin-getCourseById'}
        deleteQuery={'course/admin/delete'}
      />
    </div>
  );
}
