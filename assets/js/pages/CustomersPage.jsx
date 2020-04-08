import React, { useEffect, useState} from 'react';
import axios from "axios";
import Pagination from '../components/Pagination';
import CustomersAPI from "../services/customersAPI";

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    
    //  Permet d'aller récuperer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data)
        } catch(error) {
            console.log(error.response)
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
        } catch(error) {
            setCustomers(originalCustomers);
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
    <h1>Liste des clients</h1> 

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
                <td><a href="#">{customer.firstName} {customer.lastName}</a></td>
                <td>{customer.email}</td>
                <td>{customer.entreprise}</td>
                <td className="text-center"><span className="badge badge-primary">{customer.invoices.length}</span></td>
                <td className="text-center">{customer.totalAmount.toLocaleString()}</td>
                <td><button 
                onClick={() => handleDelete(customer.id)}
                disabled={customer.invoices.length > 0} 
                className="btn btn-sm btn-danger">Supprimer</button></td>
            </tr> )}
            
        </tbody>
    </table>

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