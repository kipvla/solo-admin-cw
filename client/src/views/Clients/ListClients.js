import React from 'react';

import CustomTable from '../../components/myComponents/CustomTable/CustomTable';

export default function ListClients() {
  return (
    <div>
      <CustomTable
        tableName={'Clients'}
        query={'user/admin/getAllUsers'}
        queryByID={'user-admin-getUserById'}
        deleteQuery={''}
      />
    </div>
  );
}
