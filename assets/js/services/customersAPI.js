import React from 'react';
import Axios from 'axios';
import { CUSTOMERS_API } from "../config";

function findAll() {
    return Axios
    .get(CUSTOMERS_API)
    .then(response => response.data['hydra:member'])
}

function find(id) {
  return  Axios
      .get(CUSTOMERS_API + "/" + id)
      .then(response => response.data)
}

function deleteCustomer(id) {
    return Axios
    .delete(CUSTOMERS_API + "/" + + id)
}

function update(id, customer) {
   return Axios.put(CUSTOMERS_API + "/" + + id, customer);
}

function create(customer) {
   return Axios.post(
    CUSTOMERS_API,
        customer
      );
}
export default {
    findAll,
    find,
    update,
    create,
    delete: deleteCustomer
}