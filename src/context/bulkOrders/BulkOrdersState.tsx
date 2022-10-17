import React from 'react';
import BulkOrdersContext from './bulkOrdersContext';
import authContext from '../auth/authContext';

/**
 * Lightweight context used to store bulk order ID when customer is NOT logged in
 */
const BulkOrdersState = ({ children }: React.PropsWithChildren) => {
  const { isAuthenticated } = React.useContext(authContext);
  const [bulkOrderId, setBulkOrderId] = React.useState<string | null>(null);

  const storedBulkOrderId = localStorage.getItem('bulkOrderId');

  const updateBulkOrderId = React.useCallback(
    (bulkOrderId: string) => {
      if (!isAuthenticated) {
        localStorage.setItem('bulkOrderId', bulkOrderId);
        setBulkOrderId(bulkOrderId);
      }
    },
    [isAuthenticated]
  );

  React.useEffect(() => {
    if (storedBulkOrderId && !isAuthenticated) {
      setBulkOrderId(storedBulkOrderId);
    }
  }, [storedBulkOrderId, isAuthenticated]);

  return (
    <BulkOrdersContext.Provider value={{ bulkOrderId, updateBulkOrderId }}>
      {children}
    </BulkOrdersContext.Provider>
  );
};

export default BulkOrdersState;
