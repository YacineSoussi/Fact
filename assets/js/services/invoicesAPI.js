import axios from "axios";
import { INVOICES_API } from "../config";


function findAll() {
    return axios
    .get(INVOICES_API)
    .then(response => response.data['hydra:member'])
}

function find(id) {
    return axios.get(INVOICES_API + id)
    .then(response => response.data);
  }

function deleteInvoice(id) {
   return axios
   .delete(INVOICES_API + id)
}

function create(invoice) {
    return axios.post(INVOICES_API, {...invoice,
    customer: `/api/customers/${invoice.customer}`
  });
}

function update(id, invoice) {
    return axios.put(INVOICES_API + "/" + id, {
      ...invoice,
      customer: `/api/customers/${invoice.customer}`
    });
  }

export default {
    findAll,
    update,
    create,
    find,
    delete: deleteInvoice
}