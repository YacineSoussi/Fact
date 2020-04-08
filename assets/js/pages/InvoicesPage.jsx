import React, { useEffect, useState} from 'react';
import axios from "axios";
import Pagination from '../components/Pagination';
import InvoicesAPI from "../services/InvoicesAPI";
import moment from "moment";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    
    //  Permet d'aller récuperer les invoices

    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll()
            setInvoices(data)
        } catch(error) {
            console.log(error.response)
        }
    }

    const formatDate = (str) => moment(str).format('DD/MM/YYYY');


// Au chargement du composant on va chercher les invoices
    useEffect(() => {
        fetchInvoices();
    }, []);

    // Gesion de la supression d'un invoices 
    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.delete(id)
        } catch(error) {
            setinvoices(originalInvoices);
        }
       
    
};
    // Gestion du changement de page

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    
    // Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        const value = currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }
        
        const ItemsPerPage = 10;

    // filtrage des invoices en fonction de la recherche
    const filteredInvoices = invoices.filter( 
        i => 
        i.customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
        i.customer.lastName.toLowerCase().includes(search.toLowerCase())
        );
    
    // Pagination des données   
    const paginatedInvoices = Pagination.getData(
        filteredInvoices, 
        currentPage, 
        ItemsPerPage);

    return ( 
        <>
    <h1>Liste des factures</h1> 

        <div className="form-group">
            <input type="text" onChange={handleSearch} value={search}className="form-control" placeholder="Rechercher.."/>
        </div>
    <table className="table table-hover">
        <thead>
            <tr>
                <th>Numéro</th>
                <th>Client</th>
                <th>Date d'envoi</th>
                <th>Statut</th>
                <th>Montant</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {paginatedInvoices.map(invoice => <tr key={invoice.id}>

                <td>{invoice.chrono}</td>
                <td><a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a></td>
                <td>{formatDate(invoice.sentAt)}</td>
                <td className="text-center">
                    <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}> {STATUS_LABELS[invoice.status]} </span> 
                </td>
                <td className="text-center"><span className="badge badge-primary">{invoice.invoices.length}</span></td>
                <td className="text-center">{invoice.amount.toLocaleString()}</td>
                <td>
                    <button className="btn btn-sm btn-primary mr-1">Éditer</button>
                    <button 
                onClick={() => handleDelete(invoice.id)}
                className="btn btn-sm btn-danger">Supprimer</button> </td>
            </tr> )}
            
        </tbody>
    </table>

    { ItemsPerPage < filteredInvoices.length && ( <Pagination 
    currentPage={currentPage} 
    itemsPerPage={ItemsPerPage} 
    length={filteredInvoices.length} 
    onPageChanged={handlePageChange}/>
  
        )}
    </>
    
    );
};
 
export default InvoicesPage;