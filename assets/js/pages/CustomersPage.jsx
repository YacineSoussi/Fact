import React, { useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Pagination from '../components/Pagination';
import CustomersAPI from "../services/customersAPI";
import { toast } from 'react-toastify';
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    
    //  Permet d'aller récuperer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data);
            setLoading(false);
        } catch(error) {
            toast.error("impossible de charger les clients")
        }
    }
        // Au chargement du composant on va chercher les customers
    useEffect(() => {
        fetchCustomers();
    }, []);

        // Gesion de la supression d'un customers
    const handleDelete = async (id) => {
        const originalCustomers = [...customers];

        setCustomers(customers.filter(customer => customer.id !== id));

        try {
            await CustomersAPI.delete(id)
            toast.success("Le client a bien été supprimé")
        } catch(error) {
            setCustomers(originalCustomers);
            toast.error("La supression du client n'a pas pu fonctionner")
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
        
        const ItemsPerPage = 8;

    // filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter( 
        c => 
        c.firstName.toLowerCase().includes(search.toLowerCase()) || 
        c.lastName.toLowerCase().includes(search.toLowerCase())
        );
    
    // Pagination des données   
    const paginatedCustomers = Pagination.getData(
        filteredCustomers, 
        currentPage, 
        ItemsPerPage);

    return ( 
        <>
        <div className=" mb-3 d-flex justify-content-between align-items-center">
           <h1>Liste des clients</h1>
           <Link to="/customers/new" className='btn btn-primary'>Créer un client</Link>   
        </div>
    

        <div className="form-group">
            <input type="text" onChange={handleSearch} value={search}className="form-control" placeholder="Rechercher.."/>
        </div>
    <table className="table table-hover">
        <thead>
            <tr>
                <th>Id.</th>
                <th>Client</th>
                <th>Email</th>
                <th>Entreprise</th>
                <th>Factures</th>
                <th>Montant total</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {paginatedCustomers.map(customer => <tr key={customer.id}>

                <td>{customer.id}</td>
                <td>
                    <Link to={"/customers/" + customer.id}>
                {customer.firstName} {customer.lastName}
                </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center"><span className="badge badge-primary">{customer.invoices.length}</span></td>
                <td className="text-center">{customer.totalAmount.toLocaleString()}</td>
                <td><button 
                onClick={() => handleDelete(customer.id)}
                disabled={customer.invoices.length > 0} 
                className="btn btn-sm btn-danger">Supprimer</button></td>
            </tr> )}
            
        </tbody>
    </table>
    {loading && <TableLoader />}


    { ItemsPerPage < filteredCustomers.length && (<Pagination 
    currentPage={currentPage} 
    itemsPerPage={ItemsPerPage} 
    length={filteredCustomers.length} 
    onPageChanged={handlePageChange}/>
  
        )}
    </>
    
    );
};
 
export default CustomersPage;