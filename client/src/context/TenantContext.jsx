import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TenantContext = createContext(null);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const { user } = useAuth();
  const [tenantId, setTenantId] = useState(null);
  const [clinicId, setClinicId] = useState(null);

  useEffect(() => {
    if (user) {
      setTenantId(user.tenantId);
      setClinicId(user.clinicId);
    } else {
      setTenantId(null);
      setClinicId(null);
    }
  }, [user]);

  const value = {
    tenantId,
    clinicId,
    setTenantId,
    setClinicId,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};
