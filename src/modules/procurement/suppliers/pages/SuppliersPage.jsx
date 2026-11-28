import React from 'react'
import { useSuppliers } from '../hooks/suppliers.hooks';

const SuppliersPage = () => {
    const { data: supplierData, isLoading: supplierDataLoading } = useSuppliers();
    console.log(supplierData);
    

  return (
    <>
    <h1>asfasf</h1>
    </>
  )
}

export default SuppliersPage