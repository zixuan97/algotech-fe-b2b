import React from 'react';

type BulkOrdersStateInit = {
  bulkOrderId: string | null;
  updateBulkOrderId: (bulkOrderId: string) => void;
};

const bulkOrdersContext = React.createContext({
  bulkOrderId: null
} as BulkOrdersStateInit);

export default bulkOrdersContext;
