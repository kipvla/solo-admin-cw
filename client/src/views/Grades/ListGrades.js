import React from 'react';

import CustomTable from '../../components/myComponents/CustomTable/CustomTable';

export default function ListGrades() {
  return (
    <div>
      <CustomTable
        tableName={'Clients'}
        query={'user/admin/getAllUsers'}
        queryByID={'user-admin-getUserById'}
        deleteQuery={'test/grade/disable'}
      />
    </div>
  );
}
