import axios from "axios";
import CustomersAPI from "./customersAPI";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";

/**
 * Déconnexion (suppression du token du localStorage et sur Axios)
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
    
  }

function authenticate(credentials) {
    return axios
      .post(LOGIN_API, credentials)
      .then(response => response.data.token)
      .then(token => {
        // Je stocke le token dans mon localStorage
        window.localStorage.setItem("authToken", token);
        setAxiosToken(token);    

      });
  }

  /**
 * Mise en place lors du chargement de l'application
 */
function setup() {
    // 1. Voir si on a un token ?
    const token = window.localStorage.getItem("authToken");
    // 2. Si le token est encore valide
    if (token) {
      const { exp: expiration } = jwtDecode(token);
      if (expiration * 1000 > new Date().getTime()) {
        setAxiosToken(token);
      }
    }
  }
  /** 

  /**
 * Positionne le token JWT sur Axios
 * @param {string} token Le token JWT
 */
function setAxiosToken(token) {
    // On prévient Axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HTTP
    axios.defaults.headers["Authorization"] = "Bearer " + token;
  }

  /**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
    // 1. Voir si on a un token ?
    const token = window.localStorage.getItem("authToken");
    // 2. Si le token est encore valide
    if (token) {
      const { exp: expiration } = jwtDecode(token);
      if (expiration * 1000 > new Date().getTime()) {
        return true;
      }
      return false;
    }
    return false;
  }
  

  export default {
      authenticate,
      logout,
      setup,
      isAuthenticated
  }
