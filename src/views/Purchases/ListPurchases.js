import React from 'react';

import CustomTable from '../../components/myComponents/CustomTable/CustomTable';

export default function ListPurchases() {
  return (
    <div>
      <CustomTable
        tableName={'Purchases'}
        query={'payment/admin/purchases'}
        queryByID={'payment-admin-getPurchaseById'}
        deleteQuery={''}
      />
    </div>
  );
}
